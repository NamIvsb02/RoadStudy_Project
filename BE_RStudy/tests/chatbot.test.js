require('dotenv').config();
const prisma = require('../src/config/database');
const { signAccessToken } = require('../src/utils/jwt');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}/api/chatbot`;

let passed = 0;
let failed = 0;

const call = async (method, path, { actor = {}, body } = {}) => {
    const token = actor.role ? signAccessToken({ sub: actor.userId || `test-${actor.role}`, role: actor.role }) : null;
    const res = await fetch(BASE + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try {
        json = await res.json();
    } catch (_) { }
    return { status: res.status, json };
};

const check = (name, condition, detail = '') => {
    if (condition) {
        passed++;
        console.log(`  PASS  ${name}`);
    } else {
        failed++;
        console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ''}`);
    }
};

async function main() {
    console.log(`Kiểm tra API Chatbot tại ${BASE}\n`);
    const stamp = Date.now();
    const fx = { accounts: [] };

    try {
        // ---------- Dữ liệu nền ----------
        const mkAccount = async (name, role) => {
            const account = await prisma.account.create({
                data: { fullName: name, email: `${name.replace(/\s/g, '').toLowerCase()}.${stamp}@example.com`, passwordHash: 'x', role, status: 'HOAT_DONG' },
            });
            fx.accounts.push(account.id);
            return account;
        };
        const teacherAcc = await mkAccount('GV Chatbot', 'TEACHER');
        const teacher = await prisma.teacher.create({
            data: { specialization: 'Lập trình', biography: 'Test', teachingExperience: 'Test', approvalStatus: 'DA_DUYET', accountId: teacherAcc.id },
        });
        const category = await prisma.category.create({ data: { categoryName: `Chatbot test ${stamp}` } });
        const mkCourse = (courseName, description, price, status) =>
            prisma.course.create({
                data: {
                    courseName: `${courseName} ${stamp}`, description, price, status,
                    startDate: new Date(), endDate: new Date(Date.now() + 86400000),
                    categoryId: category.id, teacherId: teacher.id,
                },
            });
        const open1 = await mkCourse('Lập trình Python cơ bản', 'Khóa học lập trình Python cho người mới bắt đầu', 300000, 'DANG_MO');
        const open2 = await mkCourse('Toán lớp 10 nâng cao', 'Ôn luyện Toán lớp 10', 200000, 'DANG_MO');
        const draft = await mkCourse('Lập trình Python bản nháp', 'Khóa lập trình Python chưa mở', 100000, 'BAN_NHAP');
        const courseIds = [open1.id, open2.id, draft.id];

        const studentAcc = await mkAccount('HV Chatbot Mot', 'STUDENT');
        const student = await prisma.student.create({ data: { accountId: studentAcc.id } });
        const otherAcc = await mkAccount('HV Chatbot Hai', 'STUDENT');
        const other = await prisma.student.create({ data: { accountId: otherAcc.id } });
        fx.students = [student.id, other.id];
        const S = { role: 'STUDENT', userId: studentAcc.id };
        const S2 = { role: 'STUDENT', userId: otherAcc.id };
        const T = { role: 'TEACHER', userId: teacherAcc.id };

        // ---------- Quyền và dữ liệu đầu vào ----------
        console.log('[Quyền và dữ liệu đầu vào]');
        let r = await call('POST', '/messages', { body: { content: 'xin chào' } });
        check('Không có token -> 401', r.status === 401, `status ${r.status}`);

        r = await call('POST', '/messages', { actor: T, body: { content: 'xin chào' } });
        check('Giáo viên dùng chatbot -> 403', r.status === 403, `status ${r.status}`);

        r = await call('POST', '/messages', { actor: S, body: { content: '   ' } });
        check('Nội dung rỗng -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/messages', { actor: S, body: { content: 'a'.repeat(501) } });
        check('Nội dung quá 500 ký tự -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/messages', { actor: S, body: { content: 'xin chào', role: 'AI' } });
        check('Gửi trường lạ -> 400', r.status === 400, `status ${r.status}`);

        r = await call('POST', '/messages', { actor: S, body: { conversationId: 'khong-ton-tai', content: 'xin chào' } });
        check('Cuộc trò chuyện không tồn tại -> 404', r.status === 404, `status ${r.status}`);

        // ---------- Gợi ý khóa học ----------
        console.log('\n[Gợi ý khóa học]');
        r = await call('POST', '/messages', { actor: S, body: { content: 'Mình muốn học lập trình Python cho người mới, ngân sách dưới 500 nghìn' } });
        check('Gửi tin nhắn đầu tiên -> 201', r.status === 201, `status ${r.status} ${r.json?.message}`);
        const first = r.json?.data;
        if (!first?.conversation?.id) throw new Error('Không tạo được cuộc trò chuyện, dừng test. Xem log ở terminal chạy server.');
        check('Có tin nhắn của học viên (STUDENT)', first.userMessage?.senderType === 'STUDENT');
        check('Có phản hồi của AI (AI, nội dung không rỗng)', first.aiMessage?.senderType === 'AI' && first.aiMessage.content.length > 0);

        check('AI phản hồi bình thường (degraded = false)', first.degraded === false, 'AI đang lỗi, xem dòng Chatbot AI lỗi ở terminal chạy server');

        const recs = first.aiMessage?.recommendations || [];
        if (first.degraded) {
            console.log('  (AI chưa phản hồi được: xem dòng Chatbot AI lỗi ở terminal chạy server và chạy node tests/ai-check.js để kiểm tra khóa và model AI trong .env; bỏ qua các kiểm tra gợi ý)');
            check('Khi AI lỗi: có thông báo hướng dẫn tìm kiếm và không có gợi ý', /tìm kiếm/.test(first.aiMessage.content) && recs.length === 0);
        } else {
            check('Tối đa 5 khóa gợi ý', recs.length <= 5, `${recs.length}`);
            check('Mọi khóa gợi ý đều đang mở (DANG_MO)', recs.every((x) => courseIds.includes(x.course.id) ? x.course.id !== draft.id : true));
            check('Không gợi ý khóa nháp', !recs.some((x) => x.course.id === draft.id));
            check('Mọi khóa gợi ý nằm trong ngân sách 500.000', recs.every((x) => Number(x.course.price) <= 500000));
            check('Mỗi khóa có lý do gợi ý', recs.every((x) => (x.recommendationReason || '').length > 0));
            const saved = await prisma.courseRecommendation.findMany({ where: { messageId: first.aiMessage.id } });
            check('Các khóa gợi ý được lưu vào CSDL', saved.length === recs.length, `${saved.length}/${recs.length}`);
            const dbCourses = await prisma.course.findMany({ where: { id: { in: saved.map((x) => x.courseId) } }, select: { status: true } });
            check('Khóa lưu trong CSDL đều DANG_MO', dbCourses.every((x) => x.status === 'DANG_MO'));
        }

        // ---------- Hội thoại ----------
        console.log('\n[Lịch sử hội thoại]');
        const conversationId = first.conversation.id;
        r = await call('POST', '/messages', { actor: S, body: { conversationId, content: 'Còn khóa nào rẻ hơn không?' } });
        check('Gửi tin tiếp theo trong cùng cuộc trò chuyện -> 201', r.status === 201 && r.json?.data?.conversation?.id === conversationId, `status ${r.status}`);

        r = await call('GET', `/conversations/${conversationId}`, { actor: S });
        const messages = r.json?.data?.messages || [];
        check('Xem cuộc trò chuyện -> 200, đủ 4 tin nhắn', r.status === 200 && messages.length === 4, `status ${r.status}, ${messages.length} tin`);
        check('Thứ tự: học viên, AI, học viên, AI', messages.map((m) => m.senderType).join(',') === 'STUDENT,AI,STUDENT,AI', messages.map((m) => m.senderType).join(','));

        r = await call('GET', '/conversations', { actor: S });
        const listed = (r.json?.data?.items || []).find((c) => c.id === conversationId);
        check('Danh sách cuộc trò chuyện -> 200, có phân trang', r.status === 200 && typeof r.json?.data?.pagination?.total === 'number', `status ${r.status}`);
        check('Có messageCount = 4 và firstMessage', listed?.messageCount === 4 && /Python/.test(listed?.firstMessage || ''), JSON.stringify(listed));

        r = await call('GET', `/conversations/${conversationId}`, { actor: S2 });
        check('Học viên khác xem cuộc trò chuyện -> 404', r.status === 404, `status ${r.status}`);

        r = await call('POST', '/messages', { actor: S2, body: { conversationId, content: 'xin chào' } });
        check('Học viên khác gửi vào cuộc trò chuyện của người khác -> 404', r.status === 404, `status ${r.status}`);

        r = await call('GET', '/conversations', { actor: S2 });
        check('Học viên khác không thấy cuộc trò chuyện của mình', r.status === 200 && !(r.json?.data?.items || []).some((c) => c.id === conversationId));

        // ---------- Giới hạn tốc độ ----------
        console.log('\n[Giới hạn tốc độ]');
        const conv = await prisma.aiConversation.create({ data: { studentId: other.id } });
        await prisma.aiMessage.createMany({ data: Array.from({ length: 6 }, (_, i) => ({ senderType: 'STUDENT', content: `tin ${i}`, conversationId: conv.id })) });
        r = await call('POST', '/messages', { actor: S2, body: { conversationId: conv.id, content: 'tin thứ bảy' } });
        check('Gửi quá 6 tin trong 1 phút -> 429', r.status === 429, `status ${r.status}`);
    } catch (e) {
        check('Chạy test không phát sinh lỗi bất ngờ', false, e.message);
    } finally {
        const safe = async (fn) => { try { await fn(); } catch (_) { } };
        const studentIds = fx.students || [];
        const convs = { studentId: { in: studentIds } };
        await safe(() => prisma.courseRecommendation.deleteMany({ where: { message: { conversation: convs } } }));
        await safe(() => prisma.aiMessage.deleteMany({ where: { conversation: convs } }));
        await safe(() => prisma.aiConversation.deleteMany({ where: convs }));
        await safe(() => prisma.student.deleteMany({ where: { id: { in: studentIds } } }));
        await safe(() => prisma.course.deleteMany({ where: { category: { categoryName: { startsWith: 'Chatbot test' }, courses: { some: { courseName: { endsWith: String(stamp) } } } } } }));
        await safe(() => prisma.category.deleteMany({ where: { categoryName: `Chatbot test ${stamp}` } }));
        await safe(() => prisma.teacher.deleteMany({ where: { accountId: { in: fx.accounts } } }));
        await safe(() => prisma.account.deleteMany({ where: { id: { in: fx.accounts } } }));
    }

    console.log(`\nKẾT QUẢ: ${passed} đạt, ${failed} lỗi`);
    await prisma.$disconnect();
    process.exit(failed ? 1 : 0);
}

main().catch(async (e) => {
    console.error('\nLỗi khi chạy test (server đã chạy chưa? đúng port chưa?):', e.message);
    await prisma.$disconnect().catch(() => { });
    process.exit(1);
});