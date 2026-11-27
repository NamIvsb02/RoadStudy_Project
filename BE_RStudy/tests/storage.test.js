// Kiểm tra lớp lưu trữ file (utils/storage) và thứ tự "lưu mới -> cập nhật DB -> xóa cũ".
// Phần 1-3 chạy độc lập, không cần server. Phần 4 cần server đang chạy (bỏ qua nếu không có).
// Phần 5 chỉ chạy khi STORAGE_DRIVER=cloudinary và đủ 3 biến CLOUDINARY_* (gọi Cloudinary thật, tạo rồi xóa file).
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const prisma = require('../src/config/database');
const storage = require('../src/utils/storage');
const accountRepository = require('../src/repositories/accountRepository');
const accountService = require('../src/services/accountService');
const { signAccessToken } = require('../src/utils/jwt');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const PNG_1X1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const PDF_MIN = Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF');
let passed = 0;
let failed = 0;
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const png = () => ({ buffer: PNG_1X1, mimetype: 'image/png' });
const exists = (ref) => fs.existsSync(path.resolve(storage.UPLOAD_ROOT, ref.replace(/^\/?uploads\//, '')));

async function main() {
    console.log(`Kiểm tra lưu trữ file (driver: ${storage.driver()})\n`);
    const created = [];
    const track = (ref) => { created.push(ref); return ref; };

    try {
        // 1. Phân tích URL Cloudinary
        console.log('[1. parseCloudinaryUrl]');
        const img = storage.parseCloudinaryUrl('https://res.cloudinary.com/demo/image/upload/v1700000000/roadstudy/dev/avatars/abc.jpg');
        check('Ảnh công khai: tách đúng publicId, version, format', img?.publicId === 'roadstudy/dev/avatars/abc' && img.version === '1700000000' && img.format === 'jpg' && img.type === 'upload' && img.resourceType === 'image', JSON.stringify(img));
        const priv = storage.parseCloudinaryUrl('https://res.cloudinary.com/demo/image/authenticated/v1/roadstudy/dev/proofs/x.png');
        check('Ảnh riêng tư: type authenticated', priv?.type === 'authenticated' && priv.publicId === 'roadstudy/dev/proofs/x', JSON.stringify(priv));
        const raw = storage.parseCloudinaryUrl('https://res.cloudinary.com/demo/raw/upload/v2/roadstudy/dev/resources/doc.pdf');
        check('Tài liệu raw: publicId giữ nguyên đuôi file', raw?.resourceType === 'raw' && raw.publicId === 'roadstudy/dev/resources/doc.pdf' && raw.format === null, JSON.stringify(raw));
        const signedPriv = storage.parseCloudinaryUrl('https://res.cloudinary.com/demo/image/authenticated/s--AbC_12-x--/v1700000000/roadstudy/dev/proofs/x.png');
        check('URL đã ký (s--...--): bỏ qua chữ ký, tách đúng publicId', signedPriv?.publicId === 'roadstudy/dev/proofs/x' && signedPriv.version === '1700000000' && signedPriv.format === 'png', JSON.stringify(signedPriv));
        check('Đường dẫn local -> null', storage.parseCloudinaryUrl('/uploads/avatars/a.jpg') === null);
        check('URL không phải Cloudinary -> null', storage.parseCloudinaryUrl('https://evil.example.com/image/upload/v1/a.jpg') === null);

        // 2. Driver local
        console.log('[2. Driver local: lưu, xóa, đường dẫn an toàn]');
        if (storage.driver() === 'local') {
            const pub = track(await storage.save(png(), 'avatars'));
            check('Ảnh công khai trả /uploads/avatars/<tên>.png và file tồn tại', /^\/uploads\/avatars\/[\w-]+\.png$/.test(pub) && exists(pub), pub);
            const priv2 = track(await storage.save(png(), 'proofs', { isPrivate: true }));
            check('Ảnh riêng tư trả proofs/<tên>.png (không có /uploads)', /^proofs\/[\w-]+\.png$/.test(priv2) && exists(priv2), priv2);
            const read = await storage.readPrivate(priv2, 'proofs');
            check('readPrivate local trả { file }', !!read.file && fs.existsSync(read.file));
            let err = null;
            await storage.readPrivate(priv2, 'avatars').catch((e) => { err = e; });
            check('readPrivate sai thư mục -> 404', err?.statusCode === 404, err?.message);
            err = null;
            await storage.readPrivate('proofs/../../package.json', 'proofs').catch((e) => { err = e; });
            check('readPrivate đường dẫn thoát thư mục -> 404', err?.statusCode === 404, err?.message);
            await storage.remove(pub);
            check('remove xóa file', !exists(pub));
            await storage.remove('/uploads/../package.json');
            check('remove không xóa file ngoài thư mục uploads', fs.existsSync(path.join(storage.UPLOAD_ROOT, '../package.json')));
            await storage.remove('/uploads/avatars/khong-ton-tai.png');
            check('remove file không còn -> không ném lỗi', true);
            await storage.remove(null);
            check('remove giá trị rỗng -> không ném lỗi', true);
            err = null;
            await storage.save({ buffer: PNG_1X1, mimetype: 'text/plain' }, 'avatars').catch((e) => { err = e; });
            check('save mimetype lạ -> 400', err?.statusCode === 400, err?.message);
        } else {
            console.log('  (bỏ qua: driver không phải local)');
        }

        // 3. Thứ tự lưu mới -> DB -> xóa cũ khi có sự cố
        console.log('[3. Avatar: sự cố giữa chừng không làm mất ảnh đang dùng]');
        if (storage.driver() === 'local') {
            const oldRef = track(await storage.save(png(), 'avatars'));
            const user = { id: 'test-user-id', role: 'STUDENT' };
            const origFind = accountRepository.findByIdSafe;
            const origUpdate = accountRepository.updateAvatarIfCurrent;
            const countAvatars = () => fs.readdirSync(path.join(storage.UPLOAD_ROOT, 'avatars')).length;
            const before = countAvatars();
            const db = { avatarUrl: oldRef }; // DB giả, cập nhật kiểu compare-and-set như repository thật
            try {
                accountRepository.findByIdSafe = async () => ({ id: user.id, avatarUrl: db.avatarUrl });
                accountRepository.updateAvatarIfCurrent = async () => { throw new Error('mất kết nối DB'); };
                let err = null;
                await accountService.updateAvatar(user, png()).catch((e) => { err = e; });
                check('DB lỗi: lỗi được ném ra', err?.message === 'mất kết nối DB', err?.message);
                check('DB lỗi: ảnh CŨ vẫn còn', exists(oldRef));
                check('DB lỗi: ảnh MỚI vừa lưu đã bị xóa (không để file thừa)', countAvatars() === before);

                // Request khác đổi ảnh đúng lúc này: compare-and-set thất bại
                accountRepository.updateAvatarIfCurrent = async () => false;
                err = null;
                await accountService.updateAvatar(user, png()).catch((e) => { err = e; });
                check('Bị request khác đổi trước: 409', err?.statusCode === 409, err?.message);
                check('Bị request khác đổi trước: ảnh mới của mình đã xóa, ảnh đang dùng còn', countAvatars() === before && exists(oldRef));

                accountRepository.updateAvatarIfCurrent = async (id, expected, url) => {
                    if (db.avatarUrl !== expected) return false;
                    db.avatarUrl = url;
                    return true;
                };
                const result = await accountService.updateAvatar(user, png());
                track(result.avatarUrl);
                check('Thành công: DB nhận URL ảnh mới', db.avatarUrl === result.avatarUrl && result.avatarUrl !== oldRef);
                check('Thành công: ảnh mới tồn tại, ảnh cũ bị xóa', exists(result.avatarUrl) && !exists(oldRef));

                accountRepository.findByIdSafe = async () => null;
                const countBefore = fs.readdirSync(path.join(storage.UPLOAD_ROOT, 'avatars')).length;
                err = null;
                await accountService.updateAvatar(user, png()).catch((e) => { err = e; });
                check('Tài khoản không tồn tại -> 404 và không lưu file nào', err?.statusCode === 404 && fs.readdirSync(path.join(storage.UPLOAD_ROOT, 'avatars')).length === countBefore, err?.message);
            } finally {
                accountRepository.findByIdSafe = origFind;
                accountRepository.updateAvatarIfCurrent = origUpdate;
            }
        } else {
            console.log('  (bỏ qua: driver không phải local)');
        }

        // 4. Qua HTTP (cần server)
        console.log('[4. HTTP: đổi avatar hai lần và xem minh chứng]');
        const alive = await fetch(API.replace(/\/api$/, '') + '/health').then((r) => r.ok).catch(() => false);
        if (!alive) {
            console.log('  (bỏ qua: server không chạy)');
        } else {
            const stamp = Date.now();
            const account = await prisma.account.create({ data: { fullName: 'HV Luu Tru', email: `luutru.${stamp}@example.com`, passwordHash: 'x', role: 'STUDENT', status: 'HOAT_DONG' } });
            const student = await prisma.student.create({ data: { accountId: account.id } });
            const token = signAccessToken({ sub: account.id, role: 'STUDENT' });
            const upload = async () => {
                const form = new FormData();
                form.append('avatar', new Blob([PNG_1X1], { type: 'image/png' }), 'a.png');
                const res = await fetch(`${API}/account/avatar`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
                return { status: res.status, json: await res.json().catch(() => null) };
            };
            try {
                const first = await upload();
                const url1 = first.json?.data?.avatarUrl;
                check('Đổi avatar lần 1 -> 200 có avatarUrl', first.status === 200 && !!url1, `${first.status}`);
                const second = await upload();
                const url2 = second.json?.data?.avatarUrl;
                check('Đổi avatar lần 2 -> 200, URL khác lần 1', second.status === 200 && !!url2 && url2 !== url1, `${second.status}`);
                if (storage.driver() === 'local') {
                    check('Lần 2: ảnh lần 1 đã bị xóa, ảnh lần 2 còn', !exists(url1) && exists(url2));
                } else {
                    check('avatarUrl là URL Cloudinary https', /^https:\/\/res\.cloudinary\.com\//.test(url2), url2);
                    const got = await fetch(url2);
                    check('Ảnh công khai tải được (200)', got.status === 200, `${got.status}`);
                    const old = await fetch(url1);
                    check('Ảnh lần 1 đã bị xóa khỏi Cloudinary (404)', old.status === 404, `${old.status}`);
                }
                await storage.remove(url2);
            } finally {
                await prisma.student.delete({ where: { id: student.id } }).catch(() => {});
                await prisma.account.delete({ where: { id: account.id } }).catch(() => {});
            }
        }

        // 5. Cloudinary thật
        console.log('[5. Cloudinary thật]');
        if (storage.driver() !== 'cloudinary') {
            console.log('  (bỏ qua: cần STORAGE_DRIVER=cloudinary và 3 biến CLOUDINARY_*)');
        } else {
            const pub = await storage.save(png(), 'avatars');
            check('Ảnh công khai: URL nằm trong thư mục môi trường', pub.includes(`/${storage.baseFolder()}/avatars/`), pub);
            check('Ảnh công khai tải được không cần ký', (await fetch(pub)).status === 200);
            const priv3 = await storage.save(png(), 'proofs', { isPrivate: true });
            check('Ảnh riêng tư: URL kiểu authenticated', /\/image\/authenticated\//.test(priv3), priv3);
            const direct = await fetch(priv3);
            check('Ảnh riêng tư KHÔNG tải được khi không có chữ ký', direct.status !== 200, `${direct.status}`);
            const signed = await storage.readPrivate(priv3, 'proofs');
            check('readPrivate tải được qua URL có chữ ký, đúng nội dung PNG', Buffer.isBuffer(signed.buffer) && signed.buffer.subarray(1, 4).toString() === 'PNG' && /image\//.test(signed.contentType), signed.contentType);
            const doc = await storage.save({ buffer: PDF_MIN, mimetype: 'application/pdf' }, 'resources');
            check('Tài liệu: URL raw có đuôi .pdf', /\/raw\/upload\/.*\.pdf$/.test(doc), doc);
            check('Tài liệu tải được', (await fetch(doc)).status === 200);
            for (const ref of [pub, priv3, doc]) await storage.remove(ref);
            // CDN của Cloudinary có thể còn cache file vừa xóa vài giây: thử lại tối đa ~12 giây
            const retry = async (fn) => { for (let i = 0; i < 6; i++) { if (await fn()) return true; await new Promise((res) => setTimeout(res, 2000)); } return false; };
            check('Sau remove: ảnh công khai 404', await retry(async () => (await fetch(pub)).status === 404));
            let err = null;
            const gone = await retry(async () => { err = null; await storage.readPrivate(priv3, 'proofs').catch((e) => { err = e; }); return err?.statusCode === 404; });
            check('Sau remove: readPrivate -> 404', gone, err?.message);
            await storage.remove('https://res.cloudinary.com/nguoi-khac/image/upload/v1/roadstudy/dev/avatars/khong-phai-cua-minh.jpg');
            check('remove URL của cloud khác -> bỏ qua, không ném lỗi', true);
        }
    } finally {
        for (const ref of created) await storage.remove(ref);
        await prisma.$disconnect();
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e); await prisma.$disconnect().catch(() => {}); process.exit(1); });
