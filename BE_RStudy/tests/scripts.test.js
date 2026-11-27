// Test cho scripts/migrate-uploads-to-cloudinary.js và scripts/cleanup-orphan-files.js.
// Dùng DB giả, Cloudinary giả và thư mục tạm trong thư mục tạm của hệ điều hành:
// KHÔNG kết nối database, KHÔNG gọi Cloudinary, không cần server. Chạy: node tests/scripts.test.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const realStorage = require('../src/utils/storage');
const { migrate } = require('../scripts/migrate-uploads-to-cloudinary');
const { cleanup } = require('../scripts/cleanup-orphan-files');

let passed = 0;
let failed = 0;
const check = (name, ok, detail = '') => {
    if (ok) { passed++; console.log(`  PASS  ${name}`); }
    else { failed++; console.log(`  FAIL  ${name}  -> ${detail}`); }
};
const quiet = () => {};
const CLOUD = 'mycloud';
const FOLDER = 'roadstudy/test-scripts';
process.env.CLOUDINARY_CLOUD_NAME = CLOUD;
const HOUR = 3600 * 1000;
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');

// DB giả: 4 model, mỗi model một mảng bản ghi
const FIELD_OF = { account: 'avatarUrl', course: 'coverImageUrl', resource: 'fileUrl', invoice: 'paymentProofUrl' };
function fakePrisma(seed = {}) {
    const db = { account: [], course: [], resource: [], invoice: [], ...seed };
    const faults = { findMany: null, updateMany: null, onFindMany: null };
    const model = (name) => ({
        findMany: async () => {
            if (faults.findMany) throw new Error(faults.findMany);
            const rows = db[name].map((row) => ({ ...row }));
            if (faults.onFindMany) await faults.onFindMany(name);
            return rows;
        },
        findFirst: async ({ where }) => {
            const [field, cond] = Object.entries(where)[0];
            return db[name].find((row) => typeof row[field] === 'string' && row[field].includes(cond.contains)) || null;
        },
        updateMany: async ({ where, data }) => {
            if (faults.updateMany) throw new Error(faults.updateMany);
            const field = FIELD_OF[name];
            const rows = db[name].filter((row) => row.id === where.id && row[field] === where[field]);
            rows.forEach((row) => Object.assign(row, data));
            return { count: rows.length };
        },
    });
    return { db, faults, account: model('account'), course: model('course'), resource: model('resource'), invoice: model('invoice') };
}
const snapshot = (prisma) => JSON.stringify(prisma.db);

// Storage giả cho migrate: ghi nhận upload/xóa, có thể giả lập lỗi
function fakeStorage(uploadRoot) {
    const state = { saved: [], removed: [], failSave: false, n: 0 };
    return {
        state,
        ...realStorage,
        UPLOAD_ROOT: uploadRoot,
        driver: () => 'cloudinary',
        baseFolder: () => FOLDER,
        save: async (file, folder, { isPrivate = false } = {}) => {
            if (state.failSave) throw new Error('Cloudinary 503 giả lập');
            const url = `https://res.cloudinary.com/${CLOUD}/image/${isPrivate ? 'authenticated' : 'upload'}/v1/${FOLDER}/${folder}/m${++state.n}.png`;
            state.saved.push(url);
            return url;
        },
        remove: async (ref) => { state.removed.push(ref); },
    };
}

