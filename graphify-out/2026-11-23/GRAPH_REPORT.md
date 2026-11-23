# Graph Report - RoadStudy (2026-11-23)

## Corpus Check

- cluster-only mode — file stats not available

## Summary

- 1936 nodes · 6172 edges · 89 communities (79 shown, 10 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 406 edges (avg confidence: 0.85)
- Token cost: 32,777 input · 1,062 output

## Graph Freshness

- Built from commit: `d1e63f69`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- App Shell & Chat Widget
- Initial Database Migration
- Course Listing Components
- Frontend Dependencies
- AI Provider Client
- Course Cards & Payments
- Invoice Repository
- Chatbot & Coupon Controllers
- Exam & Submission UI
- Course Controller
- Account Management UI
- Routes & Admin Courses
- Dialogs & Toasts
- Backend Dependencies
- Course Repository
- Review Repository
- Form Input Components
- Comment Repository
- Auth Forms & Schemas
- Buttons & Error States
- Express App & Auth Middleware
- Coupon Repository
- Category Controller & Repository
- Account Service
- Notifications
- Permissions & Reports
- Comments & Ratings UI
- Admin Dashboard
- Enrollment Repository
- Resource Management
- File Upload Middleware
- Frontend API Clients
- Administrator Management
- Teacher Management
- Exam Repository
- Auth Controller & Tokens
- Registration & Password Reset
- JWT Tokens & Tests
- Learning Sessions Backend
- Exam Submission Grading
- Report & Resource Routes
- Course Routes & Validation
- Exam Routes & Validation
- Exam Service
- Database Seeding
- Session Scheduling UI
- Learning Routes & Validation
- App Context Providers
- Prisma Client & Admin Repo
- Account Routes & Validation
- Review Routes & Validation
- Admin Creation & Permissions UI
- Profile Forms
- Auth Routes & Validation
- Chatbot Panel UI
- Category Routes & Validation
- Submission Routes & Validation
- Submission Repository
- Exam Builder Form
- Email & OTP
- Comment Routes & Validation
- Exam Room UI
- Review Controller
- Coupon Routes & Validation
- Public Course Tests
- Course Tests
- Reports Page
- Coupon Form
- Comment Controller
- Enrollment Tests
- Review Tests
- NPM Scripts
- Account Deletion Script
- Exam Tests
- Admin Validation
- Account Tests
- Comment Tests
- Test Auth Helpers
- Course Management Listing
- Pagination Component

## God Nodes (most connected - your core abstractions)

1. `AppError` - 158 edges
2. `formatResponse()` - 129 edges
3. `react` - 103 edges
4. `Button()` - 95 edges
5. `useFetch()` - 83 edges
6. `FormAlert()` - 73 edges
7. `react-router-dom` - 73 edges
8. `useAuth()` - 62 edges
9. `ROUTES` - 61 edges
10. `AppRoutes()` - 52 edges

## Surprising Connections (you probably didn't know these)

- `notifyStudent()` --calls--> `findAccountIdByStudentId()` [EXTRACTED]
  BE_RStudy/src/services/notificationService.js → BE_RStudy/src/repositories/notificationRepository.js
- `createAdministrator()` --calls--> `createAdministrator()` [EXTRACTED]
  BE_RStudy/src/services/adminService.js → BE_RStudy/src/repositories/adminRepository.js
- `ensureFunctionsExist()` --calls--> `findFunctionsByIds()` [EXTRACTED]
  BE_RStudy/src/services/adminService.js → BE_RStudy/src/repositories/adminRepository.js
- `getAdminOrThrow()` --calls--> `findAdministratorById()` [EXTRACTED]
  BE_RStudy/src/services/adminService.js → BE_RStudy/src/repositories/adminRepository.js
- `setAdministratorPermissions()` --calls--> `replacePermissions()` [EXTRACTED]
  BE_RStudy/src/services/adminService.js → BE_RStudy/src/repositories/adminRepository.js

## Import Cycles

- None detected.

## Communities (89 total, 10 thin omitted)

### Community 0 - "App Shell & Chat Widget"

Cohesion: 0.08
Nodes (43): AuthLayout(), ChatWidget(), GuestPrompt(), BottomNav(), Footer(), Header(), MainNav(), getNavItems() (+35 more)

### Community 1 - "Initial Database Migration"

Cohesion: 0.06
Nodes (61): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+53 more)

### Community 2 - "Course Listing Components"

Cohesion: 0.12
Nodes (36): categoryApi, CourseGrid(), CourseSelect(), PageColumns(), SectionHeader(), TeacherAvatarList(), EmptyState(), ErrorState() (+28 more)

### Community 3 - "Frontend Dependencies"

Cohesion: 0.06
Nodes (48): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-dom@^19.2.8 (+40 more)

### Community 4 - "AI Provider Client"

