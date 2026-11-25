// Integration test cho Cloudinary driver: gọi Cloudinary THẬT và server đang chạy.
//
// Chạy (Git Bash), dùng thư mục riêng cho mỗi lần test để dọn sạch mà không đụng file của người khác:
//   export CLOUDINARY_FOLDER="roadstudy/test-$(date +%s)" STORAGE_DRIVER=cloudinary
//   PORT=5055 npm run dev        # terminal 1: server đọc cùng biến môi trường ở trên
//   PORT=5055 node tests/cloudinary.integration.test.js   # terminal 2
//
// Cần: STORAGE_DRIVER=cloudinary và 3 biến CLOUDINARY_* trong .env; CLOUDINARY_FOLDER bắt đầu bằng roadstudy/test-.
// Test tạo dữ liệu tạm trên DB dùng chung (tài khoản, khóa học, hóa đơn có hậu tố thời gian) và xóa trong finally;
// xóa mọi file trong thư mục CLOUDINARY_FOLDER của lần chạy. Không đụng dữ liệu hay file khác.
require('dotenv').config({ quiet: true });
const prisma = require('../src/config/database');
const storage = require('../src/utils/storage');
const accountRepository = require('../src/repositories/accountRepository');
const accountService = require('../src/services/accountService');
const { signAccessToken } = require('../src/utils/jwt');

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const SECRET = process.env.CLOUDINARY_API_SECRET || '';
const PNG_1X1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const PDF_MIN = Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF');
const DOCX_MIN = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(200, 1)]);
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
let passed = 0;
let failed = 0;
const bodies = []; // mọi response JSON, để kiểm tra không lộ secret

const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const token = (a) => signAccessToken({ sub: a.id, role: a.role });
const call = async (method, p, { auth, body, form } = {}) => {
    const headers = { ...(auth && { Authorization: `Bearer ${token(auth)}` }) };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(API + p, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined) });
    const text = await res.text();
    bodies.push(text);
    let json = null;
    try { json = JSON.parse(text); } catch (_) { }
    return { status: res.status, json, msg: json?.message, text };
};
const formOf = (field, bytes, type, name = 'f') => { const f = new FormData(); f.append(field, new Blob([bytes], { type }), name); return f; };
const httpStatus = async (url) => (await fetch(url, { redirect: 'manual' })).status;
// Cloudinary có CDN cache: file vừa xóa có thể còn trả 200 trong vài giây
const waitGone = async (url, tries = 6) => {
    for (let i = 0; i < tries; i++) {
        const s = await httpStatus(url);
        if (s !== 200) return s;
        await new Promise((r) => setTimeout(r, 2000));
    }
    return 200;
};

