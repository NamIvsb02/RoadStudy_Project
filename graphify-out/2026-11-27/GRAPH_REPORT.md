# Graph Report - RoadStudy  (2026-11-27)

## Corpus Check
- 444 files · ~200,839 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 15, .example 2, .css 2)

## Summary
- 2397 nodes · 7248 edges · 127 communities (109 shown, 18 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 439 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec082779`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- authMiddleware.js
- Initial Database Migration
- TeacherDashboardPage.jsx
- FE_RStudy/package.json
- recommendationService.js
- cache.js
- enrollmentService.js
- buildPaginationMeta
- useFetch
- formatResponse
- ChatPanel.jsx
- Button.jsx
- openapi.js
- authService.js
- Course Repository
- Review Repository
- TeacherShowcase.jsx
- Comment Repository
- FormAlert
- SessionDialog.jsx
- ResourceBrowser.jsx
- Coupon Repository
- Category Controller & Repository
- accountService.js
- notificationService.js
- storage.js
- authRepository.js
- PermissionsPage.jsx
- invoiceRepository.js
- ProfileForm.jsx
- File Upload Middleware
- PaymentPage.jsx
- Administrator Management
- teacherService.js
- CourseExamTable.jsx
- database.js
- invoiceController.js
- scripts.test.js
- Learning Sessions Backend
- Exam Submission Grading
- BE_RStudy/package.json
- Course Routes & Validation
- Exam Routes & Validation
- invoiceService.js
- useFetch.js
- reportService.js
- Learning Routes & Validation
- motion.js
- steps
- react-router-dom
- Review Routes & Validation
- examService.js
- dependencies
- Auth Routes & Validation
- sendOtp
- Category Routes & Validation
- Submission Routes & Validation
- AppError
- AppRoutes.jsx
- backend
- DashboardPanel
- useFetch
- Button
- CouponForm.jsx
- Public Course Tests
- Course Tests
- react
- reportRoutes.js
- reviewController.js
- listByExam
- Review Tests
- dependencies
- dashboardConfig.js
- exam.test.js
- TextField
- axiosClient.js
- TeacherExamsPage.jsx
- Test Auth Helpers
- package.json
- permissions
- resourceRoutes.js
- ExamRoom.jsx
- account.test.js
- ExamForm.jsx
- hash.js
- comment.test.js
- authController.js
- useAuth
- jwt.js
- format.js
- main
- ratelimit.redis.test.js
- redis.test.js
- hardening.p2.test.js
- prisma
- cloudinary.integration.test.js
- signAccessToken
- commentController.js
- scripts
- enrollment.test.js
- CourseNewPage.jsx
- dotenv
- category.test.js
- App.jsx
- main.jsx
- fix-regression.test.js
- bcrypt
- cloudinary
- cors
- rateLimitMiddleware.js
- helmet
- jsonwebtoken
- scripts
- npm@^11.21.1
- cancelRegistrationTx
- ioredis
- multer
- pg@^8.23.1

## God Nodes (most connected - your core abstractions)
1. `AppError` - 169 edges
2. `formatResponse()` - 131 edges
3. `react` - 116 edges
4. `useFetch()` - 81 edges
5. `react-router-dom` - 76 edges
6. `Button()` - 70 edges
7. `useAuth()` - 67 edges
8. `ROUTES` - 63 edges
9. `AppRoutes()` - 53 edges
10. `lucide-react` - 52 edges

## Surprising Connections (you probably didn't know these)
- `issueTokenPair()` --calls--> `createRefreshToken()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `updateAvatar()` --calls--> `updateAvatarIfCurrent()`  [EXTRACTED]
  BE_RStudy/src/services/accountService.js → BE_RStudy/src/repositories/accountRepository.js
- `getProof()` --calls--> `getProof()`  [EXTRACTED]
  BE_RStudy/src/controllers/invoiceController.js → BE_RStudy/src/services/invoiceService.js
- `completeRefund()` --calls--> `updateRegistration()`  [EXTRACTED]
  BE_RStudy/src/services/invoiceService.js → BE_RStudy/src/repositories/invoiceRepository.js
- `AuthShell()` --calls--> `staggerOf()`  [EXTRACTED]
  FE_RStudy/src/components/common/AuthShell.jsx → FE_RStudy/src/constants/motion.js

## Import Cycles
- None detected.

## Communities (127 total, 18 thin omitted)

### Community 0 - "authMiddleware.js"
Cohesion: 0.06
Nodes (44): app, cors, corsOrigins, express, helmet, morgan, path, server (+36 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.05
Nodes (68): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+60 more)

### Community 2 - "TeacherDashboardPage.jsx"
Cohesion: 0.42
Nodes (6): StatCard(), CountCard(), MyCoursesPanel(), RecentAttemptsPanel(), fetchStats(), TeacherDashboardPage()

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.11
Nodes (25): @tailwindcss/vite@^4.3.3, devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18 (+17 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.12
Nodes (28): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+20 more)

### Community 5 - "cache.js"
Cohesion: 0.17
Nodes (17): shutdown(), checkHealth(), close(), isEnabled(), key(), Redis, url, bump() (+9 more)

### Community 6 - "enrollmentService.js"
Cohesion: 0.14
Nodes (25): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+17 more)

