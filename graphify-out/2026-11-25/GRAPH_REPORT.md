# Graph Report - RoadStudy  (2026-11-25)

## Corpus Check
- 426 files · ~162,547 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 24 file(s) not represented in the graph (top: (none) 16, .example 2, .css 2)

## Summary
- 2361 nodes · 6883 edges · 117 communities (104 shown, 13 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 436 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24d03c7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.js
- Initial Database Migration
- LoadingState
- FE_RStudy/package.json
- recommendationService.js
- cache.js
- enrollmentService.js
- getPagination
- useFetch
- environment
- ChatPanel.jsx
- roles.js
- hardening.p2.test.js
- AppError.js
- Course Repository
- Review Repository
- routes.js
- Comment Repository
- FormAlert
- sessionFormat.js
- chatbotRepository.js
- Coupon Repository
- Category Controller & Repository
- accountService.js
- notificationService.js
- storage.js
- authRepository.js
- courseRepository.js
- invoiceRepository.js
- ProfileForm.jsx
- File Upload Middleware
- PaymentPage.jsx
- Administrator Management
- teacherService.js
- CourseExamTable.jsx
- database.js
- NotificationBell.jsx
- scripts.test.js
- Learning Sessions Backend
- Exam Submission Grading
- ratelimit.redis.test.js
- Course Routes & Validation
- Exam Routes & Validation
- invoiceService.js
- signAccessToken
- reportService.js
- Learning Routes & Validation
- motion.js
- steps
- ManageLayout.jsx
- Review Routes & Validation
- examService.js
- BE_RStudy/package.json
- Auth Routes & Validation
- accountRoutes.js
- Category Routes & Validation
- Submission Routes & Validation
- Button
- AppRoutes.jsx
- backend
- DashboardPanel
- format.js
- account.test.js
- CouponForm.jsx
- Public Course Tests
- Course Tests
- TeacherDashboardPage.jsx
- ref_zod
- reviewController.js
- enrollment.test.js
- Review Tests
- RedisFallbackStore
- Account Deletion Script
- exam.test.js
- TextField
- App.jsx
- cloudinary.integration.test.js
- Test Auth Helpers
- package.json
- permissions
- resourceRoutes.js
- benchmark/seed.js
- reportRoutes.js
- public.js
- hash.js
- comment.test.js
- prisma
- redis.js
- commentRoutes.js
- axiosClient.js
- CourseForm.jsx
- rateLimitStore.js
- summarize.js
- ExamForm.jsx
- db-entrypoint.sh
- formatResponse
- prisma
- commentController.js
- scripts
- redis.test.js
- ResourceBrowser.jsx
- EnrollPanel.jsx
- adminValidator.js
- dotenv
- @tanstack/react-query
- listByExam
- category.test.js
- common/Pagination.jsx

## God Nodes (most connected - your core abstractions)
1. `AppError` - 166 edges
2. `formatResponse()` - 131 edges
3. `react` - 104 edges
4. `Button()` - 95 edges
5. `useFetch()` - 83 edges
6. `FormAlert()` - 73 edges
7. `react-router-dom` - 73 edges
8. `useAuth()` - 63 edges
9. `ROUTES` - 61 edges
10. `AppRoutes()` - 53 edges

## Surprising Connections (you probably didn't know these)
- `completeRefund()` --calls--> `updateRegistration()`  [EXTRACTED]
  BE_RStudy/src/services/invoiceService.js → BE_RStudy/src/repositories/invoiceRepository.js
- `parseListQuery()` --calls--> `AppError`  [EXTRACTED]
  BE_RStudy/src/controllers/courseController.js → BE_RStudy/src/utils/AppError.js
- `create()` --calls--> `AppError`  [EXTRACTED]
  BE_RStudy/src/controllers/resourceController.js → BE_RStudy/src/utils/AppError.js
- `parseListQuery()` --calls--> `AppError`  [EXTRACTED]
  BE_RStudy/src/controllers/reviewController.js → BE_RStudy/src/utils/AppError.js
- `authenticate()` --calls--> `AppError`  [EXTRACTED]
  BE_RStudy/src/middlewares/authMiddleware.js → BE_RStudy/src/utils/AppError.js

## Import Cycles
- None detected.

## Communities (117 total, 13 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.09
Nodes (20): express@^5.2.1, app, cors, corsOrigins, express, helmet, morgan, path (+12 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.05
Nodes (68): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+60 more)

### Community 2 - "LoadingState"
Cohesion: 0.15
Nodes (28): categoryApi, CourseGrid(), PageColumns(), SectionHeader(), EmptyState(), ErrorState(), LoadingState(), useFetch() (+20 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.06
Nodes (47): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-dom@^19.2.8 (+39 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.12
Nodes (28): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+20 more)

### Community 5 - "cache.js"
Cohesion: 0.16
Nodes (23): bump(), client(), crypto, getOrSet(), hashParams(), inflight, jitter(), readVersion() (+15 more)

### Community 6 - "enrollmentService.js"
Cohesion: 0.15
Nodes (24): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+16 more)

### Community 7 - "getPagination"
Cohesion: 0.13
Nodes (25): getConversation(), listConversations(), sendMessage(), approve(), approveRefund(), completeRefund(), getById(), listAll() (+17 more)

### Community 8 - "useFetch"
Cohesion: 0.13
Nodes (26): examApi, submissionApi, ResultBadge(), secondsLeft(), useCountdown(), AttemptHistory(), ExamDetailPage(), InfoItem() (+18 more)

### Community 9 - "environment"
Cohesion: 0.05
Nodes (46): build, cpus, depends_on, environment, image, mem_limit, ports, cap_add (+38 more)

### Community 10 - "ChatPanel.jsx"
Cohesion: 0.18
Nodes (14): chatbotApi, ChatCourseCard(), ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, ChatWidget(), GuestPrompt() (+6 more)

### Community 11 - "roles.js"
Cohesion: 0.23
Nodes (14): commentApi, ContentForm(), InlineConfirmDelete(), ReportButton(), REPORTERS, ReportDialog(), StarRating(), STARS (+6 more)

### Community 12 - "hardening.p2.test.js"
Cohesion: 0.29
Nodes (9): AVATAR_DIR, avatarForm(), BASE, call(), check(), countBy(), fs, main() (+1 more)

### Community 13 - "AppError.js"
Cohesion: 0.13
Nodes (15): buildWhere(), findAndCount(), findById(), create(), findAndCount(), findById(), findTeacherByAccountId(), include (+7 more)

### Community 14 - "Course Repository"
Cohesion: 0.10
Nodes (38): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+30 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "routes.js"
Cohesion: 0.15
Nodes (16): AuthLayout(), BottomNav(), Footer(), Header(), MainNav(), getNavItems(), MY_COURSES_ITEM, NAV_ITEMS (+8 more)

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "FormAlert"
Cohesion: 0.17
Nodes (19): authApi, AuthShell(), useToast(), commonShape, forgotPasswordSchema, GENDERS, loginSchema, resetPasswordSchema (+11 more)

### Community 19 - "sessionFormat.js"
Cohesion: 0.29
Nodes (7): dayFormatter, formatSessionTime(), inputFormatter, sessionState(), timeFormatter, BADGES, SessionList()

### Community 20 - "chatbotRepository.js"
Cohesion: 0.16
Nodes (20): countRecentStudentMessages(), createAiMessage(), createConversation(), createStudentMessage(), db(), findConversationById(), findConversations(), findMessages() (+12 more)

### Community 21 - "Coupon Repository"
Cohesion: 0.12
Nodes (30): countInvoices(), countStudentUsage(), create(), db(), decrementUsedCount(), findByCode(), findById(), findCourseById() (+22 more)

### Community 22 - "Category Controller & Repository"
Cohesion: 0.16
Nodes (21): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+13 more)

