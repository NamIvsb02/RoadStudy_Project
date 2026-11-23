# Graph Report - RoadStudy  (2026-11-23)

## Corpus Check
- 399 files · ~122,037 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: (none) 11, .example 2, .css 2)

## Summary
- 1940 nodes · 6176 edges · 88 communities (79 shown, 9 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 406 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1e63f69`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Header.jsx
- Initial Database Migration
- Course Listing Components
- Frontend Dependencies
- AI Provider Client
- Course Cards & Payments
- Invoice Repository
- Chatbot & Coupon Controllers
- Exam & Submission UI
- Course Controller
- AppRoutes.jsx
- AdminCoursesPage.jsx
- Dialogs & Toasts
- Backend Dependencies
- Course Repository
- Review Repository
- Form Input Components
- Comment Repository
- Auth Forms & Schemas
- Button
- Express App & Auth Middleware
- Coupon Repository
- Category Controller & Repository
- Account Service
- Notifications
- Permissions & Reports
- Comments & Ratings UI
- AccountsPage.jsx
- Enrollment Repository
- useAuth
- File Upload Middleware
- axiosClient.js
- Administrator Management
- Teacher Management
- AppError
- refreshAccessToken
- Registration & Password Reset
- JWT Tokens & Tests
- Learning Sessions Backend
- Exam Submission Grading
- resourceRoutes.js
- Course Routes & Validation
- Exam Routes & Validation
- PaymentPage.jsx
- Database Seeding
- Session Scheduling UI
- Learning Routes & Validation
- App Context Providers
- database.js
- Account Routes & Validation
- Review Routes & Validation
- PermissionsPage.jsx
- Profile Forms
- Auth Routes & Validation
- Chatbot Panel UI
- Category Routes & Validation
- Submission Routes & Validation
- ContentForm.jsx
- react-router-dom
- authService.js
- Comment Routes & Validation
- Exam Room UI
- Review Controller
- Coupon Routes & Validation
- Public Course Tests
- Course Tests
- TeacherDashboardPage.jsx
- Coupon Form
- Comment Controller
- Enrollment Tests
- Review Tests
- reportRoutes.js
- Account Deletion Script
- Exam Tests
- ExamListPage.jsx
- Account Tests
- CourseCard.jsx
- Test Auth Helpers
- package.json

## God Nodes (most connected - your core abstractions)
1. `AppError` - 158 edges
2. `formatResponse()` - 129 edges
3. `react` - 103 edges
4. `Button()` - 95 edges
5. `useFetch()` - 83 edges
6. `react-router-dom` - 73 edges
7. `FormAlert()` - 73 edges
8. `useAuth()` - 62 edges
9. `ROUTES` - 61 edges
10. `AppRoutes()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `uploadCover()` --calls--> `formatResponse()`  [EXTRACTED]
  BE_RStudy/src/controllers/courseController.js → BE_RStudy/src/utils/response.js
- `sendOtp()` --calls--> `createOtp()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `"CourseLearning"` --references--> `"Course"`  [EXTRACTED]
  BE_RStudy/prisma/migrations/20261121092555_add_course_learning/migration.sql → BE_RStudy/prisma/migrations/20261017111941_init/migration.sql
- `CourseRegistration_studentId_courseId_key` --indexes--> `"CourseRegistration"`  [EXTRACTED]
  BE_RStudy/prisma/migrations/20261017121522_bo_education_level_va_unique_dang_ky/migration.sql → BE_RStudy/prisma/migrations/20261017111941_init/migration.sql
- `CourseRegistration_studentId_courseId_idx` --indexes--> `"CourseRegistration"`  [EXTRACTED]
  BE_RStudy/prisma/migrations/20261105133742_registration_cancel/migration.sql → BE_RStudy/prisma/migrations/20261017111941_init/migration.sql

## Import Cycles
- None detected.

## Communities (88 total, 9 thin omitted)

### Community 0 - "Header.jsx"
Cohesion: 0.17
Nodes (14): AuthLayout(), BottomNav(), Footer(), Header(), MainNav(), getNavItems(), MY_COURSES_ITEM, NAV_ITEMS (+6 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.06
Nodes (61): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+53 more)

### Community 2 - "Course Listing Components"
Cohesion: 0.21
Nodes (23): CourseGrid(), PageColumns(), SectionHeader(), EmptyState(), ErrorState(), LoadingState(), useFetch(), CommentSection() (+15 more)

### Community 3 - "Frontend Dependencies"
Cohesion: 0.05
Nodes (50): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-dom@^19.2.8 (+42 more)

### Community 4 - "AI Provider Client"
Cohesion: 0.08
Nodes (43): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+35 more)

### Community 5 - "Course Cards & Payments"
Cohesion: 0.12
Nodes (30): CourseCover(), StatusBadge(), TONES, useMyRegistration(), AccountsTable(), CategoryTable(), CouponTable(), discountText() (+22 more)

### Community 6 - "Invoice Repository"
Cohesion: 0.09
Nodes (48): getProof(), countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findInvoices(), findStudentIdByAccountId(), findSupportRequestById() (+40 more)

### Community 7 - "Chatbot & Coupon Controllers"
Cohesion: 0.10
Nodes (31): getConversation(), listConversations(), sendMessage(), cancel(), create(), getMine(), listMine(), approve() (+23 more)

### Community 8 - "Exam & Submission UI"
Cohesion: 0.20
Nodes (16): examApi, submissionApi, ResultBadge(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween(), formatDuration() (+8 more)

### Community 9 - "Course Controller"
Cohesion: 0.08
Nodes (42): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+34 more)

### Community 10 - "AppRoutes.jsx"
Cohesion: 0.12
Nodes (38): ConfirmDialog(), DashboardPanel(), getPages(), Pagination(), ROLE_LABELS, STATUS_MAPS, AccountsFilterBar(), AccountsPage() (+30 more)

### Community 11 - "AdminCoursesPage.jsx"
Cohesion: 0.20
Nodes (13): courseApi, CourseSelect(), AdminCoursesPage(), TABS, AdminExamsPage(), fetchCourses(), AdminCourseActions(), CONFIRMS (+5 more)

### Community 12 - "Dialogs & Toasts"
Cohesion: 0.10
Nodes (33): invoiceApi, NoteDialog(), NoteForm(), ProofImage(), FormAlert(), fadeIn, scaleIn, slideInLeft (+25 more)

### Community 13 - "Backend Dependencies"
Cohesion: 0.05
Nodes (46): author, dependencies, bcrypt@^6.0.0, cors@^2.8.6, dotenv@^18.0.3, express@^5.2.1, helmet@^8.3.0, jsonwebtoken@^9.0.3 (+38 more)

### Community 14 - "Course Repository"
Cohesion: 0.07
Nodes (53): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+45 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "Form Input Components"
Cohesion: 0.17
Nodes (21): FormField(), inputClass(), PasswordInput, TextField, CommonRegisterFields(), LoginPage(), GENDER_OPTIONS, StudentFields() (+13 more)

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "Auth Forms & Schemas"
Cohesion: 0.17
Nodes (20): authApi, AuthShell(), useToast(), commonShape, forgotPasswordSchema, GENDERS, loginSchema, resetPasswordSchema (+12 more)

### Community 19 - "Button"
Cohesion: 0.12
Nodes (21): adminApi, ErrorState(), ReportDialog(), ReportForm(), schema, Button(), VARIANTS, DEFAULT_VALUES (+13 more)

### Community 20 - "Express App & Auth Middleware"
Cohesion: 0.10
Nodes (21): app, cors, express, helmet, morgan, path, authenticate(), authorize() (+13 more)

### Community 21 - "Coupon Repository"
Cohesion: 0.12
Nodes (30): countInvoices(), countStudentUsage(), create(), db(), decrementUsedCount(), findByCode(), findById(), findCourseById() (+22 more)

### Community 22 - "Category Controller & Repository"
Cohesion: 0.09
Nodes (37): buildWhere(), countRelations(), create(), findAndCount(), findById(), findByName(), remove(), update() (+29 more)

### Community 23 - "Account Service"
Cohesion: 0.10
Nodes (26): changeStatus(), list(), updateAvatar(), updateProfile(), findByIdSafe(), list(), LIST_SELECT, revokeAllRefreshTokens() (+18 more)

### Community 24 - "Notifications"
Cohesion: 0.13
Nodes (26): list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany(), findAccountIdByTeacherId() (+18 more)

### Community 25 - "Permissions & Reports"
Cohesion: 0.18
Nodes (17): create(), findAndCount(), findById(), findOpenDuplicate(), findTarget(), include, resolveViolation(), update() (+9 more)

### Community 26 - "Comments & Ratings UI"
Cohesion: 0.22
Nodes (15): commentApi, ContentForm(), InlineConfirmDelete(), ReportButton(), REPORTERS, TeacherAvatarList(), Avatar(), SIZES (+7 more)

### Community 27 - "AccountsPage.jsx"
Cohesion: 0.16
Nodes (15): accountApi, ADMIN_NAV, TEACHER_NAV, PermissionRoute(), PERMISSIONS, TOGGLEABLE, toParams(), AdminDashboardPage() (+7 more)

### Community 28 - "Enrollment Repository"
Cohesion: 0.15
Nodes (24): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+16 more)

### Community 29 - "useAuth"
Cohesion: 0.14
Nodes (21): notificationApi, NotificationBell(), SHAKE, NotificationItem(), getMenuItems(), UserMenu(), LeaderRoute(), getManageNav() (+13 more)

### Community 30 - "File Upload Middleware"
Cohesion: 0.10
Nodes (21): buildUploader(), crypto, DOC_MIMES, fs, IMAGE_MIMES, multer, path, UPLOAD_ROOT (+13 more)

### Community 31 - "axiosClient.js"
Cohesion: 0.14
Nodes (12): axiosClient, NO_REFRESH_URLS, categoryApi, couponApi, learningApi, reportApi, resourceApi, reviewApi (+4 more)

### Community 32 - "Administrator Management"
Cohesion: 0.10
Nodes (34): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), administratorInclude (+26 more)

### Community 33 - "Teacher Management"
Cohesion: 0.14
Nodes (20): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+12 more)

### Community 34 - "AppError"
Cohesion: 0.11
Nodes (41): CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion(), findCourseById(), findExamBasic() (+33 more)

### Community 35 - "refreshAccessToken"
Cohesion: 0.29
Nodes (8): refresh(), createRefreshToken(), findValidRefreshToken(), issueTokenPair(), refreshAccessToken(), sha256(), parseDurationToMs(), verifyRefreshToken()

### Community 36 - "Registration & Password Reset"
Cohesion: 0.12
Nodes (22): changePassword(), logout(), me(), resendOtp(), resetPassword(), verifyEmail(), ACCOUNT_SAFE_SELECT, consumeOtp() (+14 more)

### Community 37 - "JWT Tokens & Tests"
Cohesion: 0.20
Nodes (14): jwt, signAccessToken(), signRefreshToken(), call(), check(), main(), call(), check() (+6 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.15
Nodes (33): hasConfirmedRegistration(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), findAttemptById(), findExamForStart(), findInProgress() (+25 more)

### Community 40 - "resourceRoutes.js"
Cohesion: 0.20
Nodes (11): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), router, adminNeedsPermission(), checkAdminPermission, router (+3 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.13
Nodes (16): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+8 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "PaymentPage.jsx"
Cohesion: 0.19
Nodes (12): BackButton(), Switch(), PaymentPage(), getStage(), NOTICES, TONES, InfoRow(), TransferInfo() (+4 more)

### Community 44 - "Database Seeding"
Cohesion: 0.17
Nodes (12): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+4 more)

### Community 45 - "Session Scheduling UI"
Cohesion: 0.20
Nodes (13): dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter, toInputValue(), BADGES (+5 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "App Context Providers"
Cohesion: 0.18
Nodes (11): AUTH_LOGOUT_EVENT, App(), Toast(), TYPES, slideInRight, AuthProvider(), fetchAccount(), AuthContext (+3 more)

### Community 48 - "database.js"
Cohesion: 0.20
Nodes (13): prisma, { PrismaClient }, call(), check(), main(), names(), call(), check() (+5 more)

### Community 49 - "Account Routes & Validation"
Cohesion: 0.24
Nodes (7): PERMISSIONS, express, manageAccounts, router, updateProfileSchema, updateStatusSchema, { z }

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "PermissionsPage.jsx"
Cohesion: 0.46
Nodes (6): AdminList(), CreateAdminDialog(), PermissionEditor(), fetchAdmins(), fetchFunctions(), PermissionsPage()

### Community 52 - "Profile Forms"
Cohesion: 0.15
Nodes (15): TeacherFields(), ACCEPTED_TYPES, AvatarUploader(), ChangePasswordForm(), ProfileForm(), toFormValues(), toNull(), toPayload() (+7 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.21
Nodes (13): express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema (+5 more)

### Community 54 - "Chatbot Panel UI"
Cohesion: 0.14
Nodes (15): chatbotApi, ChatCourseCard(), ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, ChatWidget(), GuestPrompt() (+7 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "ContentForm.jsx"
Cohesion: 0.17
Nodes (13): schema, StarRating(), STARS, FieldError(), MyReviewBox(), ReviewForm(), schema, FILTERS (+5 more)

### Community 58 - "react-router-dom"
Cohesion: 0.27
Nodes (6): ROLE_HOME, ROUTES, HINTS, ADMIN_NEXT, NEXT, react-router-dom

### Community 59 - "authService.js"
Cohesion: 0.14
Nodes (21): hasSmtpConfig, nodemailer, sendMail(), forgotPassword(), login(), register(), createStudentAccount(), createTeacherAccount() (+13 more)

### Community 60 - "Comment Routes & Validation"
Cohesion: 0.16
Nodes (12): validate(), router, writers, router, content, contentBodySchema, courseIdParamSchema, idParamSchema (+4 more)

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

### Community 66 - "TeacherDashboardPage.jsx"
Cohesion: 0.30
Nodes (7): teacherApi, StatCard(), CountCard(), MyCoursesPanel(), RecentAttemptsPanel(), fetchStats(), TeacherDashboardPage()

### Community 67 - "Coupon Form"
Cohesion: 0.38
Nodes (8): CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso(), vnDate

### Community 68 - "Comment Controller"
Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 69 - "Enrollment Tests"
Cohesion: 0.25
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "reportRoutes.js"
Cohesion: 0.33
Nodes (7): adminOnly, router, createReportSchema, idParamSchema, processReportSchema, rejectReportSchema, { z }

### Community 72 - "Account Deletion Script"
Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 73 - "Exam Tests"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "ExamListPage.jsx"
Cohesion: 0.53
Nodes (4): enrollmentApi, ExamListPage(), fetchPaidCourses(), CourseExams()

### Community 75 - "Account Tests"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 76 - "CourseCard.jsx"
Cohesion: 0.53
Nodes (3): recommendationApi, CourseCard(), ForYouSection()

### Community 77 - "Test Auth Helpers"
Cohesion: 0.48
Nodes (6): asToken(), authHeaders(), buildCandidates(), cache, makeToken(), verifies()

### Community 78 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, prettier@^3.10.1, prettier

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `AI Provider Client`, `Invoice Repository`, `Course Controller`, `Course Repository`, `Review Repository`, `Comment Repository`, `Express App & Auth Middleware`, `Coupon Repository`, `Category Controller & Repository`, `Account Service`, `Notifications`, `Permissions & Reports`, `Enrollment Repository`, `File Upload Middleware`, `Administrator Management`, `Teacher Management`, `refreshAccessToken`, `Registration & Password Reset`, `Learning Sessions Backend`, `Exam Submission Grading`, `resourceRoutes.js`, `authService.js`, `Comment Routes & Validation`, `Review Controller`?**
  _High betweenness centrality (0.277) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Dialogs & Toasts` to `Header.jsx`, `Course Listing Components`, `Frontend Dependencies`, `Course Cards & Payments`, `Exam & Submission UI`, `AppRoutes.jsx`, `AdminCoursesPage.jsx`, `Form Input Components`, `Auth Forms & Schemas`, `Button`, `Comments & Ratings UI`, `AccountsPage.jsx`, `useAuth`, `axiosClient.js`, `PaymentPage.jsx`, `Session Scheduling UI`, `App Context Providers`, `PermissionsPage.jsx`, `Profile Forms`, `Chatbot Panel UI`, `ContentForm.jsx`, `react-router-dom`, `Exam Room UI`, `Coupon Form`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `Frontend Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `database.js` to `AppError`, `Invoice Repository`, `Exam Submission Grading`, `Account Deletion Script`, `Course Controller`, `Course Routes & Validation`, `Database Seeding`, `Backend Dependencies`, `Course Repository`, `Review Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `Permissions & Reports`, `Enrollment Repository`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Should `AI Provider Client` be split into smaller, more focused modules?**
  _Cohesion score 0.0783673469387755 - nodes in this community are weakly interconnected._
- **Should `Course Cards & Payments` be split into smaller, more focused modules?**
  _Cohesion score 0.1178743961352657 - nodes in this community are weakly interconnected._