// Cloudinary giả cho cleanup
function fakeCloudinary(assets) {
    const state = { destroyed: [], failDestroy: new Set(), failList: false, afterList: null };
    return {
        state,
        api: {
            resources: async ({ resource_type, type }) => {
                if (state.failList) throw new Error('Cloudinary 500 giả lập');
                // Cố tình KHÔNG lọc theo prefix để kiểm tra lớp phòng thủ của script
                const page = assets.filter((a) => a.resource_type === resource_type && a.type === type && !state.destroyed.includes(a.public_id));
                if (state.afterList) await state.afterList();
                return { resources: page.map((a) => ({ ...a })) };
            },
        },
        uploader: {
            destroy: async (publicId) => {
                if (state.failDestroy.has(publicId)) throw new Error('destroy 500 giả lập');
                state.destroyed.push(publicId);
                return { result: 'ok' };
            },
        },
    };
}
const asset = (publicId, { type = 'upload', resource_type = 'image', ageHours = 48, cloud = CLOUD } = {}) => ({
    public_id: publicId,
    resource_type,
    type,
    created_at: new Date(Date.now() - ageHours * HOUR).toISOString(),
    secure_url: `https://res.cloudinary.com/${cloud}/${resource_type}/${type}/v1/${publicId}${resource_type === 'raw' ? '' : '.png'}`,
});
const urlOf = (a) => a.secure_url;
const cloudStorage = { ...realStorage, driver: () => 'cloudinary', baseFolder: () => FOLDER };

function tempUploads(files) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-scripts-'));
    for (const [rel, ageHours] of Object.entries(files)) {
        const file = path.join(root, rel);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, PNG);
        const t = (Date.now() - ageHours * HOUR) / 1000;
        fs.utimesSync(file, t, t);
    }
    return root;
}

