const { Prisma } = require("@prisma/client");
const AppError = require("../utils/AppError");
const repo = require("../repositories/examRepository");

const { Decimal } = Prisma;
const MAX_ATTEMPTS = 3;
const EXAM_STATUSES = ["BAN_NHAP", "DA_PHE_DUYET", "DANG_MO", "TAM_NGUNG"];
const BOTH = ["TEACHER", "ADMINISTRATOR"];

// Luồng trạng thái: [từ][đến] = các vai trò được phép chuyển
const TRANSITIONS = {
    BAN_NHAP: { DA_PHE_DUYET: ["ADMINISTRATOR"] },
    DA_PHE_DUYET: { DANG_MO: BOTH },
    DANG_MO: { TAM_NGUNG: BOTH },
    TAM_NGUNG: { DANG_MO: BOTH, BAN_NHAP: BOTH },
};

const totalOf = (questions) => questions.reduce((sum, q) => sum.add(q.score), new Decimal(0));

// ---------- Phân quyền theo khóa học ----------
// Admin: mọi khóa. Giáo viên: chỉ khóa mình phụ trách và phải là giáo viên đã được duyệt.
async function assertCanManageCourse(user, courseId) {
    const course = await repo.findCourseById(courseId);
    if (!course) throw new AppError("Khóa học không tồn tại", 404);
    if (user.role === "ADMINISTRATOR") return course;

    const teacher = await repo.findTeacherByAccountId(user.id);
    if (!teacher || teacher.approvalStatus !== "DA_DUYET" || course.teacherId !== teacher.id) {
        throw new AppError("Bạn không phụ trách khóa học này", 403);
    }
    return course;
}

async function assertStudentCanAccess(user, courseId) {
    const studentId = await repo.findStudentIdByAccountId(user.id);
    if (!studentId) throw new AppError("Tài khoản không phải học viên", 403);
    if (!(await repo.hasConfirmedRegistration(studentId, courseId))) {
        throw new AppError("Bạn cần được xác nhận đăng ký khóa học để xem đề thi", 403);
    }
    return studentId;
}

// Câu hỏi/đáp án/điểm chỉ sửa được khi đề ở trạng thái nháp và chưa có bài làm
function assertContentEditable(exam) {
    if (exam._count.attempts > 0) {
        throw new AppError("Đề thi đã có bài làm, không thể sửa câu hỏi, đáp án hoặc điểm", 409);
    }
    if (exam.status !== "BAN_NHAP") {
        throw new AppError("Chỉ sửa được câu hỏi khi đề ở trạng thái nháp (BAN_NHAP)", 409);
    }
}

async function loadExam(id) {
    const exam = await repo.findExamById(id);
    if (!exam) throw new AppError("Đề thi không tồn tại", 404);
    return exam;
}

const withTotal = (exam) => ({ ...exam, totalScore: totalOf(exam.questions).toFixed(2) });

// ---------- Exam ----------
async function create(user, data) {
    await assertCanManageCourse(user, data.courseId);

    const questions = data.questions.map((q, i) => ({ ...q, questionOrder: q.questionOrder ?? i + 1 }));
    if (new Set(questions.map((q) => q.questionOrder)).size !== questions.length) {
        throw new AppError("Thứ tự câu hỏi (questionOrder) bị trùng", 400);
    }
    if (new Decimal(data.passingScore).gt(totalOf(questions))) {
        throw new AppError("Điểm đạt không được lớn hơn tổng điểm các câu hỏi", 400);
    }

    const exam = await repo.createExam({
        courseId: data.courseId,
        examName: data.examName,
        durationMinutes: data.durationMinutes,
        passingScore: data.passingScore,
        questions,
    });
    return withTotal(exam);
}

async function listByCourse(user, courseId, query, { skip, take }) {
    const course = await repo.findCourseById(courseId);
    if (!course) throw new AppError("Khóa học không tồn tại", 404);

    const where = { courseId };
    let studentId = null;

    if (user.role === "STUDENT") {
        studentId = await assertStudentCanAccess(user, courseId);
        where.status = "DANG_MO";
    } else {
        await assertCanManageCourse(user, courseId);
        if (EXAM_STATUSES.includes(query.status)) where.status = query.status;
    }

    const [exams, total] = await repo.findManyByCourse(where, { skip, take });
    const used = studentId ? await repo.countAttemptsByExams(studentId, exams.map((e) => e.id)) : null;

    const items = exams.map((e) => {
        const { _count, ...exam } = e;
        return studentId
            ? { ...exam, questionCount: _count.questions, attemptsUsed: used.get(e.id) || 0, maxAttempts: MAX_ATTEMPTS }
            : { ...exam, questionCount: _count.questions, attemptCount: _count.attempts };
    });
    return { items, total };
}

