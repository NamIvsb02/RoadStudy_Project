# Graph Report - RoadStudy  (2026-11-24)

## Corpus Check
- 400 files · ~134,646 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 15, .example 2, .css 2)

## Summary
- 1983 nodes · 6185 edges · 95 communities (83 shown, 12 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 408 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4906c3f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react-router-dom
- Initial Database Migration
- Course Listing Components
- FE_RStudy/package.json
- recommendationService.js
- formatDateTime
- invoiceService.js
- Chatbot & Coupon Controllers
- Exam & Submission UI
- formatResponse
- DashboardPanel
- useFetch
- CouponForm.jsx
- BE_RStudy/package.json
- Course Repository
- Review Repository
- format.js
- Comment Repository
- RegisterPage.jsx
- CreateAdminForm.jsx
- commentRoutes.js
- Coupon Repository
- Category Controller & Repository
- Account Service
- notificationService.js
- reportService.js
- TextField
- scripts
- Enrollment Repository
- File Upload Middleware
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
- sessionFormat.js
- Learning Routes & Validation
- axiosClient.js
- comment.test.js
- app.js
- Review Routes & Validation
- sendOtp
- invoiceRepository.js
- Auth Routes & Validation
- ChatPanel.jsx
- Category Routes & Validation
- Submission Routes & Validation
- dependencies
- AppRoutes.jsx
- backend
- PaymentPage.jsx
- common/Pagination.jsx
- Review Controller
- Coupon Routes & Validation
- Public Course Tests
- Course Tests
- DashboardPanel
- permissionMiddleware.js
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
- Button
- @tanstack/react-query
- scripts
- authService.js
- AdminCoursesPage.jsx
- signAccessToken
- coupon.test.js

## God Nodes (most connected - your core abstractions)
1. `AppError` - 152 edges
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
- `uploadCover()` --calls--> `formatResponse()`  [EXTRACTED]
  BE_RStudy/src/controllers/courseController.js → BE_RStudy/src/utils/response.js
- `issueTokenPair()` --calls--> `createRefreshToken()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `refreshAccessToken()` --calls--> `findValidRefreshToken()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `create()` --calls--> `findTarget()`  [EXTRACTED]
  BE_RStudy/src/services/reportService.js → BE_RStudy/src/repositories/reportRepository.js
- `create()` --calls--> `findOpenDuplicate()`  [EXTRACTED]
  BE_RStudy/src/services/reportService.js → BE_RStudy/src/repositories/reportRepository.js

## Import Cycles
- None detected.

## Communities (95 total, 12 thin omitted)

### Community 0 - "react-router-dom"
Cohesion: 0.08
Nodes (45): AuthLayout(), ChatWidget(), GuestPrompt(), BottomNav(), CourseCard(), Footer(), Header(), MainNav() (+37 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.06
Nodes (61): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+53 more)

### Community 2 - "Course Listing Components"
Cohesion: 0.10
Nodes (28): categoryApi, teacherApi, CourseGrid(), PageColumns(), SectionHeader(), TeacherAvatarList(), EmptyState(), ErrorState() (+20 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.11
Nodes (25): @tailwindcss/vite@^4.3.3, devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18 (+17 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.12
Nodes (28): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+20 more)

### Community 5 - "formatDateTime"
Cohesion: 0.15
Nodes (22): commentApi, ContentForm(), schema, InlineConfirmDelete(), ReportButton(), REPORTERS, ReportDialog(), StarRating() (+14 more)

### Community 6 - "invoiceService.js"
Cohesion: 0.12
Nodes (27): getById(), getProof(), uploadProof(), findInvoices(), findStudentIdByAccountId(), findSupportRequests(), buildPaymentInfo(), fs (+19 more)

### Community 7 - "Chatbot & Coupon Controllers"
Cohesion: 0.22
Nodes (17): getConversation(), listConversations(), list(), listMine(), listByCourse(), listAll(), listMine(), listMyRefundRequests() (+9 more)

### Community 8 - "Exam & Submission UI"
Cohesion: 0.15
Nodes (22): submissionApi, ResultBadge(), secondsLeft(), useCountdown(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween() (+14 more)

### Community 9 - "formatResponse"
Cohesion: 0.16
Nodes (22): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply() (+14 more)

### Community 10 - "DashboardPanel"
Cohesion: 0.07
Nodes (51): couponApi, DashboardPanel(), getPages(), Pagination(), StatusBadge(), TONES, ROLE_LABELS, STATUS_MAPS (+43 more)

### Community 11 - "useFetch"
Cohesion: 0.15
Nodes (27): examApi, learningApi, CourseSelect(), LoadingState(), Switch(), useFetch(), AdminExamsPage(), fetchCourses() (+19 more)

### Community 12 - "CouponForm.jsx"
Cohesion: 0.35
Nodes (8): CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso(), vnDate

### Community 13 - "BE_RStudy/package.json"
Cohesion: 0.07
Nodes (35): author, dependencies, bcrypt@^6.0.0, cors@^2.8.6, dotenv@^18.0.3, helmet@^8.3.0, jsonwebtoken@^9.0.3, morgan@^1.12.1 (+27 more)

### Community 14 - "Course Repository"
Cohesion: 0.07
Nodes (54): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+46 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (37): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+29 more)

### Community 16 - "format.js"
Cohesion: 0.29
Nodes (7): CourseCover(), ResourceCard(), ASSET_URL, assetUrl(), dateFormatter, moneyFormatter, timeFormatter

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "RegisterPage.jsx"
Cohesion: 0.16
Nodes (23): authApi, AuthShell(), PasswordInput, useToast(), commonShape, forgotPasswordSchema, GENDERS, loginSchema (+15 more)

### Community 20 - "commentRoutes.js"
Cohesion: 0.25
Nodes (8): router, writers, content, contentBodySchema, courseIdParamSchema, idParamSchema, replyIdParamSchema, { z }

### Community 21 - "Coupon Repository"
Cohesion: 0.10
Nodes (34): changeStatus(), create(), getById(), remove(), update(), validate(), countInvoices(), countStudentUsage() (+26 more)

### Community 22 - "Category Controller & Repository"
Cohesion: 0.13
Nodes (27): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+19 more)

### Community 23 - "Account Service"
Cohesion: 0.10
Nodes (26): changeStatus(), list(), updateAvatar(), updateProfile(), findByIdSafe(), list(), LIST_SELECT, revokeAllRefreshTokens() (+18 more)

### Community 24 - "notificationService.js"
Cohesion: 0.25
Nodes (15): markAllRead, markRead, unreadCount, markAllRead(), markRead(), notify(), notifyAdmins(), notifyCourseStudents() (+7 more)

### Community 25 - "reportService.js"
Cohesion: 0.13
Nodes (24): create(), getById(), getList(), process(), reject(), create(), findAndCount(), findById() (+16 more)

### Community 26 - "TextField"
Cohesion: 0.14
Nodes (18): accountApi, TextField, StudentFields(), TeacherFields(), ACCEPTED_TYPES, AvatarUploader(), ChangePasswordForm(), ProfileForm() (+10 more)

### Community 27 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 28 - "Enrollment Repository"
Cohesion: 0.13
Nodes (26): cancel(), create(), getMine(), countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db() (+18 more)

### Community 30 - "File Upload Middleware"
Cohesion: 0.11
Nodes (21): buildUploader(), crypto, DOC_MIMES, fs, IMAGE_MIMES, multer, path, UPLOAD_ROOT (+13 more)

### Community 32 - "Administrator Management"
Cohesion: 0.10
Nodes (34): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), administratorInclude (+26 more)