async function main() {
    console.log('Kiểm tra script migrate và cleanup (DB, Cloudinary giả)\n');
    const roots = [];
    try {
        // MIGRATE
        console.log('[1. Migrate: dry-run]');
        let root = tempUploads({ 'covers/a.png': 1, 'avatars/b.png': 1, 'proofs/c.png': 1 });
        roots.push(root);
        let prisma = fakePrisma({
            course: [{ id: 'c1', coverImageUrl: '/uploads/covers/a.png' }],
            account: [{ id: 'a1', avatarUrl: '/uploads/avatars/b.png' }, { id: 'a2', avatarUrl: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/x.png` }, { id: 'a3', avatarUrl: null }],
            invoice: [{ id: 'i1', paymentProofUrl: 'proofs/c.png' }, { id: 'i2', paymentProofUrl: 'proofs/khong-co.png' }],
        });
        let storage = fakeStorage(root);
        let before = snapshot(prisma);
        let s = await migrate({ apply: false, prisma, storage, uploadRoot: root, log: quiet });
        check('Dry-run: không đổi DB', snapshot(prisma) === before);
        check('Dry-run: không upload, không xóa file nào', storage.state.saved.length === 0 && storage.state.removed.length === 0);
        check('Dry-run: báo 3 file sẽ chuyển, 1 thiếu file, 1 đã là URL', s.planned === 3 && s.missing === 1 && s.skipped === 1 && s.migrated === 0, JSON.stringify(s));
        check('Dry-run không cần STORAGE_DRIVER=cloudinary', (await migrate({ apply: false, prisma, storage: { ...storage, driver: () => 'local' }, uploadRoot: root, log: quiet })).planned === 3);
        let err = null;
        await migrate({ apply: true, prisma, storage: { ...storage, driver: () => 'local' }, uploadRoot: root, log: quiet }).catch((e) => { err = e; });
        check('--apply khi driver không phải cloudinary: dừng, không ghi gì', !!err && snapshot(prisma) === before);

        console.log('[2. Migrate: --apply và idempotency]');
        s = await migrate({ apply: true, prisma, storage, uploadRoot: root, log: quiet });
        check('Apply: chuyển 3 bản ghi', s.migrated === 3 && s.failed === 0, JSON.stringify(s));
        check('Apply: DB trỏ sang URL Cloudinary', prisma.db.course[0].coverImageUrl.startsWith('https://res.cloudinary.com/') && prisma.db.account[0].avatarUrl.startsWith('https://'));
        check('Apply: minh chứng lên dạng riêng tư (authenticated)', /\/image\/authenticated\//.test(prisma.db.invoice[0].paymentProofUrl));
        check('Apply: bản ghi thiếu file giữ nguyên giá trị cũ', prisma.db.invoice[1].paymentProofUrl === 'proofs/khong-co.png');
        check('Apply: không xóa file local', fs.existsSync(path.join(root, 'covers/a.png')) && fs.existsSync(path.join(root, 'proofs/c.png')));
        const savedOnce = storage.state.saved.length;
        before = snapshot(prisma);
        s = await migrate({ apply: true, prisma, storage, uploadRoot: root, log: quiet });
        check('Chạy lại lần 2: không upload thêm, không đổi DB (idempotent)', storage.state.saved.length === savedOnce && snapshot(prisma) === before && s.migrated === 0, JSON.stringify(s));

        console.log('[3. Migrate: lỗi Cloudinary và database]');
        root = tempUploads({ 'covers/a.png': 1, 'avatars/b.png': 1 });
        roots.push(root);
        prisma = fakePrisma({ course: [{ id: 'c1', coverImageUrl: '/uploads/covers/a.png' }], account: [{ id: 'a1', avatarUrl: '/uploads/avatars/b.png' }] });
        storage = fakeStorage(root);
        storage.state.failSave = true;
        before = snapshot(prisma);
        s = await migrate({ apply: true, prisma, storage, uploadRoot: root, log: quiet });
        check('Upload lỗi: báo lỗi, DB không đổi', s.failed === 2 && snapshot(prisma) === before, JSON.stringify(s));
        storage.state.failSave = false;
        prisma.faults.updateMany = 'mất kết nối DB';
        s = await migrate({ apply: true, prisma, storage, uploadRoot: root, log: quiet });
        check('Ghi DB lỗi: báo lỗi, DB không đổi', s.failed === 2 && snapshot(prisma) === before, JSON.stringify(s));
        check('Ghi DB lỗi: file vừa upload bị xóa (không để file mồ côi)', storage.state.saved.length === 2 && storage.state.saved.every((u) => storage.state.removed.includes(u)));
        prisma.faults.updateMany = null;
        prisma.faults.findMany = 'DB sập';
        err = null;
        await migrate({ apply: true, prisma, storage, uploadRoot: root, log: quiet }).catch((e) => { err = e; });
        check('Đọc DB lỗi: dừng với lỗi, không upload', err?.message === 'DB sập' && storage.state.saved.length === 2);
        prisma.faults.findMany = null;

        console.log('[4. Migrate: người dùng đổi ảnh đúng lúc script chạy]');
        storage.state.saved.length = 0;
        storage.state.removed.length = 0;
        const origSave = storage.save;
        storage.save = async (...args) => {
            const url = await origSave(...args);
            if (args[1] === 'avatars') prisma.db.account[0].avatarUrl = 'https://res.cloudinary.com/mycloud/image/upload/v1/roadstudy/test-scripts/avatars/nguoi-dung-vua-doi.png';
            return url;
        };
        s = await migrate({ apply: true, prisma, storage, uploadRoot: root, log: quiet });
        const avatarUpload = storage.state.saved.find((u) => u.includes('/avatars/'));
        check('Không ghi đè ảnh người dùng vừa đổi', prisma.db.account[0].avatarUrl.endsWith('nguoi-dung-vua-doi.png'));
        check('File script vừa upload cho bản ghi đó bị xóa', !!avatarUpload && storage.state.removed.includes(avatarUpload));
        storage.save = origSave;

        // CLEANUP: CLOUDINARY
        console.log('[5. Cleanup Cloudinary: dry-run, không xóa file đang dùng]');
        const used = asset(`${FOLDER}/avatars/dang-dung`);
        const usedProof = asset(`${FOLDER}/proofs/dang-dung`, { type: 'authenticated' });
        const usedDoc = asset(`${FOLDER}/resources/tai-lieu.pdf`, { resource_type: 'raw' });
        const orphanOld = asset(`${FOLDER}/covers/mo-coi`);
        const orphanNew = asset(`${FOLDER}/covers/moi-tai-len`, { ageHours: 1 });
        const otherEnv = asset('roadstudy/prod/avatars/cua-prod');
        const otherFolder = asset('thu-muc-khac/avatars/x');
        const assets = [used, usedProof, usedDoc, orphanOld, orphanNew, otherEnv, otherFolder];
        prisma = fakePrisma({
            account: [{ id: 'a1', avatarUrl: urlOf(used) }],
            invoice: [{ id: 'i1', paymentProofUrl: urlOf(usedProof).replace('/v1/', '/') }],
            resource: [{ id: 'r1', fileUrl: urlOf(usedDoc) }],
        });
        let cloud = fakeCloudinary(assets);
        before = snapshot(prisma);
        let c = await cleanup({ apply: false, prisma, storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('Dry-run: không xóa gì, không đổi DB', cloud.state.destroyed.length === 0 && snapshot(prisma) === before);
        check('Dry-run: chỉ báo 1 file mồ côi đủ tuổi', c.orphans === 1, JSON.stringify(c));
        c = await cleanup({ apply: true, prisma, storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('Apply: chỉ xóa đúng file mồ côi cũ hơn 24 giờ', cloud.state.destroyed.length === 1 && cloud.state.destroyed[0] === orphanOld.public_id, cloud.state.destroyed.join(','));
        check('Không xóa file đang được DB tham chiếu (ảnh, minh chứng, tài liệu raw)', ![used, usedProof, usedDoc].some((a) => cloud.state.destroyed.includes(a.public_id)));
        check('Không xóa file mới hơn 24 giờ', !cloud.state.destroyed.includes(orphanNew.public_id));
        check('Không xóa file của môi trường hoặc thư mục khác', !cloud.state.destroyed.includes(otherEnv.public_id) && !cloud.state.destroyed.includes(otherFolder.public_id) && c.outOfScope === 2, JSON.stringify(c));
        check('Cleanup không ghi gì vào DB', snapshot(prisma) === before);
        c = await cleanup({ apply: true, prisma, storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('Chạy lại lần 2: không xóa thêm (idempotent)', c.deleted === 0 && cloud.state.destroyed.length === 1, JSON.stringify(c));

        console.log('[6. Cleanup Cloudinary: file của cloud khác]');
        const foreign = asset(`${FOLDER}/avatars/cloud-khac`, { cloud: 'cloud-nguoi-khac' });
        cloud = fakeCloudinary([foreign]);
        c = await cleanup({ apply: true, prisma: fakePrisma(), storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('Không xóa file có URL thuộc cloud khác', cloud.state.destroyed.length === 0 && c.outOfScope === 1, JSON.stringify(c));

        console.log('[7. Cleanup Cloudinary: lỗi Cloudinary và database]');
        cloud = fakeCloudinary([orphanOld]);
        cloud.state.failList = true;
        err = null;
        await cleanup({ apply: true, prisma: fakePrisma(), storage: cloudStorage, cloudinary: cloud, log: quiet }).catch((e) => { err = e; });
        check('Liệt kê Cloudinary lỗi: dừng, không xóa gì', !!err && cloud.state.destroyed.length === 0);
        cloud = fakeCloudinary([orphanOld]);
        prisma = fakePrisma();
        prisma.faults.findMany = 'DB sập';
        err = null;
        await cleanup({ apply: true, prisma, storage: cloudStorage, cloudinary: cloud, log: quiet }).catch((e) => { err = e; });
        check('Đọc DB lỗi: dừng, không xóa gì (không coi là "không ai dùng")', err?.message === 'DB sập' && cloud.state.destroyed.length === 0);
        const orphan2 = asset(`${FOLDER}/covers/mo-coi-2`);
        cloud = fakeCloudinary([orphanOld, orphan2]);
        cloud.state.failDestroy.add(orphanOld.public_id);
        c = await cleanup({ apply: true, prisma: fakePrisma(), storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('Xóa một file lỗi: vẫn xóa tiếp file khác, báo số lỗi', c.failed === 1 && c.deleted === 1 && cloud.state.destroyed[0] === orphan2.public_id, JSON.stringify(c));

        console.log('[8. Race: cleanup chạy đúng lúc có upload mới]');
        const racing = asset(`${FOLDER}/avatars/vua-upload`, { ageHours: 1 / 60 });
        cloud = fakeCloudinary([racing]);
        prisma = fakePrisma({ account: [{ id: 'a1', avatarUrl: null }] });
        // Upload xong và ghi DB SAU khi cleanup đã đọc DB, TRƯỚC khi xóa: phải giữ lại nhờ kiểm tra lại DB
        let attached = false;
        prisma.faults.onFindMany = async (name) => {
            if (name === 'invoice' && !attached) { attached = true; prisma.db.account[0].avatarUrl = urlOf(racing); }
        };
        c = await cleanup({ apply: true, minAgeMs: 0, prisma, storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('min-age = 0, DB gắn file sau khi cleanup đọc DB: vẫn giữ file (kiểm tra lại trước khi xóa)', cloud.state.destroyed.length === 0 && c.keptOnRecheck === 1, JSON.stringify(c));
        cloud = fakeCloudinary([racing]);
        prisma = fakePrisma({ account: [{ id: 'a1', avatarUrl: null }] });
        c = await cleanup({ apply: true, prisma, storage: cloudStorage, cloudinary: cloud, log: quiet });
        check('Mặc định 24 giờ: file vừa upload chưa gắn DB (người dùng đang điền form) không bị xóa', cloud.state.destroyed.length === 0 && c.orphans === 0, JSON.stringify(c));

        // CLEANUP: LOCAL
        console.log('[9. Cleanup local]');
        root = tempUploads({ 'avatars/dang-dung.png': 48, 'proofs/dang-dung.png': 48, 'covers/mo-coi.png': 48, 'covers/moi.png': 1 });
        roots.push(root);
        prisma = fakePrisma({ account: [{ id: 'a1', avatarUrl: '/uploads/avatars/dang-dung.png' }], invoice: [{ id: 'i1', paymentProofUrl: 'proofs/dang-dung.png' }] });
        const localStorage = { ...realStorage, driver: () => 'local' };
        c = await cleanup({ apply: false, prisma, storage: localStorage, uploadRoot: root, log: quiet });
        check('Local dry-run: không xóa file nào', ['avatars/dang-dung.png', 'proofs/dang-dung.png', 'covers/mo-coi.png', 'covers/moi.png'].every((f) => fs.existsSync(path.join(root, f))) && c.orphans === 1, JSON.stringify(c));
        c = await cleanup({ apply: true, prisma, storage: localStorage, uploadRoot: root, log: quiet });
        check('Local apply: chỉ xóa file mồ côi đủ tuổi', !fs.existsSync(path.join(root, 'covers/mo-coi.png')) && c.deleted === 1);
        check('Local: giữ avatar công khai và minh chứng riêng tư đang dùng, giữ file mới', ['avatars/dang-dung.png', 'proofs/dang-dung.png', 'covers/moi.png'].every((f) => fs.existsSync(path.join(root, f))));
        c = await cleanup({ apply: true, prisma, storage: localStorage, uploadRoot: root, log: quiet });
        check('Local chạy lại: không xóa thêm', c.deleted === 0);
        prisma.faults.findMany = 'DB sập';
        err = null;
        await cleanup({ apply: true, prisma, storage: localStorage, uploadRoot: root, log: quiet }).catch((e) => { err = e; });
        check('Local, đọc DB lỗi: dừng, không xóa gì', !!err && fs.existsSync(path.join(root, 'avatars/dang-dung.png')));
    } finally {
        for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
    }
    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error('Lỗi khi chạy test:', e); process.exit(1); });