### Community 7 - "buildPaginationMeta"
Cohesion: 0.10
Nodes (24): getConversation(), listConversations(), sendMessage(), changeStatus(), create(), getById(), list(), remove() (+16 more)

### Community 8 - "useFetch"
Cohesion: 0.20
Nodes (20): examApi, submissionApi, ResultBadge(), useFetch(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween() (+12 more)

### Community 9 - "formatResponse"
Cohesion: 0.09
Nodes (40): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+32 more)

### Community 10 - "ChatPanel.jsx"
Cohesion: 0.19
Nodes (14): ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, TypingIndicator(), ChatWidget(), GuestPrompt(), MessageBubble() (+6 more)

### Community 11 - "Button.jsx"
Cohesion: 0.14
Nodes (14): schema, StarRating(), STARS, SIZES, VARIANTS, FieldError(), DEFAULT_VALUES, createAdminSchema (+6 more)

### Community 12 - "openapi.js"
Cohesion: 0.15
Nodes (23): buildOpenApi(), buildOperation(), ERROR_TEXT, fs, inspect(), LIMITERS, listRoutes(), METHODS (+15 more)

### Community 13 - "authService.js"
Cohesion: 0.16
Nodes (17): hasSmtpConfig, nodemailer, sendMail(), login(), me(), findByIdSafe(), findRefreshTokenByHashAnyState(), findValidRefreshToken() (+9 more)

### Community 14 - "Course Repository"
Cohesion: 0.09
Nodes (41): buildPublicWhere(), buildWhere(), countActiveRegistrations(), courseInclude, create(), findAndCount(), findById(), findOwnById() (+33 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "TeacherShowcase.jsx"
Cohesion: 0.15
Nodes (15): teacherApi, ChatCourseCard(), CourseCard(), Card(), COURSE_GRID_CLASS, CourseCardSkeleton(), CourseCover(), CourseGrid() (+7 more)

### Community 17 - "Comment Repository"
Cohesion: 0.07
Nodes (42): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS, { Prisma } (+34 more)

### Community 18 - "FormAlert"
Cohesion: 0.17
Nodes (20): authApi, AuthShell(), stepSlide, useToast(), commonShape, forgotPasswordSchema, GENDERS, loginSchema (+12 more)

### Community 19 - "SessionDialog.jsx"
Cohesion: 0.14
Nodes (17): learningApi, dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter, toInputValue() (+9 more)

### Community 20 - "ResourceBrowser.jsx"
Cohesion: 0.31
Nodes (7): resourceApi, ResourceBrowser(), ResourceCard(), Chip(), ResourceCategoryChips(), ResourceListPage(), TeacherResourcesPage()

### Community 21 - "Coupon Repository"
Cohesion: 0.13
Nodes (28): countInvoices(), countStudentUsage(), create(), db(), decrementUsedCount(), findByCode(), findById(), findCourseById() (+20 more)

### Community 22 - "Category Controller & Repository"
Cohesion: 0.12
Nodes (28): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+20 more)