### Community 23 - "accountService.js"
Cohesion: 0.15
Nodes (14): changeStatus(), list(), updateAvatar(), updateProfile(), list(), updateProfile(), COMMON_FIELDS, listAccounts() (+6 more)

### Community 24 - "notificationService.js"
Cohesion: 0.13
Nodes (28): list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany(), findAccountIdByStudentId() (+20 more)

### Community 25 - "storage.js"
Cohesion: 0.14
Nodes (25): baseFolder(), crypto, driver(), EXTENSIONS, fs, getCloudinary(), isUrl(), ownCloudinaryAsset() (+17 more)

### Community 26 - "authRepository.js"
Cohesion: 0.08
Nodes (46): changePassword(), forgotPassword(), login(), logout(), me(), refresh(), register(), resendOtp() (+38 more)

### Community 27 - "courseRepository.js"
Cohesion: 0.12
Nodes (9): buildPublicWhere(), buildWhere(), courseInclude, findAndCount(), findPublicAndCount(), PUBLIC_SORTS, publicBaseWhere, publicDetailSelect (+1 more)

### Community 28 - "invoiceRepository.js"
Cohesion: 0.17
Nodes (21): getProof(), countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findStudentIdByAccountId(), invoiceInclude, lockStudent() (+13 more)

### Community 29 - "ProfileForm.jsx"
Cohesion: 0.14
Nodes (16): accountApi, TeacherFields(), ACCEPTED_TYPES, AvatarUploader(), ChangePasswordForm(), ProfileForm(), toFormValues(), toNull() (+8 more)

