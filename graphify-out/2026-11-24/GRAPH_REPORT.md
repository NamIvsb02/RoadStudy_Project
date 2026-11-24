# Graph Report - RoadStudy  (2026-11-24)

## Corpus Check
- 400 files · ~133,497 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 15, .example 2, .css 2)

## Summary
- 1981 nodes · 6176 edges · 106 communities (95 shown, 11 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 408 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4906c3f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Header.jsx
- Initial Database Migration
- Course Listing Components
- FE_RStudy/package.json
- recommendationService.js
- Avatar
- invoiceService.js
- Chatbot & Coupon Controllers
- Exam & Submission UI
- formatResponse
- StatusBadge
- useFetch
- CouponForm.jsx
- BE_RStudy/package.json
- Course Repository
- Review Repository
- format.js
- Comment Repository
- FormAlert
- Button.jsx
- authMiddleware.js
- Coupon Repository
- Category Controller & Repository
- Account Service
- AppError.js
- reportRepository.js
- useMyRegistration.js
- AccountsPage.jsx
- Enrollment Repository
- useAuth
- File Upload Middleware
- ref_zod
- Administrator Management
- Teacher Management
- AppError
- resourceService.js
- authRepository.js
- database.js
- Learning Sessions Backend
- Exam Submission Grading
- resourceRoutes.js
- Course Routes & Validation
- Exam Routes & Validation
- react
- Database Seeding
- SessionDialog.jsx
- Learning Routes & Validation
- axiosClient.js
- comment.test.js
- app.js
- Review Routes & Validation
- authService.js
- invoiceRepository.js
- Auth Routes & Validation
- ChatPanel.jsx
- Category Routes & Validation
- Submission Routes & Validation
- dependencies
- AppRoutes.jsx
- backend
- PaymentPage.jsx
- lucide-react
- Review Controller
- Coupon Routes & Validation
- Public Course Tests
- Course Tests
- DashboardPanel
- accountRoutes.js
- Comment Controller
- Enrollment Tests
- Review Tests
- reportRoutes.js
- Account Deletion Script
- Exam Tests
- UploadForm.jsx
- Account Tests
- App.jsx
- Test Auth Helpers
- package.json
- permissions
- chatbotRepository.js
- ReviewSection.jsx
- Button
- @tanstack/react-query
- response.js
- adminValidator.js
- vite.config.js
- ai.js
- scripts
- jwt.js
- AdminCoursesPage.jsx
- signAccessToken
- ExamRoom.jsx
- completeRefund
- FE_RStudy/package.json
- coupon.test.js

## God Nodes (most connected - your core abstractions)
1. `AppError` - 151 edges
2. `formatResponse()` - 129 edges
3. `react` - 103 edges
4. `Button()` - 94 edges
5. `useFetch()` - 83 edges
6. `react-router-dom` - 73 edges
7. `FormAlert()` - 72 edges
8. `useAuth()` - 63 edges
9. `ROUTES` - 61 edges
10. `AppRoutes()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `sendOtp()` --calls--> `createOtp()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `handle()` --calls--> `formatResponse()`  [EXTRACTED]
  BE_RStudy/src/controllers/notificationController.js → BE_RStudy/src/utils/response.js
- `listByCourse()` --calls--> `listByCourse()`  [EXTRACTED]
  BE_RStudy/src/controllers/commentController.js → BE_RStudy/src/services/commentService.js
- `listByCourse()` --calls--> `getPagination()`  [EXTRACTED]
  BE_RStudy/src/controllers/commentController.js → BE_RStudy/src/utils/pagination.js
- `listByCourse()` --calls--> `formatResponse()`  [EXTRACTED]
  BE_RStudy/src/controllers/commentController.js → BE_RStudy/src/utils/response.js

## Import Cycles
- None detected.

## Communities (106 total, 11 thin omitted)

### Community 0 - "Header.jsx"
Cohesion: 0.25
Nodes (10): AuthLayout(), BottomNav(), Footer(), Header(), MainNav(), getNavItems(), SearchBox(), Sidebar() (+2 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.06
Nodes (61): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+53 more)

### Community 2 - "Course Listing Components"
Cohesion: 0.13
Nodes (22): categoryApi, CourseCard(), CourseGrid(), PageColumns(), SectionHeader(), TeacherAvatarList(), ErrorState(), slideUp (+14 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.19
Nodes (13): devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18, eslint (+5 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.16
Nodes (18): courseSelect, findCandidates(), findOpenCourses(), findOpenForStudent(), findStudentCourseLinks(), findStudentIdByAccountId(), openWhere(), summarySelect (+10 more)

### Community 5 - "Avatar"
Cohesion: 0.27
Nodes (13): commentApi, ContentForm(), InlineConfirmDelete(), ReportButton(), REPORTERS, Avatar(), SIZES, CommentItem() (+5 more)

### Community 6 - "invoiceService.js"
Cohesion: 0.12
Nodes (26): getById(), getProof(), uploadProof(), findInvoices(), findStudentIdByAccountId(), findSupportRequests(), buildPaymentInfo(), fs (+18 more)

### Community 7 - "Chatbot & Coupon Controllers"
Cohesion: 0.12
Nodes (28): getConversation(), listConversations(), sendMessage(), cancel(), create(), getMine(), listMine(), approveRefund() (+20 more)

### Community 8 - "Exam & Submission UI"
Cohesion: 0.21
Nodes (18): examApi, submissionApi, ResultBadge(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween(), formatDuration() (+10 more)

### Community 9 - "formatResponse"
Cohesion: 0.08
Nodes (42): changeStatus(), create(), getById(), list(), remove(), update(), validate(), approve() (+34 more)

### Community 10 - "StatusBadge"
Cohesion: 0.10
Nodes (31): ConfirmDialog(), getPages(), Pagination(), StatusBadge(), TONES, ROLE_LABELS, STATUS_MAPS, AccountsFilterBar() (+23 more)

### Community 11 - "useFetch"
Cohesion: 0.19
Nodes (20): CourseSelect(), LoadingState(), useFetch(), AdminExamsPage(), fetchCourses(), CommentSection(), CourseDetailPage(), ExamListPage() (+12 more)

### Community 12 - "CouponForm.jsx"
Cohesion: 0.33
Nodes (9): CouponDialog(), CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso() (+1 more)

### Community 13 - "BE_RStudy/package.json"
Cohesion: 0.06
Nodes (45): author, dependencies, bcrypt@^6.0.0, cors@^2.8.6, dotenv@^18.0.3, helmet@^8.3.0, jsonwebtoken@^9.0.3, morgan@^1.12.1 (+37 more)

### Community 14 - "Course Repository"
Cohesion: 0.10
Nodes (38): buildPublicWhere(), buildWhere(), countActiveRegistrations(), courseInclude, create(), findAndCount(), findById(), findOwnById() (+30 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "format.js"
Cohesion: 0.15
Nodes (16): CourseCover(), CourseEnrollBox(), CourseHero(), ResourceBrowser(), ResourceCard(), ResourceListPage(), MyCourseCard(), MyCoursesPage() (+8 more)

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "FormAlert"
Cohesion: 0.09
Nodes (35): accountApi, authApi, AuthShell(), FormAlert(), ToastContext, useToast(), commonShape, forgotPasswordSchema (+27 more)

### Community 19 - "Button.jsx"
Cohesion: 0.21
Nodes (11): adminApi, VARIANTS, AdminList(), CreateAdminDialog(), CreateAdminForm(), DEFAULT_VALUES, createAdminSchema, PermissionEditor() (+3 more)

### Community 20 - "authMiddleware.js"
Cohesion: 0.12
Nodes (17): authenticate(), authorize(), optionalAuthenticate(), readToken(), router, writers, verifyAccessToken(), sendMessageSchema (+9 more)

### Community 21 - "Coupon Repository"
Cohesion: 0.13
Nodes (28): countInvoices(), countStudentUsage(), create(), db(), decrementUsedCount(), findByCode(), findById(), findCourseById() (+20 more)

### Community 22 - "Category Controller & Repository"
Cohesion: 0.12
Nodes (28): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+20 more)

### Community 23 - "Account Service"
Cohesion: 0.10
Nodes (26): changeStatus(), list(), updateAvatar(), updateProfile(), findByIdSafe(), list(), LIST_SELECT, revokeAllRefreshTokens() (+18 more)

### Community 24 - "AppError.js"
Cohesion: 0.14
Nodes (22): markRead, unreadCount, markRead(), notify(), notifyAdmins(), notifyCourseStudents(), notifyCourseTeacher(), notifyMany() (+14 more)

### Community 26 - "useMyRegistration.js"
Cohesion: 0.48
Nodes (5): ACTIVE, useMyRegistration(), EnrolledNotice(), EnrollForm(), EnrollPanel()

### Community 27 - "AccountsPage.jsx"
Cohesion: 0.25
Nodes (12): getMenuItems(), UserMenu(), ADMIN_NAV, getManageNav(), TEACHER_NAV, APPROVAL_NOTICE, ManageLayout(), SidebarContent() (+4 more)

### Community 28 - "Enrollment Repository"
Cohesion: 0.13
Nodes (26): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+18 more)

### Community 29 - "useAuth"
Cohesion: 0.23
Nodes (11): notificationApi, recommendationApi, NotificationBell(), SHAKE, NotificationItem(), dropdown, useAuth(), useMarkRead() (+3 more)

### Community 30 - "File Upload Middleware"
Cohesion: 0.11
Nodes (21): buildUploader(), crypto, DOC_MIMES, fs, IMAGE_MIMES, multer, path, UPLOAD_ROOT (+13 more)

### Community 31 - "ref_zod"
Cohesion: 0.13
Nodes (18): reportApi, schema, schema, FieldError(), CategoryDialog(), CategoryForm(), schema, toBody() (+10 more)

### Community 32 - "Administrator Management"
Cohesion: 0.16
Nodes (22): getMe(), listSystemFunctions(), administratorInclude, createAdministrator(), findAccessByAccountId(), findAdministratorById(), findFunctionsByIds(), listAdministrators() (+14 more)

### Community 33 - "Teacher Management"
Cohesion: 0.14
Nodes (20): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+12 more)

### Community 34 - "AppError"
Cohesion: 0.11
Nodes (42): CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion(), findCourseById(), findExamBasic() (+34 more)

### Community 35 - "resourceService.js"
Cohesion: 0.13
Nodes (21): create(), getById(), getList(), remove(), create(), findAndCount(), findById(), findTeacherByAccountId() (+13 more)

### Community 36 - "authRepository.js"
Cohesion: 0.12
Nodes (22): changePassword(), logout(), me(), resendOtp(), resetPassword(), verifyEmail(), ACCOUNT_SAFE_SELECT, consumeOtp() (+14 more)

### Community 37 - "database.js"
Cohesion: 0.27
Nodes (9): prisma, { PrismaClient }, call(), check(), main(), names(), call(), check() (+1 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.16
Nodes (32): attemptInclude, closeAttempt(), countAttempts(), createAttempt(), findAttemptById(), findExamForStart(), findInProgress(), findManyByStudent() (+24 more)

### Community 40 - "resourceRoutes.js"
Cohesion: 0.17
Nodes (10): validate(), router, adminNeedsPermission(), checkAdminPermission, router, idParamSchema, { z }, createResourceSchema (+2 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.12
Nodes (18): adminOnly, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl, createCourseSchema (+10 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "react"
Cohesion: 0.13
Nodes (23): invoiceApi, NoteDialog(), NoteForm(), ProofImage(), fadeIn, scaleIn, stepSlide, useProofImage() (+15 more)

### Community 44 - "Database Seeding"
Cohesion: 0.17
Nodes (12): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+4 more)

### Community 45 - "SessionDialog.jsx"
Cohesion: 0.18
Nodes (14): learningApi, dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter, toInputValue() (+6 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "axiosClient.js"
Cohesion: 0.23
Nodes (7): AUTH_LOGOUT_EVENT, axiosClient, NO_REFRESH_URLS, couponApi, enrollmentApi, AuthContext, tokenStorage

### Community 48 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 49 - "app.js"
Cohesion: 0.15
Nodes (12): app, cors, express, helmet, morgan, path, router, router (+4 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "authService.js"
Cohesion: 0.14
Nodes (21): hasSmtpConfig, nodemailer, sendMail(), forgotPassword(), login(), register(), createStudentAccount(), createTeacherAccount() (+13 more)

### Community 52 - "invoiceRepository.js"
Cohesion: 0.18
Nodes (17): approve(), reject(), requestRefund(), countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), invoiceInclude (+9 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.21
Nodes (13): express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema (+5 more)

### Community 54 - "ChatPanel.jsx"
Cohesion: 0.21
Nodes (12): chatbotApi, ChatCourseCard(), ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, ChatWidget(), GuestPrompt() (+4 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-hook-form@^7.91.0, react-router-dom@^7.18.4 (+5 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.12
Nodes (28): BackButton(), LeaderRoute(), PermissionRoute(), ProtectedRoute(), Switch(), ROLE_HOME, ROUTES, AdminDashboardPage() (+20 more)

### Community 59 - "backend"
Cohesion: 0.10
Nodes (20): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+12 more)

### Community 60 - "PaymentPage.jsx"
Cohesion: 0.22
Nodes (12): AdminPaymentsPage(), TABS, toParams(), PaymentTable(), PaymentPage(), getStage(), NOTICES, TONES (+4 more)

### Community 61 - "lucide-react"
Cohesion: 0.19
Nodes (7): MY_COURSES_ITEM, NAV_ITEMS, getPages(), Pagination(), SOCIAL_ICONS, SITE_INFO, lucide-react

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

### Community 66 - "DashboardPanel"
Cohesion: 0.18
Nodes (15): teacherApi, DashboardPanel(), StatCard(), PERMISSIONS, CountCard(), fetchPendingPayments(), fetchPendingTeachers(), PENDING_CARDS (+7 more)

### Community 67 - "accountRoutes.js"
Cohesion: 0.16
Nodes (11): express@^5.2.1, PERMISSIONS, express, manageAccounts, express, updateProfileSchema, updateStatusSchema, { z } (+3 more)

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
Cohesion: 0.21
Nodes (12): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), router, adminOnly, router, createReportSchema (+4 more)

### Community 72 - "Account Deletion Script"
Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 73 - "Exam Tests"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "UploadForm.jsx"
Cohesion: 0.18
Nodes (20): resourceApi, FormField(), inputClass(), PasswordInput, TextField, CommonRegisterFields(), LoginPage(), ResetPasswordPage() (+12 more)

### Community 75 - "Account Tests"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 76 - "App.jsx"
Cohesion: 0.31
Nodes (7): App(), Toast(), TYPES, slideInRight, AuthProvider(), fetchAccount(), ToastProvider()

### Community 77 - "Test Auth Helpers"
Cohesion: 0.48
Nodes (6): asToken(), authHeaders(), buildCandidates(), cache, makeToken(), verifies()

### Community 78 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, prettier@^3.10.1, prettier

### Community 79 - "permissions"
Cohesion: 0.22
Nodes (8): hooks, PreToolUse, SessionStart, permissions, allow, ask, deny, $schema

### Community 89 - "chatbotRepository.js"
Cohesion: 0.22
Nodes (15): countRecentStudentMessages(), createAiMessage(), createConversation(), createStudentMessage(), findConversationById(), findConversations(), findMessages(), findRecentMessages() (+7 more)

### Community 90 - "ReviewSection.jsx"
Cohesion: 0.27
Nodes (9): reviewApi, StarRating(), STARS, EmptyState(), MyReviewBox(), ReviewForm(), ReviewSection(), FILTERS (+1 more)

### Community 91 - "Button"
Cohesion: 0.18
Nodes (15): ErrorState(), ReportDialog(), ReportForm(), Button(), pad(), SidePanel(), ExamForm(), EMPTY_QUESTION() (+7 more)

### Community 92 - "@tanstack/react-query"
Cohesion: 0.32
Nodes (5): react-dom@^19.2.8, @tanstack/react-query@^5.107.1, queryClient, react-dom, @tanstack/react-query

### Community 93 - "response.js"
Cohesion: 0.25
Nodes (5): handle(), markAllRead, { Prisma }, PRISMA_ERROR_MAP, markAllRead()

### Community 94 - "adminValidator.js"
Cohesion: 0.20
Nodes (12): createAdministrator(), getAdministrator(), listAdministrators(), setAdministratorPermissions(), setAdministratorStatus(), createAdminSchema, idParamSchema, listQuerySchema (+4 more)

### Community 95 - "vite.config.js"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.6, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 96 - "ai.js"
Cohesion: 0.35
Nodes (10): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+2 more)

### Community 97 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 99 - "jwt.js"
Cohesion: 0.24
Nodes (10): refresh(), createRefreshToken(), findValidRefreshToken(), issueTokenPair(), refreshAccessToken(), sha256(), jwt, parseDurationToMs() (+2 more)

### Community 100 - "AdminCoursesPage.jsx"
Cohesion: 0.35
Nodes (7): courseApi, AdminCoursesPage(), TABS, AdminCourseActions(), CONFIRMS, runAction(), STEPS

### Community 101 - "signAccessToken"
Cohesion: 0.36
Nodes (8): signAccessToken(), call(), check(), main(), sleep(), check(), main(), start()

### Community 102 - "ExamRoom.jsx"
Cohesion: 0.38
Nodes (6): secondsLeft(), useCountdown(), ExamTakePage(), ExamRoom(), toList(), QuestionCard()

### Community 103 - "completeRefund"
Cohesion: 0.53
Nodes (9): findSupportRequestById(), updateSupportIfStatus(), approveRefund(), completeRefund(), loadRequest(), notify(), rejectRefund(), toRequestDto() (+1 more)

### Community 104 - "FE_RStudy/package.json"
Cohesion: 0.22
Nodes (8): axios@^1.20.0, @types/react-dom@^19.2.7, name, private, type, version, axios, @types/react-dom

### Community 105 - "coupon.test.js"
Cohesion: 0.53
Nodes (5): call(), check(), codes(), main(), valid

## Knowledge Gaps
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `recommendationService.js`, `invoiceService.js`, `formatResponse`, `Course Repository`, `Review Repository`, `Comment Repository`, `authMiddleware.js`, `Coupon Repository`, `Category Controller & Repository`, `Account Service`, `AppError.js`, `Enrollment Repository`, `File Upload Middleware`, `Administrator Management`, `Teacher Management`, `resourceService.js`, `authRepository.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `resourceRoutes.js`, `authService.js`, `invoiceRepository.js`, `Review Controller`, `reportRoutes.js`, `chatbotRepository.js`, `adminValidator.js`, `jwt.js`, `completeRefund`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `AppError.js` to `AppError`, `resourceService.js`, `database.js`, `invoiceService.js`, `Exam Submission Grading`, `Account Deletion Script`, `Course Routes & Validation`, `Database Seeding`, `BE_RStudy/package.json`, `Course Repository`, `Review Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `Enrollment Repository`, `response.js`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `Course Listing Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Header.jsx`, `Course Listing Components`, `Avatar`, `Exam & Submission UI`, `StatusBadge`, `useFetch`, `CouponForm.jsx`, `format.js`, `FormAlert`, `Button.jsx`, `AccountsPage.jsx`, `useAuth`, `ref_zod`, `SessionDialog.jsx`, `axiosClient.js`, `ChatPanel.jsx`, `dependencies`, `AppRoutes.jsx`, `PaymentPage.jsx`, `UploadForm.jsx`, `App.jsx`, `ReviewSection.jsx`, `Button`, `@tanstack/react-query`, `AdminCoursesPage.jsx`, `ExamRoom.jsx`, `FE_RStudy/package.json`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `invoiceService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `Chatbot & Coupon Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.11932773109243698 - nodes in this community are weakly interconnected._