### Community 23 - "accountService.js"
Cohesion: 0.15
Nodes (14): changeStatus(), list(), updateAvatar(), updateProfile(), list(), updateProfile(), COMMON_FIELDS, listAccounts() (+6 more)

### Community 24 - "notificationService.js"
Cohesion: 0.13
Nodes (28): list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany(), findAccountIdByStudentId() (+20 more)

### Community 25 - "storage.js"
Cohesion: 0.11
Nodes (34): findById(), create(), findAndCount(), findById(), findTeacherByAccountId(), include, remove(), updateAvatar() (+26 more)

### Community 26 - "authRepository.js"
Cohesion: 0.16
Nodes (17): changePassword(), logout(), resetPassword(), ACCOUNT_SAFE_SELECT, consumeOtp(), createRefreshToken(), findById(), findLatestValidOtp() (+9 more)

### Community 27 - "PermissionsPage.jsx"
Cohesion: 0.52
Nodes (5): AdminList(), PermissionEditor(), fetchAdmins(), fetchFunctions(), PermissionsPage()

### Community 28 - "invoiceRepository.js"
Cohesion: 0.19
Nodes (21): countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findStudentIdByAccountId(), invoiceInclude, lockStudent(), studentSelect (+13 more)

### Community 29 - "ProfileForm.jsx"
Cohesion: 0.15
Nodes (16): GENDER_OPTIONS, StudentFields(), TeacherFields(), AvatarUploader(), ChangePasswordForm(), ProfileForm(), toFormValues(), toNull() (+8 more)

### Community 30 - "File Upload Middleware"
Cohesion: 0.13
Nodes (19): buildUploader(), DOC_MIMES, hasValidSignature(), IMAGE_MIMES, multer, SIGNATURES, adminNeedsPermission(), canHandlePayment (+11 more)

### Community 31 - "PaymentPage.jsx"
Cohesion: 0.15
Nodes (17): invoiceApi, ProofImage(), useProofImage(), PaymentActions(), PaymentPage(), canRefundPaid(), getStage(), NOTICES (+9 more)

### Community 32 - "Administrator Management"
Cohesion: 0.10
Nodes (34): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), administratorInclude (+26 more)

### Community 33 - "teacherService.js"
Cohesion: 0.14
Nodes (21): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+13 more)

### Community 34 - "CourseExamTable.jsx"
Cohesion: 0.19
Nodes (21): TONES, AdminCoursesPage(), TABS, AdminCourseActions(), CONFIRMS, runAction(), STEPS, ACTION_DANGER (+13 more)

### Community 35 - "database.js"
Cohesion: 0.17
Nodes (14): buildDatasourceUrl(), client, { PrismaClient }, PUBLIC_ACCOUNT_FIELDS, PUBLIC_MODELS, setParam(), WRITE_OPERATIONS, check() (+6 more)

### Community 36 - "invoiceController.js"
Cohesion: 0.20
Nodes (15): approve(), approveRefund(), completeRefund(), getById(), getProof(), listAll(), listMine(), listMyRefundRequests() (+7 more)