### Community 30 - "File Upload Middleware"
Cohesion: 0.13
Nodes (19): buildUploader(), DOC_MIMES, hasValidSignature(), IMAGE_MIMES, multer, SIGNATURES, adminNeedsPermission(), canHandlePayment (+11 more)

### Community 31 - "PaymentPage.jsx"
Cohesion: 0.17
Nodes (16): enrollmentApi, BackButton(), ExamListPage(), fetchPaidCourses(), CourseExams(), PaymentActions(), PaymentPage(), canRefundPaid() (+8 more)

### Community 32 - "Administrator Management"
Cohesion: 0.13
Nodes (28): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), administratorInclude (+20 more)

### Community 33 - "teacherService.js"
Cohesion: 0.21
Nodes (14): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), APPROVALS, cleanSearch(), getMyStats() (+6 more)

### Community 34 - "CourseExamTable.jsx"
Cohesion: 0.15
Nodes (15): courseApi, CourseSelect(), CONFIRMS, STEPS, byNewest(), CourseExamTable(), ADMIN_NEXT, ExamActions() (+7 more)

### Community 35 - "database.js"
Cohesion: 0.13
Nodes (17): buildDatasourceUrl(), client, { PrismaClient }, PUBLIC_ACCOUNT_FIELDS, PUBLIC_MODELS, setParam(), WRITE_OPERATIONS, { Prisma } (+9 more)

### Community 36 - "NotificationBell.jsx"
Cohesion: 0.35
Nodes (7): notificationApi, NotificationBell(), SHAKE, NotificationItem(), useMarkRead(), useNotificationList(), useUnreadCount()