async function main() {
    if (storage.driver() !== 'cloudinary') { console.log('Bỏ qua: cần STORAGE_DRIVER=cloudinary và 3 biến CLOUDINARY_*'); process.exit(0); }
    const folder = storage.baseFolder();
    if (!folder.startsWith('roadstudy/test-')) { console.log(`Dừng: CLOUDINARY_FOLDER phải bắt đầu bằng roadstudy/test- (hiện: ${folder}) để test dọn được mà không xóa file thật`); process.exit(1); }
    const health = await fetch(API.replace(/\/api$/, '') + '/health').then((r) => r.ok).catch(() => false);
    if (!health) { console.log(`Dừng: server không chạy ở ${API}`); process.exit(1); }

    const cloudinary = require('cloudinary').v2;
    const listAssets = async () => {
        const out = [];
        for (const [resource_type, type] of [['image', 'upload'], ['image', 'authenticated'], ['raw', 'upload']]) {
            let next_cursor;
            do {
                const page = await cloudinary.api.resources({ resource_type, type, prefix: `${folder}/`, max_results: 500, next_cursor });
                out.push(...page.resources.map((r) => ({ ...r, resource_type, type })));
                next_cursor = page.next_cursor;
            } while (next_cursor);
        }
        return out;
    };
    console.log(`Integration test Cloudinary | thư mục ${folder} | server ${API}\n`);

    const stamp = Date.now();
    const fx = { accounts: [], students: [], teachers: [], admins: [], categories: [] };
    const safe = async (fn) => { try { await fn(); } catch (e) { console.log('  (dọn lỗi)', e.message); } };
    let r;

    try {
        // ---------- Dữ liệu tạm ----------
        const leader = await prisma.account.findUnique({ where: { email: 'leader@roadstudy.vn' } });
        const LEADER = { id: leader.id, role: 'ADMINISTRATOR' };
        const mkAcc = async (name, role) => {
            const a = await prisma.account.create({ data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG' } });
            fx.accounts.push(a.id);
            return a;
        };
        const mkStudent = async (name) => {
            const account = await mkAcc(name, 'STUDENT');
            const student = await prisma.student.create({ data: { accountId: account.id } });
            fx.students.push(student.id);
            return { account, student, auth: { id: account.id, role: 'STUDENT' } };
        };
        const tAcc = await mkAcc('GV Cloud', 'TEACHER');
        const teacher = await prisma.teacher.create({ data: { specialization: 'T', biography: 'T', teachingExperience: 'T', approvalStatus: 'DA_DUYET', accountId: tAcc.id } });
        fx.teachers.push(teacher.id);
        const TEACHER = { id: tAcc.id, role: 'TEACHER' };
        const adAcc = await mkAcc('Admin Cloud Khong Quyen', 'ADMINISTRATOR');
        fx.admins.push((await prisma.administrator.create({ data: { accountId: adAcc.id, isLeader: false } })).id);
        const NOPERM = { id: adAcc.id, role: 'ADMINISTRATOR' };
        const cat = await prisma.category.create({ data: { categoryName: `Cloud ${stamp}` } });
        fx.categories.push(cat.id);
        const course = await prisma.course.create({ data: { courseName: `Khoa Cloud ${stamp}`, description: 'c', price: 1000000, status: 'DANG_MO', startDate: new Date('2030-01-01'), endDate: new Date('2030-06-01'), categoryId: cat.id, teacherId: teacher.id } });
        const S1 = await mkStudent('HV Cloud Mot');
        const S2 = await mkStudent('HV Cloud Hai');

        // ========== 1. Upload / remove trực tiếp qua utils/storage ==========
        console.log('[1. Upload và xóa: ảnh công khai, ảnh riêng tư, PDF, DOCX]');
        const pub = await storage.save({ buffer: PNG_1X1, mimetype: 'image/png' }, 'avatars');
        check('Ảnh công khai: URL https trong thư mục test', pub.startsWith('https://res.cloudinary.com/') && pub.includes(`/${folder}/avatars/`), pub);
        check('Ảnh công khai tải được (200)', (await httpStatus(pub)) === 200);
        const pdf = await storage.save({ buffer: PDF_MIN, mimetype: 'application/pdf' }, 'resources');
        check('PDF: lưu dạng raw, URL có đuôi .pdf', /\/raw\/upload\/.*\.pdf$/.test(pdf), pdf);
        const pdfStatus = await httpStatus(pdf);
        check('PDF tải được (200). Nếu 401: bật "Allow delivery of PDF and ZIP files"', pdfStatus === 200, `${pdfStatus}`);
        const docx = await storage.save({ buffer: DOCX_MIN, mimetype: DOCX_MIME }, 'resources');
        check('DOCX: lưu dạng raw, URL có đuôi .docx', /\/raw\/upload\/.*\.docx$/.test(docx), docx);
        const docxRes = await fetch(docx);
        const docxBytes = Buffer.from(await docxRes.arrayBuffer());
        check('DOCX tải được, đúng nội dung', docxRes.status === 200 && docxBytes.equals(DOCX_MIN), `${docxRes.status} ${docxBytes.length} byte`);
        for (const ref of [pub, pdf, docx]) await storage.remove(ref);
        check('Sau remove: ảnh công khai không còn tải được', (await waitGone(pub)) !== 200);
        check('Sau remove: PDF không còn tải được', (await waitGone(pdf)) !== 200);
        check('Sau remove: DOCX không còn tải được', (await waitGone(docx)) !== 200);
        await storage.remove('https://res.cloudinary.com/demo/image/upload/v1/sample.jpg');
        check('remove URL của cloud khác: bỏ qua, không ném lỗi', true);
        await storage.remove(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/ngoai-thu-muc/abc.jpg`);
        check('remove file ngoài thư mục môi trường: bỏ qua, không ném lỗi', true);

        // ========== 2. Minh chứng thanh toán: không lộ dù biết URL ==========
        console.log('[2. Minh chứng thanh toán: chỉ xem qua API có kiểm tra quyền]');
        const reg = await prisma.courseRegistration.create({ data: { studentId: S1.student.id, courseId: course.id, status: 'CHO_THANH_TOAN' } });
        const inv = await prisma.invoice.create({ data: { subtotal: 1000000, totalAmount: 1000000, paymentMethod: 'CHUYEN_KHOAN', status: 'CHO_THANH_TOAN', studentId: S1.student.id, registrationId: reg.id } });
        r = await call('POST', `/invoice/${inv.id}/proof`, { auth: S1.auth, form: formOf('proof', PNG_1X1, 'image/png') });
        check('Học viên gửi minh chứng -> 200', r.status === 200, `${r.status} ${r.msg}`);
        check('Response không chứa URL Cloudinary của minh chứng', !r.text.includes('res.cloudinary.com') && r.json?.data?.paymentProofUrl === `/api/invoice/${inv.id}/proof`, r.json?.data?.paymentProofUrl);
        const proofRef = (await prisma.invoice.findUnique({ where: { id: inv.id } })).paymentProofUrl;
        check('DB lưu URL kiểu authenticated', /\/image\/authenticated\//.test(proofRef || ''), proofRef);
        check('URL trong DB KHÔNG kèm chữ ký (s--...--)', !/\/s--[\w-]+--\//.test(proofRef || ''), proofRef);
        const directStatus = await httpStatus(proofRef);
        check('Biết URL trong DB, mở trực tiếp không chữ ký -> bị chặn', directStatus !== 200, `${directStatus}`);
        const asPublic = proofRef.replace('/image/authenticated/', '/image/upload/');
        check('Đổi URL sang kiểu công khai (upload) -> không có file', (await httpStatus(asPublic)) !== 200);
        const asset = storage.parseCloudinaryUrl(proofRef);
        const signed = cloudinary.url(asset.publicId, { resource_type: 'image', type: 'authenticated', version: asset.version, format: asset.format, sign_url: true, secure: true });
        check('URL có chữ ký hợp lệ mở được (kiểm tra cơ chế ký)', (await httpStatus(signed)) === 200);
        const tampered = signed.replace(/\/s--([\w-]{8})--\//, (m, sig) => `/s--${sig.slice(0, 7)}${sig[7] === 'A' ? 'B' : 'A'}--/`);
        check('Sửa 1 ký tự chữ ký -> bị chặn', tampered !== signed && (await httpStatus(tampered)) !== 200, tampered === signed ? 'không tìm thấy chữ ký trong URL' : '');
        const otherPath = cloudinary.url(`${folder}/proofs/khong-ton-tai`, { resource_type: 'image', type: 'authenticated', format: 'png', sign_url: true, secure: true });
        check('Chữ ký của file khác không dùng được cho file này', otherPath.split('/s--')[1]?.split('--')[0] !== signed.split('/s--')[1]?.split('--')[0]);
        const proofApi = async (auth) => {
            const res = await fetch(`${API}/invoice/${inv.id}/proof`, { headers: auth ? { Authorization: `Bearer ${token(auth)}` } : {} });
            const bytes = Buffer.from(await res.arrayBuffer());
            return { status: res.status, bytes, type: res.headers.get('content-type') || '' };
        };
        let p = await proofApi(S1.auth);
        check('Chủ hóa đơn xem qua API -> 200, đúng ảnh PNG', p.status === 200 && p.type.startsWith('image/') && p.bytes.subarray(1, 4).toString() === 'PNG', `${p.status} ${p.type}`);
        check('Học viên khác -> 404', (await proofApi(S2.auth)).status === 404);
        check('Giáo viên -> 403', (await proofApi(TEACHER)).status === 403);
        check('Admin không có quyền thanh toán/hoàn tiền -> 403', (await proofApi(NOPERM)).status === 403);
        check('Chưa đăng nhập -> 401', (await proofApi(null)).status === 401);
        check('Leader -> 200', (await proofApi(LEADER)).status === 200);
        await prisma.invoice.update({ where: { id: inv.id }, data: { status: 'THAT_BAI' } });
        r = await call('POST', `/invoice/${inv.id}/proof`, { auth: S1.auth, form: formOf('proof', PNG_1X1, 'image/png') });
        const newProofRef = (await prisma.invoice.findUnique({ where: { id: inv.id } })).paymentProofUrl;
        const oldSigned = cloudinary.url(asset.publicId, { resource_type: 'image', type: 'authenticated', version: asset.version, format: asset.format, sign_url: true, secure: true });
        check('Gửi lại minh chứng -> 200, URL mới khác URL cũ', r.status === 200 && newProofRef !== proofRef, `${r.status} ${r.msg}`);
        check('Minh chứng cũ đã bị xóa trên Cloudinary', (await waitGone(oldSigned)) !== 200);
        check('Minh chứng mới xem được qua API', (await proofApi(S1.auth)).status === 200);
        for (const path of [`/invoice/me`, `/invoice?limit=50`, `/enrollment/me`, `/invoice/${inv.id}`]) {
            const who = path.startsWith('/invoice?') || path === `/invoice/${inv.id}` ? LEADER : S1.auth;
            r = await call('GET', path, { auth: who });
            check(`GET ${path.replace(inv.id, ':id')} không trả URL Cloudinary của minh chứng`, r.status === 200 && !r.text.includes('/image/authenticated/'), `${r.status}`);
        }

        // ========== 3. Đồng thời ==========
        console.log('[3. Đồng thời: nhiều request đổi cùng một ảnh]');
        const C = await mkStudent('HV Cloud Dong Thoi');
        const before = new Set((await listAssets()).map((a) => a.public_id));
        const many = await Promise.all(Array.from({ length: 5 }, () => call('POST', '/account/avatar', { auth: C.auth, form: formOf('avatar', PNG_1X1, 'image/png') })));
        const okCount = many.filter((x) => x.status === 200).length;
        check('5 request đổi avatar cùng lúc: ít nhất 1 thành công, còn lại 409, không lỗi khác', okCount >= 1 && okCount + many.filter((x) => x.status === 409).length === 5, many.map((x) => x.status).join(','));
        const finalUrl = (await prisma.account.findUnique({ where: { id: C.account.id } })).avatarUrl;
        check('Avatar trong DB mở được (không trỏ vào file đã xóa)', (await httpStatus(finalUrl)) === 200, finalUrl);
        const created = (await listAssets()).filter((a) => a.public_id.includes('/avatars/') && !before.has(a.public_id));
        const orphanCount = created.filter((a) => a.secure_url !== finalUrl).length;
        console.log(`  INFO  5 request đồng thời: ${okCount} thành công, ${5 - okCount} nhận 409; còn ${created.length} file avatar mới, ${orphanCount} file mồ côi`);
        check('Không để lại file avatar mồ côi', orphanCount === 0, `${orphanCount}`);

        const P = await mkStudent('HV Cloud Minh Chung');
        const reg2 = await prisma.courseRegistration.create({ data: { studentId: P.student.id, courseId: course.id, status: 'CHO_THANH_TOAN' } });
        const inv2 = await prisma.invoice.create({ data: { subtotal: 1000000, totalAmount: 1000000, paymentMethod: 'CHUYEN_KHOAN', status: 'CHO_THANH_TOAN', studentId: P.student.id, registrationId: reg2.id } });
        const beforeProofs = new Set((await listAssets()).map((a) => a.public_id));
        const proofs = await Promise.all(Array.from({ length: 4 }, () => call('POST', `/invoice/${inv2.id}/proof`, { auth: P.auth, form: formOf('proof', PNG_1X1, 'image/png') })));
        const finalProof = (await prisma.invoice.findUnique({ where: { id: inv2.id } })).paymentProofUrl;
        const pp = await fetch(`${API}/invoice/${inv2.id}/proof`, { headers: { Authorization: `Bearer ${token(P.auth)}` } });
        const proofOk = proofs.filter((x) => x.status === 200).length;
        check('4 lần gửi minh chứng cùng lúc: thành công + 409 = 4, minh chứng trong DB xem được', proofOk >= 1 && proofOk + proofs.filter((x) => x.status === 409).length === 4 && pp.status === 200 && !!finalProof, `${proofs.map((x) => x.status).join(',')} | proof ${pp.status}`);
        const newProofs = (await listAssets()).filter((a) => a.public_id.includes('/proofs/') && !beforeProofs.has(a.public_id));
        check('Không để lại minh chứng mồ côi', newProofs.length === 1 && storage.parseCloudinaryUrl(finalProof).publicId === newProofs[0].public_id, `${newProofs.length} file mới`);

        // ========== 4. Sự cố: DB lỗi sau khi upload, xóa trên Cloudinary lỗi ==========
        console.log('[4. Sự cố giữa chừng]');
        const origFind = accountRepository.findByIdSafe;
        const origUpdate = accountRepository.updateAvatarIfCurrent;
        const origDestroy = cloudinary.uploader.destroy;
        try {
            const oldUrl = await storage.save({ buffer: PNG_1X1, mimetype: 'image/png' }, 'avatars');
            const fake = { id: 'fake-user', role: 'STUDENT' };
            const db = { avatarUrl: oldUrl };
            accountRepository.findByIdSafe = async () => ({ id: fake.id, avatarUrl: db.avatarUrl });
            let attemptedUrl = null;
            accountRepository.updateAvatarIfCurrent = async (id, expected, url) => { attemptedUrl = url; throw new Error('mất kết nối DB'); };
            let err = null;
            await accountService.updateAvatar(fake, { buffer: PNG_1X1, mimetype: 'image/png' }).catch((e) => { err = e; });
            check('Upload xong nhưng DB lỗi: lỗi được trả về', err?.message === 'mất kết nối DB', err?.message);
            check('Upload xong nhưng DB lỗi: file mới đã bị xóa khỏi Cloudinary', !!attemptedUrl && (await waitGone(attemptedUrl)) !== 200, attemptedUrl);
            check('Upload xong nhưng DB lỗi: ảnh cũ vẫn còn', (await httpStatus(oldUrl)) === 200);

            cloudinary.uploader.destroy = async () => { throw new Error('Cloudinary 500 giả lập'); };
            let savedUrl = null;
            accountRepository.updateAvatarIfCurrent = async (id, expected, url) => { if (db.avatarUrl !== expected) return false; savedUrl = url; db.avatarUrl = url; return true; };
            const result = await accountService.updateAvatar(fake, { buffer: PNG_1X1, mimetype: 'image/png' });
            check('Xóa ảnh cũ trên Cloudinary lỗi: đổi ảnh vẫn thành công', result.avatarUrl === savedUrl && (await httpStatus(savedUrl)) === 200);
            check('Xóa ảnh cũ lỗi: ảnh cũ còn lại (thành file mồ côi, không mất ảnh đang dùng)', (await httpStatus(oldUrl)) === 200);
            cloudinary.uploader.destroy = origDestroy;
            await storage.remove(oldUrl);
            await storage.remove(savedUrl);
        } finally {
            accountRepository.findByIdSafe = origFind;
            accountRepository.updateAvatarIfCurrent = origUpdate;
            cloudinary.uploader.destroy = origDestroy;
        }

        // ========== 5. Giới hạn dung lượng ==========
        console.log('[5. Giới hạn dung lượng]');
        const beforeBig = (await listAssets()).length;
        r = await call('POST', '/account/avatar', { auth: S2.auth, form: formOf('avatar', Buffer.concat([PNG_1X1, Buffer.alloc(2 * 1024 * 1024)]), 'image/png') });
        check('Avatar vượt 2MB -> 400 "Tệp tối đa 2MB"', r.status === 400 && /2MB/.test(r.msg || ''), `${r.status} ${r.msg}`);
        check('File quá lớn không được đưa lên Cloudinary', (await listAssets()).length === beforeBig);
        const big = Buffer.concat([PNG_1X1, Buffer.alloc(Math.floor(1.9 * 1024 * 1024))]);
        const uploaders = [];
        for (let i = 0; i < 8; i++) uploaders.push(await mkStudent(`HV Cloud Tai ${i}`));
        const t0 = Date.now();
        const heavy = await Promise.all(uploaders.map((u) => call('POST', '/account/avatar', { auth: u.auth, form: formOf('avatar', big, 'image/png') })));
        console.log(`  INFO  8 upload 1,9MB đồng thời xong sau ${Date.now() - t0} ms: ${heavy.map((x) => x.status).join(',')}`);
        check('8 upload 1,9MB đồng thời: không có lỗi 500', heavy.every((x) => x.status !== 500), heavy.map((x) => `${x.status}`).join(','));

        // ========== 6. Secret không xuất hiện trong response ==========
        console.log('[6. API secret không lộ trong response]');
        check('Không response nào chứa CLOUDINARY_API_SECRET', SECRET.length > 0 && bodies.every((b) => !b.includes(SECRET)), `${bodies.length} response`);
        check('Không response nào chứa chuỗi "api_secret"', bodies.every((b) => !/api_secret/i.test(b)));
    } finally {
        await safe(() => prisma.supportRequest.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.notification.deleteMany({ where: { accountId: { in: fx.accounts } } }));
        await safe(() => prisma.invoice.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.courseRegistration.deleteMany({ where: { studentId: { in: fx.students } } }));
        await safe(() => prisma.course.deleteMany({ where: { categoryId: { in: fx.categories } } }));
        await safe(() => prisma.category.deleteMany({ where: { id: { in: fx.categories } } }));
        await safe(() => prisma.student.deleteMany({ where: { id: { in: fx.students } } }));
        await safe(() => prisma.teacher.deleteMany({ where: { id: { in: fx.teachers } } }));
        await safe(() => prisma.administrator.deleteMany({ where: { id: { in: fx.admins } } }));
        await safe(() => prisma.account.deleteMany({ where: { id: { in: fx.accounts } } }));
        // Xóa mọi file của lần chạy (chỉ trong thư mục roadstudy/test-*)
        const leftovers = await listAssets().catch(() => []);
        for (const a of leftovers) await safe(() => cloudinary.uploader.destroy(a.public_id, { resource_type: a.resource_type, type: a.type, invalidate: true }));
        const remain = await listAssets().catch(() => [{}]);
        const left = { accounts: await prisma.account.count({ where: { email: { contains: `.${stamp}@` } } }), cloudinaryFiles: remain.length };
        console.log(`\nĐã xóa ${leftovers.length} file trong ${folder}/. Còn sót: ${JSON.stringify(left)}`);
        check('Đã dọn sạch dữ liệu test (DB và Cloudinary)', left.accounts === 0 && left.cloudinaryFiles === 0);
        await prisma.$disconnect();
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch(async (e) => { console.error('Lỗi khi chạy test:', e.message); await prisma.$disconnect().catch(() => {}); process.exit(1); });
