# Graph Report - RoadStudy  (2026-11-26)

## Corpus Check
- 442 files · ~170,055 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 15, .example 2, .css 2)

## Summary
- 2391 nodes · 7274 edges · 108 communities (99 shown, 9 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 440 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0cf4d9f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.js
- Initial Database Migration
- dashboardConfig.js
- FE_RStudy/package.json
- recommendationService.js
- cache.js
- enrollmentService.js
- getPagination
- useFetch
- formatResponse
- ChatPanel.jsx
- react
- openapi.js
- authService.js
- Course Repository
- Review Repository
- Layout.jsx
- Comment Repository
- FormAlert
- SessionDialog.jsx
- UploadForm.jsx
- Coupon Repository
- Category Controller & Repository
- accountService.js
- notificationService.js
- storage.js
- authRepository.js
- Button
- invoiceRepository.js
- roles.js
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
- signAccessToken
- reportService.js
- Learning Routes & Validation
- motion.js
- steps
- useAuth
- Review Routes & Validation
- examService.js
- dependencies
- Auth Routes & Validation
- sendOtp
- Category Routes & Validation
- Submission Routes & Validation
- resourceService.js
- AppRoutes.jsx
- backend
- DashboardPanel
- common/ErrorState.jsx
- FormAlert
- CouponForm.jsx
- Public Course Tests
- Course Tests
- react-router-dom
- reportRoutes.js
- reviewController.js
- enrollment.test.js
- Review Tests
- CategoryForm.jsx
- Account Deletion Script
- exam.test.js
- TextField
- axiosClient.js
- cloudinary.integration.test.js
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
- swagger.test.js
- ref_zod
- format.js
- profileSchemas.js
- cancelRegistrationTx
- couponRoutes.js
- hardening.p2.test.js
- accountRepository.js
- prisma
- commentController.js
- scripts
- dotenv

## God Nodes (most connected - your core abstractions)
1. `AppError` - 169 edges
2. `formatResponse()` - 131 edges
3. `react` - 115 edges
4. `useFetch()` - 83 edges
5. `react-router-dom` - 77 edges
6. `Button()` - 70 edges
7. `useAuth()` - 67 edges
8. `ROUTES` - 65 edges
9. `AppRoutes()` - 53 edges
10. `lucide-react` - 50 edges

## Surprising Connections (you probably didn't know these)
- `completeRefund()` --calls--> `updateRegistration()`  [EXTRACTED]
  BE_RStudy/src/services/invoiceService.js → BE_RStudy/src/repositories/invoiceRepository.js
- `issueTokenPair()` --calls--> `createRefreshToken()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `ChatCourseCard()` --calls--> `CourseCover()`  [EXTRACTED]
  FE_RStudy/src/components/chatbot/ChatCourseCard.jsx → FE_RStudy/src/components/common/CourseCover.jsx
- `ChatCourseCard()` --calls--> `formatVND()`  [EXTRACTED]
  FE_RStudy/src/components/chatbot/ChatCourseCard.jsx → FE_RStudy/src/utils/format.js
- `ChatHistory()` --calls--> `EmptyState()`  [EXTRACTED]
  FE_RStudy/src/components/chatbot/ChatHistory.jsx → FE_RStudy/src/components/common/EmptyState.jsx

## Import Cycles
- None detected.

## Communities (108 total, 9 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.09
Nodes (33): app, cors, corsOrigins, express, helmet, morgan, path, server (+25 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.05
Nodes (68): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+60 more)

### Community 2 - "dashboardConfig.js"
Cohesion: 0.16
Nodes (15): reportApi, teacherApi, StatCard(), PERMISSIONS, CountCard(), fetchPendingPayments(), fetchPendingTeachers(), PENDING_CARDS (+7 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-dom@^19.2.8 (+42 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.07
Nodes (47): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+39 more)

### Community 5 - "cache.js"
Cohesion: 0.06
Nodes (55): shutdown(), checkHealth(), close(), isEnabled(), isReady(), key(), Redis, url (+47 more)

### Community 6 - "enrollmentService.js"
Cohesion: 0.14
Nodes (25): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+17 more)

### Community 7 - "getPagination"
Cohesion: 0.10
Nodes (24): getConversation(), listConversations(), sendMessage(), changeStatus(), create(), getById(), list(), remove() (+16 more)

### Community 8 - "useFetch"
Cohesion: 0.23
Nodes (18): ResultBadge(), useFetch(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween(), formatDuration(), formatScore() (+10 more)

### Community 9 - "formatResponse"
Cohesion: 0.09
Nodes (39): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+31 more)

### Community 10 - "ChatPanel.jsx"
Cohesion: 0.16
Nodes (17): chatbotApi, ChatCourseCard(), ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, TypingIndicator(), ChatWidget() (+9 more)

### Community 11 - "react"
Cohesion: 0.10
Nodes (33): commentApi, reviewApi, ContentForm(), schema, InlineConfirmDelete(), ReportButton(), REPORTERS, ReportDialog() (+25 more)

### Community 12 - "openapi.js"
Cohesion: 0.16
Nodes (14): version, buildOperation(), ERROR_TEXT, fs, inspect(), LIMITERS, METHODS, moduleOrder() (+6 more)

### Community 13 - "authService.js"
Cohesion: 0.16
Nodes (17): hasSmtpConfig, nodemailer, sendMail(), login(), me(), findByIdSafe(), findRefreshTokenByHashAnyState(), findValidRefreshToken() (+9 more)

### Community 14 - "Course Repository"
Cohesion: 0.09
Nodes (40): buildPublicWhere(), buildWhere(), countActiveRegistrations(), courseInclude, create(), findAndCount(), findById(), findOwnById() (+32 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (37): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+29 more)

### Community 16 - "Layout.jsx"
Cohesion: 0.42
Nodes (8): AuthLayout(), BottomNav(), Footer(), PageSkeleton(), ScrollToTop(), Sidebar(), Layout(), pageEnter

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "FormAlert"
Cohesion: 0.14
Nodes (24): authApi, AuthShell(), BENEFITS, stepSlide, useToast(), commonShape, forgotPasswordSchema, GENDERS (+16 more)

### Community 19 - "SessionDialog.jsx"
Cohesion: 0.13
Nodes (18): learningApi, dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter, toInputValue() (+10 more)

### Community 20 - "UploadForm.jsx"
Cohesion: 0.18
Nodes (11): categoryApi, resourceApi, ResourceBrowser(), ResourceCard(), Chip(), ResourceCategoryChips(), ResourceListPage(), fetchCategories() (+3 more)

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
Nodes (30): getProof(), updateAvatarIfCurrent(), updateAvatar(), uploadCover(), getProof(), baseFolder(), crypto, driver() (+22 more)

### Community 26 - "authRepository.js"
Cohesion: 0.16
Nodes (17): changePassword(), logout(), resetPassword(), ACCOUNT_SAFE_SELECT, consumeOtp(), createRefreshToken(), findById(), findLatestValidOtp() (+9 more)

### Community 27 - "Button"
Cohesion: 0.18
Nodes (16): adminApi, Button(), SIZES, VARIANTS, StatusBadge(), TONES, AdminList(), PermissionEditor() (+8 more)

### Community 28 - "invoiceRepository.js"
Cohesion: 0.19
Nodes (21): countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findStudentIdByAccountId(), invoiceInclude, lockStudent(), studentSelect (+13 more)

### Community 29 - "roles.js"
Cohesion: 0.28
Nodes (10): accountApi, ROLES, ACCEPTED_TYPES, AvatarUploader(), ProfileForm(), toFormValues(), toNull(), toPayload() (+2 more)

### Community 30 - "File Upload Middleware"
Cohesion: 0.13
Nodes (19): buildUploader(), DOC_MIMES, hasValidSignature(), IMAGE_MIMES, multer, SIGNATURES, adminNeedsPermission(), canHandlePayment (+11 more)

### Community 31 - "PaymentPage.jsx"
Cohesion: 0.12
Nodes (23): invoiceApi, NoteDialog(), NoteForm(), ProofImage(), fadeIn, scaleIn, useProofImage(), Body() (+15 more)

### Community 32 - "Administrator Management"
Cohesion: 0.10
Nodes (34): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), administratorInclude (+26 more)

### Community 33 - "teacherService.js"
Cohesion: 0.14
Nodes (21): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+13 more)

### Community 34 - "CourseExamTable.jsx"
Cohesion: 0.25
Nodes (16): ACTION_DANGER, ACTION_LINK, ACTIONS, TABLE, TBODY, TD, TD_ACTION, TH (+8 more)

### Community 35 - "database.js"
Cohesion: 0.13
Nodes (18): buildDatasourceUrl(), client, { PrismaClient }, PUBLIC_ACCOUNT_FIELDS, PUBLIC_MODELS, setParam(), WRITE_OPERATIONS, call() (+10 more)

### Community 36 - "invoiceController.js"
Cohesion: 0.18
Nodes (16): approve(), approveRefund(), completeRefund(), getById(), listAll(), listMine(), listMyRefundRequests(), listRefundRequests() (+8 more)

### Community 37 - "scripts.test.js"
Cohesion: 0.09
Nodes (29): cleanup(), CLOUD_KINDS, FIELDS, fs, isStillReferenced(), listCloudinary(), loadReferences(), path (+21 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.14
Nodes (35): findExamBasic(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), db(), findAttemptById(), findExamForStart() (+27 more)

### Community 40 - "BE_RStudy/package.json"
Cohesion: 0.11
Nodes (18): author, ioredis@^6.1.0, jsonwebtoken@^9.0.3, multer@^2.4.0, npm@^11.21.1, description, devDependencies, nodemon@^3.1.14 (+10 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.11
Nodes (19): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+11 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "invoiceService.js"
Cohesion: 0.22
Nodes (18): findInvoices(), findSupportRequestById(), findSupportRequests(), updateSupportIfStatus(), approveRefund(), completeRefund(), INVOICE_STATUSES, listAll() (+10 more)

### Community 44 - "signAccessToken"
Cohesion: 0.22
Nodes (12): sha256(), jwt, signRefreshToken(), bcrypt, call(), check(), countBy(), fs (+4 more)

### Community 45 - "reportService.js"
Cohesion: 0.17
Nodes (18): create(), findAndCount(), findById(), findOpenDuplicate(), findTarget(), include, OPEN_STATUSES, resolveViolation() (+10 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "motion.js"
Cohesion: 0.08
Nodes (50): CourseCard(), CourseGrid(), Reveal(), RevealGroup(), RoadPath(), SHAPES, ScrollProgress(), SectionHeader() (+42 more)

### Community 48 - "steps"
Cohesion: 0.08
Nodes (30): defaults, env, runs-on, steps, run, DATABASE_URL, DIRECT_URL, VITE_API_URL (+22 more)

### Community 49 - "useAuth"
Cohesion: 0.13
Nodes (25): Header(), MainNav(), NotificationBell(), SHAKE, NotificationItem(), SearchBox(), getMenuItems(), UserMenu() (+17 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "examService.js"
Cohesion: 0.10
Nodes (40): CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion(), findCourseById(), findExamById() (+32 more)

### Community 52 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt@^6.0.0, cloudinary@^2.11.0, cors@^2.8.6, express@^5.2.1, express-rate-limit@^8.7.5, helmet@^8.3.0, morgan@^1.12.1 (+14 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.21
Nodes (13): express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema (+5 more)

### Community 54 - "sendOtp"
Cohesion: 0.18
Nodes (9): crypto, createOtp(), findLatestOtp(), sendOtp(), bcrypt, compareOtp(), crypto, generateOtpCode() (+1 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.25
Nodes (8): answerSchema, answersField, saveAnswersSchema, startSchema, strictObject(), submitSchema, unknownKeysError(), { z }

### Community 57 - "resourceService.js"
Cohesion: 0.22
Nodes (13): findById(), create(), findAndCount(), findById(), findTeacherByAccountId(), include, remove(), { CategoryStatus } (+5 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.09
Nodes (39): submissionApi, LoadingState(), ProtectedRoute(), ExamTakePage(), ForbiddenPage(), AccountsPage, AdminCategoriesPage, AdminCouponsPage (+31 more)

### Community 59 - "backend"
Cohesion: 0.06
Nodes (33): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+25 more)

### Community 60 - "DashboardPanel"
Cohesion: 0.13
Nodes (35): ConfirmDialog(), DashboardPanel(), getPages(), Pagination(), ROLE_LABELS, STATUS_MAPS, AccountsFilterBar(), AccountsTable() (+27 more)

### Community 61 - "common/ErrorState.jsx"
Cohesion: 0.09
Nodes (33): courseApi, examApi, Card(), COURSE_GRID_CLASS, CourseCardSkeleton(), CourseSelect(), EmptyState(), ErrorState() (+25 more)

### Community 62 - "FormAlert"
Cohesion: 0.21
Nodes (10): ReportForm(), schema, FormAlert(), CreateAdminDialog(), CreateAdminForm(), DEFAULT_VALUES, ReportActionDialog(), ReportActionForm() (+2 more)

### Community 63 - "CouponForm.jsx"
Cohesion: 0.32
Nodes (9): CouponDialog(), CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso() (+1 more)

### Community 64 - "Public Course Tests"
Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"
Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "react-router-dom"
Cohesion: 0.12
Nodes (19): BackButton(), CourseCover(), getNavItems(), MY_COURSES_ITEM, NAV_ITEMS, SOCIAL_ICONS, Switch(), tabIndicator (+11 more)

### Community 67 - "reportRoutes.js"
Cohesion: 0.13
Nodes (15): authCredentialLimiter, authIpLimiter, buildLimiter(), contentWriteLimiter, { rateLimit, ipKeyGenerator }, adminOnly, router, { MemoryStore } (+7 more)

### Community 68 - "reviewController.js"
Cohesion: 0.36
Nodes (9): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+1 more)

### Community 69 - "enrollment.test.js"
Cohesion: 0.33
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "CategoryForm.jsx"
Cohesion: 0.53
Nodes (4): CategoryDialog(), CategoryForm(), schema, toBody()

### Community 72 - "Account Deletion Script"
Cohesion: 0.23
Nodes (10): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS, { Prisma } (+2 more)

### Community 73 - "exam.test.js"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "TextField"
Cohesion: 0.17
Nodes (19): FormField(), inputClass(), PasswordInput, TextField, LoginPage(), GENDER_OPTIONS, StudentFields(), useCategories() (+11 more)

### Community 75 - "axiosClient.js"
Cohesion: 0.09
Nodes (22): AUTH_LOGOUT_EVENT, axiosClient, NO_REFRESH_URLS, couponApi, enrollmentApi, notificationApi, recommendationApi, App() (+14 more)

### Community 76 - "cloudinary.integration.test.js"
Cohesion: 0.29
Nodes (11): bodies, call(), check(), DOCX_MIN, formOf(), httpStatus(), main(), PDF_MIN (+3 more)

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
Cohesion: 0.20
Nodes (11): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), router, adminNeedsPermission(), checkAdminPermission, router (+3 more)

### Community 90 - "ExamRoom.jsx"
Cohesion: 0.35
Nodes (7): secondsLeft(), useCountdown(), ExamRoom(), toList(), QuestionCard(), pad(), SidePanel()

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

### Community 96 - "swagger.test.js"
Cohesion: 0.38
Nodes (10): buildOpenApi(), listRoutes(), parseSpec(), routeKey(), check(), main(), path, sleep() (+2 more)

### Community 97 - "ref_zod"
Cohesion: 0.09
Nodes (15): router, writers, sendMessageSchema, { z }, content, contentBodySchema, courseIdParamSchema, idParamSchema (+7 more)

### Community 98 - "format.js"
Cohesion: 0.16
Nodes (17): AdminCoursesPage(), TABS, CouponTable(), discountText(), AdminCourseActions(), CONFIRMS, runAction(), STEPS (+9 more)

### Community 99 - "profileSchemas.js"
Cohesion: 0.29
Nodes (5): baseShape, changePasswordSchema, GENDERS, studentSchema, teacherSchema

### Community 100 - "cancelRegistrationTx"
Cohesion: 0.67
Nodes (3): cancelRegistrationRecords(), releaseCoupon(), cancelRegistrationTx()

### Community 101 - "couponRoutes.js"
Cohesion: 0.29
Nodes (7): router, base, changeStatusSchema, createCouponSchema, updateCouponSchema, validateCouponSchema, { z }

### Community 102 - "hardening.p2.test.js"
Cohesion: 0.29
Nodes (9): AVATAR_DIR, avatarForm(), BASE, call(), check(), countBy(), fs, main() (+1 more)

### Community 103 - "accountRepository.js"
Cohesion: 0.32
Nodes (6): findByIdSafe(), LIST_SELECT, revokeAllRefreshTokens(), SAFE_SELECT, updateStatus(), changeStatus()

### Community 105 - "prisma"
Cohesion: 0.11
Nodes (27): prisma, signAccessToken(), call(), check(), main(), call(), check(), codes() (+19 more)

### Community 106 - "commentController.js"
Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 107 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 110 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.3, prisma@^6.19.3, dotenv, prisma

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `Review Repository` to `app.js`, `recommendationService.js`, `enrollmentService.js`, `formatResponse`, `authService.js`, `Course Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `accountService.js`, `notificationService.js`, `storage.js`, `authRepository.js`, `invoiceRepository.js`, `File Upload Middleware`, `Administrator Management`, `teacherService.js`, `database.js`, `invoiceController.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `invoiceService.js`, `reportService.js`, `examService.js`, `sendOtp`, `resourceService.js`, `reviewController.js`, `resourceRoutes.js`, `authController.js`, `cancelRegistrationTx`, `accountRepository.js`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0858843537414966 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FE_RStudy/package.json`, `useFetch`, `ChatPanel.jsx`, `Layout.jsx`, `FormAlert`, `SessionDialog.jsx`, `UploadForm.jsx`, `Button`, `roles.js`, `PaymentPage.jsx`, `CourseExamTable.jsx`, `motion.js`, `useAuth`, `AppRoutes.jsx`, `DashboardPanel`, `common/ErrorState.jsx`, `FormAlert`, `CouponForm.jsx`, `react-router-dom`, `CategoryForm.jsx`, `TextField`, `axiosClient.js`, `ExamRoom.jsx`, `ExamForm.jsx`, `format.js`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `Account Deletion Script` to `database.js`, `enrollmentService.js`, `Exam Submission Grading`, `BE_RStudy/package.json`, `Course Routes & Validation`, `invoiceService.js`, `reportService.js`, `Course Repository`, `Review Repository`, `Comment Repository`, `examService.js`, `dependencies`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `resourceService.js`, `hash.js`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._
- **Should `recommendationService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07337526205450734 - nodes in this community are weakly interconnected._