Cohesion: 0.08
Nodes (43): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+35 more)

### Community 5 - "Course Cards & Payments"

Cohesion: 0.09
Nodes (33): CourseCard(), CourseCover(), NotificationItem(), slideUp, stagger, useMyRegistration(), AdminPaymentsPage(), TABS (+25 more)

### Community 6 - "Invoice Repository"

Cohesion: 0.10
Nodes (46): countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findInvoices(), findStudentIdByAccountId(), findSupportRequestById(), findSupportRequests() (+38 more)

### Community 7 - "Chatbot & Coupon Controllers"

Cohesion: 0.08
Nodes (39): getConversation(), listConversations(), sendMessage(), changeStatus(), create(), getById(), list(), remove() (+31 more)

### Community 8 - "Exam & Submission UI"

Cohesion: 0.14
Nodes (27): examApi, submissionApi, DashboardPanel(), ResultBadge(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween() (+19 more)

### Community 9 - "Course Controller"

Cohesion: 0.09
Nodes (38): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+30 more)

### Community 10 - "Account Management UI"

Cohesion: 0.10
Nodes (29): accountApi, ConfirmDialog(), StatusBadge(), TONES, ROLE_LABELS, STATUS_MAPS, AccountsFilterBar(), AccountsTable() (+21 more)

### Community 11 - "Routes & Admin Courses"

Cohesion: 0.11
Nodes (26): courseApi, resourceApi, BackButton(), ProtectedRoute(), Switch(), AdminCoursesPage(), TABS, AdminDashboardPage() (+18 more)

### Community 12 - "Dialogs & Toasts"

Cohesion: 0.13
Nodes (23): invoiceApi, NoteDialog(), NoteForm(), ProofImage(), TYPES, fadeIn, scaleIn, slideInLeft (+15 more)

### Community 13 - "Backend Dependencies"

Cohesion: 0.07
Nodes (37): author, dependencies, bcrypt@^6.0.0, cors@^2.8.6, dotenv@^18.0.3, express@^5.2.1, helmet@^8.3.0, jsonwebtoken@^9.0.3 (+29 more)

### Community 14 - "Course Repository"

Cohesion: 0.10
Nodes (37): buildPublicWhere(), buildWhere(), courseInclude, create(), findAndCount(), findById(), findOwnById(), findPublicAndCount() (+29 more)

### Community 15 - "Review Repository"

Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "Form Input Components"

Cohesion: 0.16
Nodes (22): FormField(), inputClass(), PasswordInput, TextField, ReportActionForm(), CommonRegisterFields(), LoginPage(), GENDER_OPTIONS (+14 more)

### Community 17 - "Comment Repository"

Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "Auth Forms & Schemas"

Cohesion: 0.16
Nodes (22): authApi, AuthShell(), FormAlert(), useToast(), commonShape, forgotPasswordSchema, GENDERS, loginSchema (+14 more)

### Community 19 - "Buttons & Error States"

Cohesion: 0.13
Nodes (23): schema, ErrorState(), ReportDialog(), ReportForm(), schema, Button(), VARIANTS, FieldError() (+15 more)

### Community 20 - "Express App & Auth Middleware"

Cohesion: 0.10
Nodes (22): app, cors, express, helmet, morgan, path, authenticate(), authorize() (+14 more)

### Community 21 - "Coupon Repository"

Cohesion: 0.12
Nodes (30): countInvoices(), countStudentUsage(), create(), db(), decrementUsedCount(), findByCode(), findById(), findCourseById() (+22 more)

### Community 22 - "Category Controller & Repository"

Cohesion: 0.12
Nodes (28): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+20 more)

### Community 23 - "Account Service"

Cohesion: 0.10
Nodes (26): changeStatus(), list(), updateAvatar(), updateProfile(), findByIdSafe(), list(), LIST_SELECT, revokeAllRefreshTokens() (+18 more)

### Community 24 - "Notifications"

Cohesion: 0.13
Nodes (27): list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany(), findAccountIdByStudentId() (+19 more)

### Community 25 - "Permissions & Reports"

Cohesion: 0.14
Nodes (22): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), create(), findAndCount(), findById(), findOpenDuplicate() (+14 more)

### Community 26 - "Comments & Ratings UI"

Cohesion: 0.19
Nodes (17): commentApi, ContentForm(), InlineConfirmDelete(), ReportButton(), REPORTERS, StarRating(), STARS, Avatar() (+9 more)

### Community 27 - "Admin Dashboard"

Cohesion: 0.14
Nodes (16): teacherApi, StatCard(), PERMISSIONS, CountCard(), fetchPendingPayments(), fetchPendingTeachers(), PENDING_CARDS, TOTAL_CARDS (+8 more)

### Community 28 - "Enrollment Repository"

Cohesion: 0.15
Nodes (24): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+16 more)