### Community 33 - "Teacher Management"
Cohesion: 0.14
Nodes (20): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+12 more)

### Community 34 - "AppError"
Cohesion: 0.10
Nodes (38): removeQuestion(), updateQuestion(), CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion() (+30 more)

### Community 35 - "resourceService.js"
Cohesion: 0.12
Nodes (22): create(), getById(), getList(), remove(), findById(), create(), findAndCount(), findById() (+14 more)

### Community 36 - "authRepository.js"
Cohesion: 0.09
Nodes (30): changePassword(), forgotPassword(), login(), logout(), refresh(), register(), resendOtp(), resetPassword() (+22 more)

### Community 37 - "database.js"
Cohesion: 0.27
Nodes (9): prisma, { PrismaClient }, call(), check(), main(), names(), call(), check() (+1 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.11
Nodes (41): getById(), saveAnswers(), start(), submit(), findExamBasic(), findTeacherByAccountId(), hasConfirmedRegistration(), attemptInclude (+33 more)

### Community 40 - "resourceRoutes.js"
Cohesion: 0.31
Nodes (6): adminNeedsPermission(), checkAdminPermission, router, createResourceSchema, idParamSchema, { z }

### Community 41 - "Course Routes & Validation"
Cohesion: 0.13
Nodes (17): adminOnly, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl, createCourseSchema (+9 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "react"
Cohesion: 0.13
Nodes (24): NoteForm(), ProofImage(), FormAlert(), fadeIn, scaleIn, slideInLeft, stepSlide, useProofImage() (+16 more)

### Community 44 - "Database Seeding"
Cohesion: 0.12
Nodes (16): @prisma/client@^6.19.3, CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main() (+8 more)

### Community 45 - "sessionFormat.js"
Cohesion: 0.29
Nodes (7): dayFormatter, formatSessionTime(), inputFormatter, sessionState(), timeFormatter, BADGES, SessionList()

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "axiosClient.js"
Cohesion: 0.14
Nodes (12): adminApi, AUTH_LOGOUT_EVENT, axiosClient, NO_REFRESH_URLS, chatbotApi, notificationApi, recommendationApi, reportApi (+4 more)

### Community 48 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 49 - "app.js"
Cohesion: 0.11
Nodes (17): app, cors, express, helmet, morgan, path, validate(), router (+9 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "sendOtp"
Cohesion: 0.18
Nodes (10): hasSmtpConfig, nodemailer, sendMail(), createOtp(), sendOtp(), bcrypt, compareOtp(), generateOtpCode() (+2 more)

### Community 52 - "invoiceRepository.js"
Cohesion: 0.12
Nodes (30): approve(), approveRefund(), completeRefund(), reject(), rejectRefund(), requestRefund(), cancelRegistrationRecords(), countPendingRefundByRegistration() (+22 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.18
Nodes (15): express@^5.2.1, express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema (+7 more)

### Community 54 - "ChatPanel.jsx"
Cohesion: 0.25
Nodes (11): ChatCourseCard(), ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, MessageBubble(), useConversations(), useOpenConversation() (+3 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.13
Nodes (16): PERMISSIONS, adminOnly, router, express, router, categoryName, { CategoryStatus }, changeStatusSchema (+8 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-hook-form@^7.91.0 (+7 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.14
Nodes (22): resourceApi, BackButton(), ExamLayout(), LeaderRoute(), PermissionRoute(), ProtectedRoute(), ExamTakePage(), ForbiddenPage() (+14 more)

### Community 59 - "backend"
Cohesion: 0.10
Nodes (20): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+12 more)

### Community 60 - "PaymentPage.jsx"
Cohesion: 0.12
Nodes (24): enrollmentApi, invoiceApi, ConfirmDialog(), NoteDialog(), ACTIVE, useMyRegistration(), AdminRefundsPage(), CONFIRMS (+16 more)

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
Cohesion: 0.26
Nodes (10): StatCard(), PERMISSIONS, AdminDashboardPage(), CountCard(), fetchPendingPayments(), fetchPendingTeachers(), PENDING_CARDS, TOTAL_CARDS (+2 more)

### Community 67 - "permissionMiddleware.js"
Cohesion: 0.19
Nodes (11): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), express, manageAccounts, router, router (+3 more)

### Community 69 - "Enrollment Tests"
Cohesion: 0.25
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "reportRoutes.js"
Cohesion: 0.20
Nodes (13): authenticate(), authorize(), optionalAuthenticate(), readToken(), router, adminOnly, router, verifyAccessToken() (+5 more)

### Community 72 - "Account Deletion Script"
Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 73 - "Exam Tests"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "UploadForm.jsx"
Cohesion: 0.24
Nodes (13): FormField(), inputClass(), GENDER_OPTIONS, useCategories(), CourseForm(), toCourseBody(), loadImage(), toCoverFile() (+5 more)

### Community 75 - "Account Tests"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 76 - "App.jsx"
Cohesion: 0.31
Nodes (6): App(), Toast(), TYPES, slideInRight, ToastProvider(), ToastContext

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
Cohesion: 0.19
Nodes (17): sendMessage(), countRecentStudentMessages(), createAiMessage(), createConversation(), createStudentMessage(), findConversationById(), findConversations(), findMessages() (+9 more)

### Community 91 - "Button"
Cohesion: 0.12
Nodes (22): ErrorState(), ReportForm(), schema, Button(), VARIANTS, priceField, schema, SORT_OPTIONS (+14 more)

### Community 92 - "@tanstack/react-query"
Cohesion: 0.32
Nodes (5): react-dom@^19.2.8, @tanstack/react-query@^5.107.1, queryClient, react-dom, @tanstack/react-query

### Community 97 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 99 - "authService.js"
Cohesion: 0.24
Nodes (14): me(), findByIdSafe(), assertTeacherApproved(), crypto, getMe(), issueTokenPair(), login(), refreshAccessToken() (+6 more)

### Community 100 - "AdminCoursesPage.jsx"
Cohesion: 0.35
Nodes (7): courseApi, AdminCoursesPage(), TABS, AdminCourseActions(), CONFIRMS, runAction(), STEPS

### Community 101 - "signAccessToken"
Cohesion: 0.36
Nodes (8): signAccessToken(), call(), check(), main(), sleep(), check(), main(), start()

### Community 105 - "coupon.test.js"
Cohesion: 0.53
Nodes (5): call(), check(), codes(), main(), valid

## Knowledge Gaps
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `Review Repository` to `recommendationService.js`, `invoiceService.js`, `Chatbot & Coupon Controllers`, `Course Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `Account Service`, `notificationService.js`, `reportService.js`, `Enrollment Repository`, `File Upload Middleware`, `Administrator Management`, `Teacher Management`, `AppError`, `resourceService.js`, `authRepository.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `app.js`, `invoiceRepository.js`, `Review Controller`, `permissionMiddleware.js`, `reportRoutes.js`, `chatbotRepository.js`, `authService.js`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **Should `react-router-dom` be split into smaller, more focused modules?**
  _Cohesion score 0.07865168539325842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `useFetch` to `react-router-dom`, `Course Listing Components`, `FE_RStudy/package.json`, `formatDateTime`, `Exam & Submission UI`, `DashboardPanel`, `CouponForm.jsx`, `format.js`, `RegisterPage.jsx`, `CreateAdminForm.jsx`, `TextField`, `react`, `sessionFormat.js`, `axiosClient.js`, `ChatPanel.jsx`, `dependencies`, `AppRoutes.jsx`, `PaymentPage.jsx`, `UploadForm.jsx`, `App.jsx`, `Button`, `@tanstack/react-query`, `AdminCoursesPage.jsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05970149253731343 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `Database Seeding` to `AppError`, `resourceService.js`, `database.js`, `invoiceService.js`, `Exam Submission Grading`, `Account Deletion Script`, `Course Routes & Validation`, `BE_RStudy/package.json`, `Course Repository`, `Review Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `reportService.js`, `Enrollment Repository`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `Course Listing Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1014799154334038 - nodes in this community are weakly interconnected._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._