### Community 37 - "scripts.test.js"
Cohesion: 0.09
Nodes (29): cleanup(), CLOUD_KINDS, FIELDS, fs, isStillReferenced(), listCloudinary(), loadReferences(), path (+21 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.14
Nodes (35): findTeacherByAccountId(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), db(), findAttemptById(), findExamForStart() (+27 more)

### Community 40 - "ratelimit.redis.test.js"
Cohesion: 0.29
Nodes (13): check(), docker(), login(), main(), path, sleep(), { spawn, execFileSync }, STAMP (+5 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.11
Nodes (19): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+11 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "invoiceService.js"
Cohesion: 0.15
Nodes (25): hasSmtpConfig, nodemailer, sendMail(), findInvoices(), findSupportRequestById(), findSupportRequests(), updateSupportIfStatus(), approveRefund() (+17 more)

### Community 44 - "signAccessToken"
Cohesion: 0.17
Nodes (16): createRefreshToken(), issueTokenPair(), sha256(), jwt, parseDurationToMs(), signRefreshToken(), verifyRefreshToken(), bcrypt (+8 more)

### Community 45 - "reportService.js"
Cohesion: 0.17
Nodes (19): create(), findAndCount(), findById(), findOpenDuplicate(), findTarget(), include, OPEN_STATUSES, resolveViolation() (+11 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "motion.js"
Cohesion: 0.11
Nodes (28): NoteForm(), ProofImage(), ReportForm(), schema, FormAlert(), fadeIn, scaleIn, slideInLeft (+20 more)

### Community 48 - "steps"
Cohesion: 0.08
Nodes (30): defaults, env, runs-on, steps, run, DATABASE_URL, DIRECT_URL, VITE_API_URL (+22 more)

### Community 49 - "ManageLayout.jsx"
Cohesion: 0.15
Nodes (19): getMenuItems(), UserMenu(), LeaderRoute(), ADMIN_NAV, getManageNav(), TEACHER_NAV, APPROVAL_NOTICE, ManageLayout() (+11 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "examService.js"
Cohesion: 0.11
Nodes (37): CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion(), findCourseById(), findExamById() (+29 more)

### Community 52 - "BE_RStudy/package.json"
Cohesion: 0.08
Nodes (34): author, dependencies, bcrypt@^6.0.0, cloudinary@^2.11.0, cors@^2.8.6, helmet@^8.3.0, jsonwebtoken@^9.0.3, morgan@^1.12.1 (+26 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.15
Nodes (17): authCredentialLimiter, authIpLimiter, contentWriteLimiter, { rateLimit, ipKeyGenerator }, express, router, changePasswordSchema, forgotPasswordSchema (+9 more)

### Community 54 - "accountRoutes.js"
Cohesion: 0.19
Nodes (11): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), express, manageAccounts, router, router (+3 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "Button"
Cohesion: 0.12
Nodes (21): adminApi, schema, ErrorState(), Button(), VARIANTS, FieldError(), CategoryForm(), schema (+13 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.09
Nodes (38): LoadingState(), ExamLayout(), ProtectedRoute(), ForbiddenPage(), AccountsPage, AdminCategoriesPage, AdminCouponsPage, AdminCoursesPage (+30 more)

### Community 59 - "backend"
Cohesion: 0.06
Nodes (33): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+25 more)

### Community 60 - "DashboardPanel"
Cohesion: 0.08
Nodes (55): ConfirmDialog(), DashboardPanel(), NoteDialog(), getPages(), Pagination(), StatusBadge(), TONES, ROLE_LABELS (+47 more)

### Community 61 - "format.js"
Cohesion: 0.16
Nodes (16): recommendationApi, CourseCard(), CourseCover(), TeacherAvatarList(), Avatar(), SIZES, CourseHero(), ForYouSection() (+8 more)

### Community 62 - "account.test.js"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 63 - "CouponForm.jsx"
Cohesion: 0.38
Nodes (8): CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso(), vnDate

### Community 64 - "Public Course Tests"
Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"
Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "TeacherDashboardPage.jsx"
Cohesion: 0.30
Nodes (7): teacherApi, StatCard(), CountCard(), MyCoursesPanel(), RecentAttemptsPanel(), fetchStats(), TeacherDashboardPage()

### Community 67 - "ref_zod"
Cohesion: 0.16
Nodes (12): PERMISSIONS, router, express, router, base, changeStatusSchema, createCouponSchema, updateCouponSchema (+4 more)

### Community 68 - "reviewController.js"
Cohesion: 0.36
Nodes (9): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+1 more)

### Community 69 - "enrollment.test.js"
Cohesion: 0.33
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 72 - "Account Deletion Script"
Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 73 - "exam.test.js"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "TextField"
Cohesion: 0.28
Nodes (13): FormField(), inputClass(), PasswordInput, TextField, CommonRegisterFields(), LoginPage(), GENDER_OPTIONS, StudentFields() (+5 more)

### Community 75 - "App.jsx"
Cohesion: 0.18
Nodes (11): AUTH_LOGOUT_EVENT, App(), Toast(), TYPES, slideInRight, AuthProvider(), fetchAccount(), AuthContext (+3 more)

### Community 76 - "cloudinary.integration.test.js"
Cohesion: 0.14
Nodes (19): findByIdSafe(), LIST_SELECT, revokeAllRefreshTokens(), SAFE_SELECT, updateAvatarIfCurrent(), updateStatus(), changeStatus(), updateAvatar() (+11 more)

### Community 77 - "Test Auth Helpers"
Cohesion: 0.48
Nodes (6): asToken(), authHeaders(), buildCandidates(), cache, makeToken(), verifies()

### Community 78 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, prettier@^3.10.1, prettier

### Community 79 - "permissions"
Cohesion: 0.22
Nodes (8): hooks, PreToolUse, SessionStart, permissions, allow, ask, deny, $schema

### Community 89 - "resourceRoutes.js"
Cohesion: 0.31
Nodes (6): adminNeedsPermission(), checkAdminPermission, router, createResourceSchema, idParamSchema, { z }

### Community 90 - "benchmark/seed.js"
Cohesion: 0.28
Nodes (7): chunk(), crypto, main(), prisma, { PrismaClient }, TOPICS, uuid()

### Community 91 - "reportRoutes.js"
Cohesion: 0.33
Nodes (7): adminOnly, router, createReportSchema, idParamSchema, processReportSchema, rejectReportSchema, { z }

### Community 92 - "public.js"
Cohesion: 0.25
Nodes (3): ENDPOINTS, options, VUS

### Community 93 - "hash.js"
Cohesion: 0.11
Nodes (17): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+9 more)

### Community 94 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 96 - "redis.js"
Cohesion: 0.20
Nodes (8): ioredis@^6.1.0, shutdown(), checkHealth(), close(), isReady(), Redis, url, ioredis

### Community 97 - "commentRoutes.js"
Cohesion: 0.18
Nodes (14): authenticate(), authorize(), optionalAuthenticate(), readToken(), router, writers, router, verifyAccessToken() (+6 more)

### Community 98 - "axiosClient.js"
Cohesion: 0.10
Nodes (18): axiosClient, NO_REFRESH_URLS, couponApi, invoiceApi, learningApi, reportApi, reviewApi, Switch() (+10 more)

### Community 99 - "CourseForm.jsx"
Cohesion: 0.22
Nodes (13): CourseForm(), courseSchema, EDITABLE_STATUSES, EMPTY_COURSE, isNumber(), toCourseBody(), toFormValues(), loadImage() (+5 more)

### Community 100 - "rateLimitStore.js"
Cohesion: 0.50
Nodes (3): express-rate-limit@^8.7.5, { MemoryStore }, express-rate-limit

### Community 101 - "summarize.js"
Cohesion: 0.18
Nodes (15): MSYS_NO_PATHCONV, psql_db(), redis_cli(), run.sh script, [cmd, a, b], compare(), ENDPOINTS, fs (+7 more)

### Community 102 - "ExamForm.jsx"
Cohesion: 0.28
Nodes (10): ExamForm(), EMPTY_QUESTION(), examSchema, isNumber(), numberField(), optionSchema, questionSchema, toExamBody() (+2 more)

### Community 104 - "formatResponse"
Cohesion: 0.09
Nodes (38): changeStatus(), create(), getById(), list(), remove(), update(), validate(), cancel() (+30 more)

### Community 105 - "prisma"
Cohesion: 0.11
Nodes (27): prisma, signAccessToken(), call(), check(), main(), call(), check(), codes() (+19 more)

### Community 106 - "commentController.js"
Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 107 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 108 - "redis.test.js"
Cohesion: 0.35
Nodes (11): check(), docker(), main(), path, ready(), sleep(), { spawn, execFileSync }, startServer() (+3 more)

### Community 109 - "ResourceBrowser.jsx"
Cohesion: 0.50
Nodes (4): resourceApi, ResourceBrowser(), ResourceListPage(), TeacherResourcesPage()

### Community 110 - "EnrollPanel.jsx"
Cohesion: 0.46
Nodes (5): useMyRegistration(), CourseEnrollBox(), EnrolledNotice(), EnrollForm(), EnrollPanel()

### Community 111 - "adminValidator.js"
Cohesion: 0.29
Nodes (6): createAdminSchema, idParamSchema, listQuerySchema, updatePermissionsSchema, updateStatusSchema, { z }

### Community 112 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.3, prisma@^6.19.3, dotenv, prisma

### Community 113 - "@tanstack/react-query"
Cohesion: 0.47
Nodes (3): @tanstack/react-query@^5.107.1, queryClient, @tanstack/react-query

### Community 114 - "listByExam"
Cohesion: 0.67
Nodes (3): findExamBasic(), findManyByExam(), listByExam()

### Community 115 - "category.test.js"
Cohesion: 0.70
Nodes (4): call(), check(), main(), names()

## Knowledge Gaps
- **1 isolated node(s):** `MSYS_NO_PATHCONV`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 498 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `chatbotRepository.js` to `app.js`, `recommendationService.js`, `enrollmentService.js`, `AppError.js`, `Course Repository`, `Review Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `accountService.js`, `notificationService.js`, `storage.js`, `authRepository.js`, `invoiceRepository.js`, `File Upload Middleware`, `Administrator Management`, `teacherService.js`, `database.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `invoiceService.js`, `reportService.js`, `examService.js`, `accountRoutes.js`, `reviewController.js`, `cloudinary.integration.test.js`, `commentRoutes.js`, `formatResponse`, `adminValidator.js`, `listByExam`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **What connects `MSYS_NO_PATHCONV` to the rest of the system?**
  _1 weakly-connected nodes found - possible missing edges._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `database.js` to `enrollmentService.js`, `Exam Submission Grading`, `Account Deletion Script`, `Course Routes & Validation`, `invoiceService.js`, `reportService.js`, `Course Repository`, `Review Repository`, `AppError.js`, `Comment Repository`, `examService.js`, `BE_RStudy/package.json`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `hash.js`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `motion.js` to `LoadingState`, `FE_RStudy/package.json`, `useFetch`, `ChatPanel.jsx`, `roles.js`, `routes.js`, `FormAlert`, `sessionFormat.js`, `ProfileForm.jsx`, `PaymentPage.jsx`, `CourseExamTable.jsx`, `NotificationBell.jsx`, `ManageLayout.jsx`, `Button`, `AppRoutes.jsx`, `DashboardPanel`, `format.js`, `CouponForm.jsx`, `TextField`, `App.jsx`, `axiosClient.js`, `CourseForm.jsx`, `ExamForm.jsx`, `ResourceBrowser.jsx`, `@tanstack/react-query`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._