async function getById(user, id) {
    const exam = await loadExam(id);

    if (user.role === "STUDENT") {
        if (exam.status !== "DANG_MO") throw new AppError("Đề thi không tồn tại hoặc chưa mở", 404);
        const studentId = await assertStudentCanAccess(user, exam.courseId);
        const used = await repo.countAttemptsByExams(studentId, [exam.id]);
        // Học viên chỉ xem thông tin đề; câu hỏi chỉ được gửi khi bắt đầu làm bài
        return {
            id: exam.id,
            examName: exam.examName,
            durationMinutes: exam.durationMinutes,
            passingScore: exam.passingScore,
            status: exam.status,
            courseId: exam.courseId,
            questionCount: exam.questions.length,
            attemptsUsed: used.get(exam.id) || 0,
            maxAttempts: MAX_ATTEMPTS,
        };
    }

    await assertCanManageCourse(user, exam.courseId);
    return withTotal(exam);
}

async function update(user, id, data) {
    const exam = await loadExam(id);
    await assertCanManageCourse(user, exam.courseId);

    if (data.durationMinutes !== undefined && data.durationMinutes !== exam.durationMinutes && exam._count.attempts > 0) {
        throw new AppError("Đề thi đã có bài làm, không thể đổi thời gian làm bài", 409);
    }
    const passing = new Decimal(data.passingScore ?? exam.passingScore);
    if (exam.questions.length > 0 && passing.gt(totalOf(exam.questions))) {
        throw new AppError("Điểm đạt không được lớn hơn tổng điểm các câu hỏi", 400);
    }
    await repo.updateExam(id, data);
    return withTotal(await loadExam(id));
}

async function changeStatus(user, id, status) {
    const exam = await loadExam(id);
    await assertCanManageCourse(user, exam.courseId);

    const allowedRoles = TRANSITIONS[exam.status]?.[status];
    if (!allowedRoles) throw new AppError(`Không thể chuyển đề thi từ ${exam.status} sang ${status}`, 400);
    if (!allowedRoles.includes(user.role)) {
        throw new AppError("Chỉ quản trị viên mới được phê duyệt đề thi", 403);
    }

    if (status === "DA_PHE_DUYET") {
        if (exam.questions.length === 0) throw new AppError("Đề thi phải có ít nhất một câu hỏi", 400);
        if (new Decimal(exam.passingScore).gt(totalOf(exam.questions))) {
            throw new AppError("Điểm đạt không được lớn hơn tổng điểm các câu hỏi", 400);
        }
    }
    if (status === "BAN_NHAP" && exam._count.attempts > 0) {
        throw new AppError("Đề thi đã có bài làm, không thể chuyển về nháp", 409);
    }
    await repo.updateExam(id, { status });
    return withTotal(await loadExam(id));
}

async function remove(user, id) {
    const exam = await loadExam(id);
    await assertCanManageCourse(user, exam.courseId);
    if (exam._count.attempts > 0) {
        throw new AppError("Đề thi đã có bài làm, chỉ có thể tạm ngưng, không thể xóa", 409);
    }
    await repo.deleteExam(id);
}

// ---------- Question (đáp án được quản lý cùng câu hỏi) ----------
async function addQuestion(user, examId, data) {
    const exam = await loadExam(examId);
    await assertCanManageCourse(user, exam.courseId);
    assertContentEditable(exam);

    const questionOrder = data.questionOrder ?? (await repo.maxQuestionOrder(examId)) + 1;
    if (await repo.findQuestionOrder(examId, questionOrder)) {
        throw new AppError(`Đã có câu hỏi ở vị trí ${questionOrder}`, 409);
    }
    return repo.createQuestion(examId, { ...data, questionOrder });
}

async function loadQuestionWithExam(user, questionId) {
    const question = await repo.findQuestionById(questionId);
    if (!question) throw new AppError("Câu hỏi không tồn tại", 404);
    const exam = await repo.findExamBasic(question.examId);
    await assertCanManageCourse(user, exam.courseId);
    assertContentEditable(exam);
    return { question, exam };
}

async function updateQuestion(user, questionId, data) {
    const { question } = await loadQuestionWithExam(user, questionId);
    if (data.questionOrder !== undefined && data.questionOrder !== question.questionOrder) {
        if (await repo.findQuestionOrder(question.examId, data.questionOrder, questionId)) {
            throw new AppError(`Đã có câu hỏi ở vị trí ${data.questionOrder}`, 409);
        }
    }
    return repo.updateQuestion(questionId, data);
}

async function removeQuestion(user, questionId) {
    await loadQuestionWithExam(user, questionId);
    await repo.deleteQuestion(questionId);
}

module.exports = {
    MAX_ATTEMPTS,
    assertCanManageCourse,
    create,
    listByCourse,
    getById,
    update,
    changeStatus,
    remove,
    addQuestion,
    updateQuestion,
    removeQuestion,
};