### Community 29 - "Resource Management"

Cohesion: 0.13
Nodes (21): create(), getById(), getList(), remove(), create(), findAndCount(), findById(), findTeacherByAccountId() (+13 more)

### Community 30 - "File Upload Middleware"

Cohesion: 0.11
Nodes (21): buildUploader(), crypto, DOC_MIMES, fs, IMAGE_MIMES, multer, path, UPLOAD_ROOT (+13 more)

### Community 31 - "Frontend API Clients"

Cohesion: 0.13
Nodes (12): axiosClient, NO_REFRESH_URLS, chatbotApi, couponApi, enrollmentApi, learningApi, notificationApi, recommendationApi (+4 more)

### Community 32 - "Administrator Management"

Cohesion: 0.18
Nodes (21): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), findAccessByAccountId() (+13 more)

### Community 33 - "Teacher Management"

Cohesion: 0.14
Nodes (20): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+12 more)

### Community 34 - "Exam Repository"

Cohesion: 0.11
Nodes (21): CONFIRMED_REGISTRATION, createExam(), createQuestion(), deleteExam(), deleteQuestion(), findExamBasic(), findExamById(), findManyByCourse() (+13 more)

### Community 35 - "Auth Controller & Tokens"

Cohesion: 0.15
Nodes (19): changePassword(), login(), logout(), me(), refresh(), resendOtp(), findByIdSafe(), findRefreshTokenByHash() (+11 more)

### Community 36 - "Registration & Password Reset"

Cohesion: 0.15
Nodes (20): forgotPassword(), register(), resetPassword(), verifyEmail(), ACCOUNT_SAFE_SELECT, consumeOtp(), createStudentAccount(), createTeacherAccount() (+12 more)

### Community 37 - "JWT Tokens & Tests"

Cohesion: 0.17
Nodes (17): createRefreshToken(), issueTokenPair(), jwt, parseDurationToMs(), signAccessToken(), signRefreshToken(), call(), check() (+9 more)

### Community 38 - "Learning Sessions Backend"

Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"

Cohesion: 0.27
Nodes (20): findAttemptById(), findQuestionsWithOptions(), sumQuestionScore(), assertActive(), autoSubmitIfExpired(), buildQuestionDetails(), deadlineOf(), fixed() (+12 more)

### Community 40 - "Report & Resource Routes"

Cohesion: 0.15
Nodes (14): PERMISSIONS, adminOnly, router, adminNeedsPermission(), checkAdminPermission, router, createReportSchema, idParamSchema (+6 more)

### Community 41 - "Course Routes & Validation"

Cohesion: 0.12
Nodes (17): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+9 more)

### Community 42 - "Exam Routes & Validation"

Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "Exam Service"

Cohesion: 0.25
Nodes (18): countAttemptsByExams(), findCourseById(), updateExam(), assertCanManageCourse(), assertStudentCanAccess(), BOTH, changeStatus(), create() (+10 more)

### Community 44 - "Database Seeding"

Cohesion: 0.15
Nodes (14): @prisma/client@^6.19.3, CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main() (+6 more)

### Community 45 - "Session Scheduling UI"

Cohesion: 0.20
Nodes (13): dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter, toInputValue(), BADGES (+5 more)

### Community 46 - "Learning Routes & Validation"

Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "App Context Providers"

Cohesion: 0.19
Nodes (9): AUTH_LOGOUT_EVENT, App(), Toast(), AuthProvider(), fetchAccount(), ToastProvider(), ToastContext, queryClient (+1 more)

### Community 48 - "Prisma Client & Admin Repo"

Cohesion: 0.17
Nodes (13): prisma, { PrismaClient }, administratorInclude, createAdministrator(), findAdministratorById(), findFunctionsByIds(), listAdministrators(), replacePermissions() (+5 more)

### Community 49 - "Account Routes & Validation"

Cohesion: 0.17
Nodes (10): validate(), express, manageAccounts, router, router, updateProfileSchema, updateStatusSchema, { z } (+2 more)

### Community 50 - "Review Routes & Validation"

Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "Admin Creation & Permissions UI"

Cohesion: 0.23
Nodes (10): adminApi, AdminList(), CreateAdminDialog(), CreateAdminForm(), DEFAULT_VALUES, createAdminSchema, PermissionEditor(), fetchAdmins() (+2 more)

### Community 52 - "Profile Forms"

Cohesion: 0.20
Nodes (11): TeacherFields(), ProfileForm(), toFormValues(), toNull(), toPayload(), baseShape, changePasswordSchema, GENDERS (+3 more)

### Community 53 - "Auth Routes & Validation"

Cohesion: 0.21
Nodes (13): express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema (+5 more)

### Community 54 - "Chatbot Panel UI"

Cohesion: 0.30
Nodes (9): ChatCourseCard(), ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, MessageBubble(), useConversations(), useOpenConversation() (+1 more)