### Community 37 - "scripts.test.js"
Cohesion: 0.09
Nodes (29): cleanup(), CLOUD_KINDS, FIELDS, fs, isStillReferenced(), listCloudinary(), loadReferences(), path (+21 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.14
Nodes (35): findTeacherByAccountId(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), db(), findAttemptById(), findExamForStart() (+27 more)

### Community 40 - "BE_RStudy/package.json"
Cohesion: 0.18
Nodes (11): author, description, devDependencies, nodemon@^3.1.14, keywords, license, main, name (+3 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.11
Nodes (19): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+11 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "invoiceService.js"
Cohesion: 0.22
Nodes (18): findInvoices(), findSupportRequestById(), findSupportRequests(), updateSupportIfStatus(), approveRefund(), completeRefund(), INVOICE_STATUSES, listAll() (+10 more)

### Community 44 - "useFetch.js"
Cohesion: 0.22
Nodes (10): axiosClient, categoryApi, PageColumns(), CategoryChips(), Chip(), chipClass(), CourseFilterBar(), CourseListPage() (+2 more)

### Community 45 - "reportService.js"
Cohesion: 0.17
Nodes (19): create(), findAndCount(), findById(), findOpenDuplicate(), findTarget(), include, OPEN_STATUSES, resolveViolation() (+11 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "motion.js"
Cohesion: 0.06
Nodes (60): BENEFITS, Reveal(), RevealGroup(), RoadPath(), SHAPES, ScrollProgress(), SearchBox(), SectionHeader() (+52 more)

### Community 48 - "steps"
Cohesion: 0.08
Nodes (30): defaults, env, runs-on, steps, run, DATABASE_URL, DIRECT_URL, VITE_API_URL (+22 more)

### Community 49 - "react-router-dom"
Cohesion: 0.15
Nodes (17): getNavItems(), MY_COURSES_ITEM, NAV_ITEMS, SOCIAL_ICONS, ADMIN_NAV, getManageNav(), TEACHER_NAV, APPROVAL_NOTICE (+9 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "examService.js"
Cohesion: 0.11
Nodes (37): CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion(), findCourseById(), findExamById() (+29 more)

### Community 52 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, express@^5.2.1, express-rate-limit@^8.7.5, morgan@^1.12.1, nodemailer@^10.1.2, @prisma/client@^6.19.3, swagger-ui-express@^5.0.1, zod@^4.6.7 (+4 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.21
Nodes (13): express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema (+5 more)

### Community 54 - "sendOtp"
Cohesion: 0.18
Nodes (9): crypto, createOtp(), findLatestOtp(), sendOtp(), bcrypt, compareOtp(), crypto, generateOtpCode() (+1 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.11
Nodes (19): PERMISSIONS, adminOnly, router, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema (+11 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "AppError"
Cohesion: 0.14
Nodes (24): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), countRecentStudentMessages(), createAiMessage(), createConversation(), createStudentMessage() (+16 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.08
Nodes (49): AuthLayout(), BottomNav(), Footer(), LoadingState(), PageSkeleton(), ScrollToTop(), Layout(), LeaderRoute() (+41 more)

### Community 59 - "backend"
Cohesion: 0.06
Nodes (33): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+25 more)

### Community 60 - "DashboardPanel"
Cohesion: 0.11
Nodes (31): couponApi, reportApi, ConfirmDialog(), getPages(), Pagination(), ROLE_LABELS, STATUS_MAPS, AccountsFilterBar() (+23 more)

### Community 61 - "useFetch"
Cohesion: 0.24
Nodes (12): enrollmentApi, EmptyState(), ErrorState(), ListSkeleton(), CommentSection(), ExamListPage(), fetchPaidCourses(), CourseExams() (+4 more)

### Community 62 - "Button"
Cohesion: 0.14
Nodes (23): NoteDialog(), NoteForm(), ReportDialog(), ReportForm(), schema, Button(), FormAlert(), fadeIn (+15 more)

### Community 63 - "CouponForm.jsx"
Cohesion: 0.38
Nodes (8): CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso(), vnDate

### Community 64 - "Public Course Tests"
Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"
Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "react"
Cohesion: 0.16
Nodes (19): commentApi, reviewApi, ContentForm(), InlineConfirmDelete(), ReportButton(), REPORTERS, Sidebar(), Avatar() (+11 more)

### Community 67 - "reportRoutes.js"
Cohesion: 0.33
Nodes (7): adminOnly, router, createReportSchema, idParamSchema, processReportSchema, rejectReportSchema, { z }

### Community 68 - "reviewController.js"
Cohesion: 0.36
Nodes (9): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+1 more)

### Community 69 - "listByExam"
Cohesion: 0.67
Nodes (3): findExamBasic(), findManyByExam(), listByExam()

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-hook-form@^7.91.0 (+8 more)

### Community 72 - "dashboardConfig.js"
Cohesion: 0.24
Nodes (10): accountApi, PERMISSIONS, AdminDashboardPage(), fetchPendingPayments(), fetchPendingTeachers(), PENDING_CARDS, TOTAL_CARDS, PaymentsTable() (+2 more)

### Community 73 - "exam.test.js"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "TextField"
Cohesion: 0.19
Nodes (18): FormField(), inputClass(), PasswordInput, TextField, CommonRegisterFields(), LoginPage(), otpInputClass(), ResetPasswordPage() (+10 more)

### Community 75 - "axiosClient.js"
Cohesion: 0.18
Nodes (7): adminApi, AUTH_LOGOUT_EVENT, NO_REFRESH_URLS, chatbotApi, notificationApi, recommendationApi, tokenStorage

### Community 76 - "TeacherExamsPage.jsx"
Cohesion: 0.18
Nodes (16): courseApi, CourseSelect(), DashboardPanel(), TableSkeleton(), Switch(), AdminExamsPage(), fetchCourses(), byNewest() (+8 more)

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
Cohesion: 0.27
Nodes (7): contentWriteLimiter, adminNeedsPermission(), checkAdminPermission, router, createResourceSchema, idParamSchema, { z }

### Community 90 - "ExamRoom.jsx"
Cohesion: 0.30
Nodes (8): secondsLeft(), useCountdown(), ExamTakePage(), ExamRoom(), toList(), QuestionCard(), pad(), SidePanel()

### Community 91 - "account.test.js"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 92 - "ExamForm.jsx"
Cohesion: 0.30
Nodes (9): ExamForm(), EMPTY_QUESTION(), examSchema, isNumber(), numberField(), optionSchema, questionSchema, toExamBody() (+1 more)

### Community 93 - "hash.js"
Cohesion: 0.18
Nodes (12): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+4 more)

### Community 94 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 95 - "authController.js"
Cohesion: 0.16
Nodes (14): forgotPassword(), refresh(), register(), resendOtp(), verifyEmail(), createStudentAccount(), createTeacherAccount(), findByEmail() (+6 more)

### Community 96 - "useAuth"
Cohesion: 0.19
Nodes (16): Header(), MainNav(), NotificationBell(), SHAKE, getMenuItems(), UserMenu(), ExamLayout(), dropdown (+8 more)

### Community 97 - "jwt.js"
Cohesion: 0.22
Nodes (12): sha256(), jwt, signRefreshToken(), bcrypt, call(), check(), countBy(), fs (+4 more)

### Community 98 - "format.js"
Cohesion: 0.15
Nodes (19): StatusBadge(), AccountsTable(), AdminRefundsPage(), RefundCard(), getTarget(), ReportCard(), TARGETS, ReportsPage() (+11 more)

### Community 99 - "main"
Cohesion: 0.29
Nodes (13): check(), docker(), get(), main(), path, sleep(), { spawn, execFileSync }, STAMP (+5 more)

### Community 100 - "ratelimit.redis.test.js"
Cohesion: 0.29
Nodes (13): check(), docker(), login(), main(), path, sleep(), { spawn, execFileSync }, STAMP (+5 more)

### Community 101 - "redis.test.js"
Cohesion: 0.31
Nodes (11): check(), docker(), main(), path, ready(), sleep(), { spawn, execFileSync }, startServer() (+3 more)

### Community 102 - "hardening.p2.test.js"
Cohesion: 0.29
Nodes (9): AVATAR_DIR, avatarForm(), BASE, call(), check(), countBy(), fs, main() (+1 more)

### Community 103 - "prisma"
Cohesion: 0.13
Nodes (15): prisma, findByIdSafe(), LIST_SELECT, revokeAllRefreshTokens(), SAFE_SELECT, updateAvatarIfCurrent(), updateStatus(), changeStatus() (+7 more)

### Community 104 - "cloudinary.integration.test.js"
Cohesion: 0.22
Nodes (10): bodies, call(), check(), DOCX_MIN, formOf(), httpStatus(), PDF_MIN, PNG_1X1 (+2 more)

### Community 105 - "signAccessToken"
Cohesion: 0.13
Nodes (22): signAccessToken(), call(), check(), main(), call(), check(), codes(), main() (+14 more)

### Community 106 - "commentController.js"
Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 107 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 108 - "enrollment.test.js"
Cohesion: 0.29
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 109 - "CourseNewPage.jsx"
Cohesion: 0.25
Nodes (9): BackButton(), courseSchema, EDITABLE_STATUSES, EMPTY_COURSE, isNumber(), toFormValues(), CourseEditPage(), CourseNewPage() (+1 more)

### Community 110 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.3, prisma@^6.19.3, dotenv, prisma

### Community 111 - "category.test.js"
Cohesion: 0.70
Nodes (4): call(), check(), main(), names()

### Community 112 - "App.jsx"
Cohesion: 0.36
Nodes (6): App(), Toast(), AuthProvider(), fetchAccount(), ToastProvider(), ToastContext

### Community 113 - "main.jsx"
Cohesion: 0.40
Nodes (3): react-dom@^19.2.8, queryClient, react-dom

### Community 114 - "fix-regression.test.js"
Cohesion: 0.70
Nodes (4): call(), check(), main(), sleep()

### Community 118 - "rateLimitMiddleware.js"
Cohesion: 0.18
Nodes (8): isReady(), authCredentialLimiter, authIpLimiter, buildLimiter(), { rateLimit, ipKeyGenerator }, { MemoryStore }, RedisFallbackStore, express-rate-limit

### Community 121 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 123 - "cancelRegistrationTx"
Cohesion: 0.67
Nodes (3): cancelRegistrationRecords(), releaseCoupon(), cancelRegistrationTx()

## Knowledge Gaps
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `authMiddleware.js`, `recommendationService.js`, `enrollmentService.js`, `formatResponse`, `authService.js`, `Course Repository`, `Review Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `accountService.js`, `notificationService.js`, `storage.js`, `authRepository.js`, `invoiceRepository.js`, `File Upload Middleware`, `Administrator Management`, `teacherService.js`, `database.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `invoiceService.js`, `reportService.js`, `examService.js`, `sendOtp`, `reviewController.js`, `listByExam`, `authController.js`, `prisma`, `cancelRegistrationTx`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Should `authMiddleware.js` be split into smaller, more focused modules?**
  _Cohesion score 0.057539682539682536 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FE_RStudy/package.json`, `useFetch`, `ChatPanel.jsx`, `Button.jsx`, `TeacherShowcase.jsx`, `FormAlert`, `SessionDialog.jsx`, `ResourceBrowser.jsx`, `PermissionsPage.jsx`, `ProfileForm.jsx`, `PaymentPage.jsx`, `CourseExamTable.jsx`, `useFetch.js`, `motion.js`, `react-router-dom`, `AppRoutes.jsx`, `DashboardPanel`, `useFetch`, `Button`, `CouponForm.jsx`, `dependencies`, `dashboardConfig.js`, `TextField`, `axiosClient.js`, `TeacherExamsPage.jsx`, `ExamRoom.jsx`, `ExamForm.jsx`, `useAuth`, `App.jsx`, `main.jsx`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `Comment Repository` to `database.js`, `enrollmentService.js`, `Exam Submission Grading`, `BE_RStudy/package.json`, `Course Routes & Validation`, `invoiceService.js`, `reportService.js`, `Course Repository`, `Review Repository`, `examService.js`, `dependencies`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `storage.js`, `hash.js`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `recommendationService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11742424242424243 - nodes in this community are weakly interconnected._