### Community 55 - "Category Routes & Validation"

Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"

Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "Submission Repository"

Cohesion: 0.23
Nodes (11): hasConfirmedRegistration(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), findExamForStart(), findInProgress(), findManyByStudent() (+3 more)

### Community 58 - "Exam Builder Form"

Cohesion: 0.30
Nodes (9): ExamForm(), EMPTY_QUESTION(), examSchema, isNumber(), numberField(), optionSchema, questionSchema, toExamBody() (+1 more)

### Community 59 - "Email & OTP"

Cohesion: 0.20
Nodes (9): hasSmtpConfig, nodemailer, sendMail(), createOtp(), sendOtp(), bcrypt, compareOtp(), generateOtpCode() (+1 more)

### Community 60 - "Comment Routes & Validation"

Cohesion: 0.25
Nodes (8): router, writers, content, contentBodySchema, courseIdParamSchema, idParamSchema, replyIdParamSchema, { z }

### Community 61 - "Exam Room UI"

Cohesion: 0.35
Nodes (7): secondsLeft(), useCountdown(), ExamRoom(), toList(), QuestionCard(), pad(), SidePanel()

### Community 62 - "Review Controller"

Cohesion: 0.36
Nodes (9): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+1 more)

### Community 63 - "Coupon Routes & Validation"

Cohesion: 0.29
Nodes (7): router, base, changeStatusSchema, createCouponSchema, updateCouponSchema, validateCouponSchema, { z }

### Community 64 - "Public Course Tests"

Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"

Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "Reports Page"

Cohesion: 0.31
Nodes (7): reportApi, ReportActionDialog(), getTarget(), ReportCard(), TARGETS, ReportsPage(), TABS

### Community 67 - "Coupon Form"

Cohesion: 0.38
Nodes (8): CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso(), vnDate

### Community 68 - "Comment Controller"

Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 69 - "Enrollment Tests"

Cohesion: 0.33
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 70 - "Review Tests"

Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "NPM Scripts"

Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 72 - "Account Deletion Script"

Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 73 - "Exam Tests"

Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "Admin Validation"

Cohesion: 0.29
Nodes (6): createAdminSchema, idParamSchema, listQuerySchema, updatePermissionsSchema, updateStatusSchema, { z }

### Community 75 - "Account Tests"

Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 76 - "Comment Tests"

Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 77 - "Test Auth Helpers"

Cohesion: 0.48
Nodes (6): asToken(), authHeaders(), buildCandidates(), cache, makeToken(), verifies()

### Community 78 - "Course Management Listing"

Cohesion: 0.67
Nodes (3): findTeacherByAccountId(), findManyForManage(), listManage()

## Knowledge Gaps

- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `Permissions & Reports` to `AI Provider Client`, `Invoice Repository`, `Course Controller`, `Course Repository`, `Review Repository`, `Comment Repository`, `Express App & Auth Middleware`, `Coupon Repository`, `Category Controller & Repository`, `Account Service`, `Notifications`, `Enrollment Repository`, `Resource Management`, `File Upload Middleware`, `Administrator Management`, `Teacher Management`, `Exam Repository`, `Auth Controller & Tokens`, `Registration & Password Reset`, `Learning Sessions Backend`, `Exam Submission Grading`, `Exam Service`, `Account Routes & Validation`, `Submission Repository`, `Review Controller`, `Admin Validation`, `Course Management Listing`?**
  _High betweenness centrality (0.298) - this node is a cross-community bridge._
- **Should `App Shell & Chat Widget` be split into smaller, more focused modules?**
  _Cohesion score 0.08364197530864198 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Dialogs & Toasts` to `App Shell & Chat Widget`, `Course Listing Components`, `Frontend Dependencies`, `Course Cards & Payments`, `Exam & Submission UI`, `Account Management UI`, `Routes & Admin Courses`, `Form Input Components`, `Auth Forms & Schemas`, `Buttons & Error States`, `Comments & Ratings UI`, `Admin Dashboard`, `Frontend API Clients`, `Session Scheduling UI`, `App Context Providers`, `Admin Creation & Permissions UI`, `Profile Forms`, `Chatbot Panel UI`, `Exam Builder Form`, `Exam Room UI`, `Reports Page`, `Coupon Form`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `Database Seeding` to `Invoice Repository`, `Exam Submission Grading`, `Account Deletion Script`, `Course Controller`, `Course Routes & Validation`, `Exam Service`, `Backend Dependencies`, `Course Repository`, `Review Repository`, `Prisma Client & Admin Repo`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `Permissions & Reports`, `Enrollment Repository`, `Resource Management`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `Course Listing Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1180327868852459 - nodes in this community are weakly interconnected._
- **Should `Frontend Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05568627450980392 - nodes in this community are weakly interconnected._
