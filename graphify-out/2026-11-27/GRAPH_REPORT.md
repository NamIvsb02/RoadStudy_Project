# Graph Report - RoadStudy  (2026-11-27)

## Corpus Check
- 444 files · ~201,346 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: (none) 15, .example 2, .css 2)

## Summary
- 2396 nodes · 7250 edges · 116 communities (99 shown, 17 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 439 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec082779`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- authMiddleware.js
- Initial Database Migration
- permissionMiddleware.js
- FE_RStudy/package.json
- recommendationService.js
- cache.js
- invoiceService.js
- formatResponse
- useFetch
- courseController.js
- ChatPanel.jsx
- Button.jsx
- openapi.js
- courseService.js
- courseRepository.js
- Review Repository
- commentRoutes.js
- Comment Repository
- FormAlert
- SessionDialog.jsx
- ResourceBrowser.jsx
- Coupon Repository
- Category Controller & Repository
- accountService.js
- notificationService.js
- storage.js
- authService.js
- PermissionsPage.jsx
- cleanup-orphan-files.js
- ProfileForm.jsx
- invoiceRoutes.js
- PaymentPage.jsx
- Administrator Management
- teacherService.js
- CourseExamTable.jsx
- database.js
- changeStatusByAdmin
- scripts.test.js
- Learning Sessions Backend
- Exam Submission Grading
- BE_RStudy/package.json
- Course Routes & Validation
- Exam Routes & Validation
- deleteAccount.js
- getMyList
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
- uploadMiddleware.js
- Public Course Tests
- Course Tests
- react
- CreateAdminForm.jsx
- reviewController.js
- morgan
- Review Tests
- nodemailer
- dashboardConfig.js
- exam.test.js
- TextField
- axiosClient.js
- swagger-ui-express
- Test Auth Helpers
- package.json
- permissions
- ExamRoom.jsx
- signAccessToken
- TextField
- hash.js
- comment.test.js
- authController.js
- jwt.js
- format.js
- main
- ratelimit.redis.test.js
- redis.test.js
- hardening.p2.test.js
- accountRepository.js
- cloudinary.integration.test.js
- invoice.test.js
- scripts
- enrollment.test.js
- dotenv
- prisma
- App.jsx
- recommendationRepository.js
- cloudinary
- cors
- rateLimitMiddleware.js
- helmet
- ioredis
- pg@^8.23.1

## God Nodes (most connected - your core abstractions)
1. `AppError` - 169 edges
2. `formatResponse()` - 131 edges
3. `react` - 117 edges
4. `useFetch()` - 81 edges
5. `react-router-dom` - 76 edges
6. `Button()` - 70 edges
7. `useAuth()` - 67 edges
8. `ROUTES` - 63 edges
9. `AppRoutes()` - 53 edges
10. `lucide-react` - 53 edges

## Surprising Connections (you probably didn't know these)
- `listAccounts()` --calls--> `list()`  [EXTRACTED]
  BE_RStudy/src/services/accountService.js → BE_RStudy/src/repositories/accountRepository.js
- `getExistingOrThrow()` --calls--> `findById()`  [EXTRACTED]
  BE_RStudy/src/services/resourceService.js → BE_RStudy/src/repositories/resourceRepository.js
- `remove()` --calls--> `remove()`  [EXTRACTED]
  BE_RStudy/src/services/resourceService.js → BE_RStudy/src/repositories/resourceRepository.js
- `handle()` --calls--> `formatResponse()`  [EXTRACTED]
  BE_RStudy/src/controllers/notificationController.js → BE_RStudy/src/utils/response.js
- `SearchBox()` --calls--> `SearchSuggestions()`  [EXTRACTED]
  FE_RStudy/src/components/common/SearchBox.jsx → FE_RStudy/src/components/common/SearchSuggestions.jsx

## Import Cycles
- None detected.

## Communities (116 total, 17 thin omitted)

### Community 0 - "authMiddleware.js"
Cohesion: 0.08
Nodes (26): app, cors, corsOrigins, express, helmet, morgan, path, server (+18 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.05
Nodes (68): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+60 more)

### Community 2 - "permissionMiddleware.js"
Cohesion: 0.19
Nodes (11): loadAdmin(), requireAdmin(), requireLeader(), router, router, base, changeStatusSchema, createCouponSchema (+3 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-dom@^19.2.8 (+42 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.18
Nodes (19): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+11 more)

### Community 5 - "cache.js"
Cohesion: 0.17
Nodes (17): shutdown(), checkHealth(), close(), isEnabled(), key(), Redis, url, bump() (+9 more)

### Community 6 - "invoiceService.js"
Cohesion: 0.05
Nodes (81): hasSmtpConfig, nodemailer, sendMail(), cancel(), create(), getMine(), approve(), approveRefund() (+73 more)

### Community 7 - "formatResponse"
Cohesion: 0.09
Nodes (49): changeStatus(), list(), updateAvatar(), changeStatus(), create(), getAdminById(), getAdminList(), getPublicById() (+41 more)

### Community 8 - "useFetch"
Cohesion: 0.19
Nodes (19): submissionApi, ResultBadge(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween(), formatDuration(), formatScore() (+11 more)

### Community 9 - "courseController.js"
Cohesion: 0.19
Nodes (12): approve(), create(), getPublicList(), parseListQuery(), pickCourseFields(), reject(), update(), uploadCover() (+4 more)

### Community 10 - "ChatPanel.jsx"
Cohesion: 0.22
Nodes (12): ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, TypingIndicator(), ChatWidget(), GuestPrompt(), chatPanel (+4 more)

### Community 11 - "Button.jsx"
Cohesion: 0.17
Nodes (13): schema, StarRating(), STARS, SIZES, VARIANTS, FieldError(), MyReviewBox(), ReviewForm() (+5 more)

### Community 12 - "openapi.js"
Cohesion: 0.15
Nodes (23): buildOpenApi(), buildOperation(), ERROR_TEXT, fs, inspect(), LIMITERS, listRoutes(), METHODS (+15 more)

### Community 13 - "courseService.js"
Cohesion: 0.24
Nodes (11): getPublicById(), findPublicById(), getRatingStats(), ADMIN_TRANSITIONS, attachRating(), { CourseStatus, CategoryStatus, ApprovalStatus, Prisma }, getPublicById(), getPublicList() (+3 more)

### Community 14 - "courseRepository.js"
Cohesion: 0.14
Nodes (18): getMyById(), buildPublicWhere(), countActiveRegistrations(), courseInclude, create(), findOwnById(), findPublicAndCount(), findTeacherByAccountId() (+10 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "commentRoutes.js"
Cohesion: 0.25
Nodes (8): router, writers, content, contentBodySchema, courseIdParamSchema, idParamSchema, replyIdParamSchema, { z }

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "FormAlert"
Cohesion: 0.15
Nodes (24): authApi, AuthShell(), BENEFITS, stepSlide, useToast(), commonShape, forgotPasswordSchema, GENDERS (+16 more)

### Community 19 - "SessionDialog.jsx"
Cohesion: 0.13
Nodes (18): learningApi, dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter, toInputValue() (+10 more)

### Community 20 - "ResourceBrowser.jsx"
Cohesion: 0.50
Nodes (4): resourceApi, ResourceBrowser(), ResourceListPage(), TeacherResourcesPage()

### Community 21 - "Coupon Repository"
Cohesion: 0.08
Nodes (41): changeStatus(), create(), getById(), remove(), update(), validate(), countInvoices(), countStudentUsage() (+33 more)

### Community 22 - "Category Controller & Repository"
Cohesion: 0.18
Nodes (20): buildWhere(), countRelations(), create(), findAndCount(), findByName(), remove(), update(), assertNameAvailable() (+12 more)

### Community 23 - "accountService.js"
Cohesion: 0.22
Nodes (9): updateProfile(), updateProfile(), COMMON_FIELDS, pick(), ROLES, STATUSES, STUDENT_FIELDS, TEACHER_FIELDS (+1 more)

### Community 24 - "notificationService.js"
Cohesion: 0.12
Nodes (29): handle(), list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany() (+21 more)

### Community 25 - "storage.js"
Cohesion: 0.14
Nodes (25): baseFolder(), crypto, driver(), EXTENSIONS, fs, getCloudinary(), isUrl(), ownCloudinaryAsset() (+17 more)

### Community 26 - "authService.js"
Cohesion: 0.10
Nodes (35): changePassword(), login(), logout(), me(), refresh(), resetPassword(), verifyEmail(), ACCOUNT_SAFE_SELECT (+27 more)

### Community 27 - "PermissionsPage.jsx"
Cohesion: 0.32
Nodes (7): adminApi, AdminList(), CreateAdminDialog(), PermissionEditor(), fetchAdmins(), fetchFunctions(), PermissionsPage()

### Community 28 - "cleanup-orphan-files.js"
Cohesion: 0.29
Nodes (9): cleanup(), CLOUD_KINDS, FIELDS, fs, isStillReferenced(), listCloudinary(), loadReferences(), path (+1 more)

### Community 29 - "ProfileForm.jsx"
Cohesion: 0.16
Nodes (15): StudentFields(), TeacherFields(), AvatarUploader(), ChangePasswordForm(), ProfileForm(), toFormValues(), toNull(), toPayload() (+7 more)

### Community 30 - "invoiceRoutes.js"
Cohesion: 0.07
Nodes (38): PERMISSIONS, authorize(), requirePermission(), contentWriteLimiter, validate(), express, manageAccounts, adminNeedsPermission() (+30 more)

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
Cohesion: 0.17
Nodes (24): TONES, STATUS_MAPS, TABS, AdminCourseActions(), CONFIRMS, runAction(), STEPS, ACTION_DANGER (+16 more)

### Community 35 - "database.js"
Cohesion: 0.14
Nodes (17): buildDatasourceUrl(), client, { PrismaClient }, PUBLIC_ACCOUNT_FIELDS, PUBLIC_MODELS, setParam(), WRITE_OPERATIONS, { Prisma } (+9 more)

### Community 36 - "changeStatusByAdmin"
Cohesion: 0.27
Nodes (10): changeStatus(), getAdminById(), submit(), findById(), findById(), transition(), assertCategoryUsable(), changeStatusByAdmin() (+2 more)

### Community 37 - "scripts.test.js"
Cohesion: 0.12
Nodes (20): fs, migrate(), path, TARGETS, asset(), check(), cloudStorage, fakeCloudinary() (+12 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.14
Nodes (25): createSession(), get(), removeSession(), update(), updateSession(), createSession(), deleteSession(), findCourse() (+17 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.14
Nodes (36): start(), findTeacherByAccountId(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), db(), findAttemptById() (+28 more)

### Community 40 - "BE_RStudy/package.json"
Cohesion: 0.18
Nodes (11): author, description, devDependencies, nodemon@^3.1.14, keywords, license, main, name (+3 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.12
Nodes (18): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+10 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "deleteAccount.js"
Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 44 - "getMyList"
Cohesion: 0.33
Nodes (7): getAdminList(), getMyList(), buildWhere(), findAndCount(), buildPagination(), getAdminList(), getMyList()

### Community 45 - "reportService.js"
Cohesion: 0.12
Nodes (28): create(), create(), findAndCount(), findById(), findOpenDuplicate(), findTarget(), include, OPEN_STATUSES (+20 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "motion.js"
Cohesion: 0.06
Nodes (58): Reveal(), RevealGroup(), SHAPES, ScrollProgress(), SectionHeader(), UPCOMING_EXAMS, FAQ_ITEMS, accordion (+50 more)

### Community 48 - "steps"
Cohesion: 0.08
Nodes (30): defaults, env, runs-on, steps, run, DATABASE_URL, DIRECT_URL, VITE_API_URL (+22 more)

### Community 49 - "react-router-dom"
Cohesion: 0.13
Nodes (22): AuthLayout(), BottomNav(), Footer(), Header(), MainNav(), getNavItems(), MY_COURSES_ITEM, NAV_ITEMS (+14 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.19
Nodes (12): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, ratingValue, responseBodySchema (+4 more)

### Community 51 - "examService.js"
Cohesion: 0.07
Nodes (47): addQuestion(), changeStatus(), create(), getById(), remove(), removeQuestion(), update(), updateQuestion() (+39 more)

### Community 52 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, express@^5.2.1, express-rate-limit@^8.7.5, jsonwebtoken@^9.0.3, multer@^2.4.0, npm@^11.21.1, @prisma/client@^6.19.3, zod@^4.6.7 (+4 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.21
Nodes (13): express, router, changePasswordSchema, forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resendOtpSchema (+5 more)

### Community 54 - "sendOtp"
Cohesion: 0.20
Nodes (7): bcrypt@^6.0.0, crypto, bcrypt, compareOtp(), crypto, generateOtpCode(), bcrypt

### Community 55 - "Category Routes & Validation"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "AppError"
Cohesion: 0.19
Nodes (19): countRecentStudentMessages(), createAiMessage(), createConversation(), createStudentMessage(), db(), findConversationById(), findConversations(), findMessages() (+11 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.09
Nodes (39): LoadingState(), ExamLayout(), ProtectedRoute(), ExamTakePage(), ForbiddenPage(), AccountsPage, AdminCategoriesPage, AdminCouponsPage (+31 more)

### Community 59 - "backend"
Cohesion: 0.06
Nodes (33): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+25 more)

### Community 60 - "DashboardPanel"
Cohesion: 0.16
Nodes (27): ConfirmDialog(), DashboardPanel(), getPages(), Pagination(), AccountsFilterBar(), AccountsPage(), toParams(), AdminCategoriesPage() (+19 more)

### Community 61 - "useFetch"
Cohesion: 0.08
Nodes (42): courseApi, enrollmentApi, examApi, BackButton(), Card(), COURSE_GRID_CLASS, CourseCardSkeleton(), CourseSelect() (+34 more)

### Community 62 - "Button"
Cohesion: 0.20
Nodes (17): NoteDialog(), NoteForm(), ReportDialog(), ReportForm(), schema, Button(), FormAlert(), fadeIn (+9 more)

### Community 63 - "uploadMiddleware.js"
Cohesion: 0.38
Nodes (6): buildUploader(), DOC_MIMES, hasValidSignature(), IMAGE_MIMES, multer, SIGNATURES

### Community 64 - "Public Course Tests"
Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"
Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "react"
Cohesion: 0.09
Nodes (40): commentApi, reviewApi, ContentForm(), InlineConfirmDelete(), NotificationBell(), SHAKE, ReportButton(), REPORTERS (+32 more)

### Community 67 - "CreateAdminForm.jsx"
Cohesion: 0.43
Nodes (4): CreateAdminForm(), DEFAULT_VALUES, createAdminSchema, CommonRegisterFields()

### Community 68 - "reviewController.js"
Cohesion: 0.31
Nodes (10): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+2 more)

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 72 - "dashboardConfig.js"
Cohesion: 0.15
Nodes (17): accountApi, reportApi, teacherApi, StatCard(), PERMISSIONS, AdminDashboardPage(), CountCard(), fetchPendingPayments() (+9 more)

### Community 73 - "exam.test.js"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "TextField"
Cohesion: 0.16
Nodes (18): FormField(), inputClass(), PasswordInput, GENDER_OPTIONS, useCategories(), CourseForm(), courseSchema, EMPTY_COURSE (+10 more)

### Community 75 - "axiosClient.js"
Cohesion: 0.15
Nodes (10): AUTH_LOGOUT_EVENT, axiosClient, NO_REFRESH_URLS, categoryApi, chatbotApi, couponApi, notificationApi, recommendationApi (+2 more)

### Community 77 - "Test Auth Helpers"
Cohesion: 0.48
Nodes (6): asToken(), authHeaders(), buildCandidates(), cache, makeToken(), verifies()

### Community 78 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, prettier@^3.10.1, prettier

### Community 79 - "permissions"
Cohesion: 0.22
Nodes (8): hooks, PreToolUse, SessionStart, permissions, allow, ask, deny, $schema

### Community 90 - "ExamRoom.jsx"
Cohesion: 0.35
Nodes (7): secondsLeft(), useCountdown(), ExamRoom(), toList(), QuestionCard(), pad(), SidePanel()

### Community 91 - "signAccessToken"
Cohesion: 0.22
Nodes (14): jwt, signAccessToken(), call(), callBoth(), check(), expectAllowed(), expectBlocked(), main() (+6 more)

### Community 92 - "TextField"
Cohesion: 0.15
Nodes (19): TextField, CouponDialog(), CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues() (+11 more)

### Community 93 - "hash.js"
Cohesion: 0.18
Nodes (12): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+4 more)

### Community 94 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 95 - "authController.js"
Cohesion: 0.18
Nodes (14): forgotPassword(), register(), resendOtp(), createOtp(), createStudentAccount(), createTeacherAccount(), findByEmail(), findLatestOtp() (+6 more)

### Community 97 - "jwt.js"
Cohesion: 0.26
Nodes (11): sha256(), signRefreshToken(), bcrypt, call(), check(), countBy(), fs, main() (+3 more)

### Community 98 - "format.js"
Cohesion: 0.09
Nodes (35): ChatCourseCard(), MessageBubble(), CourseCard(), CourseCover(), CourseGrid(), NotificationItem(), SearchSuggestions(), StatusRow() (+27 more)

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

### Community 103 - "accountRepository.js"
Cohesion: 0.24
Nodes (9): findByIdSafe(), list(), LIST_SELECT, revokeAllRefreshTokens(), SAFE_SELECT, updateAvatarIfCurrent(), updateStatus(), changeStatus() (+1 more)

### Community 104 - "cloudinary.integration.test.js"
Cohesion: 0.29
Nodes (11): bodies, call(), check(), DOCX_MIN, formOf(), httpStatus(), main(), PDF_MIN (+3 more)

### Community 105 - "invoice.test.js"
Cohesion: 0.25
Nodes (10): call(), check(), crypto, fs, main(), path, png, pngForm() (+2 more)

### Community 107 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 108 - "enrollment.test.js"
Cohesion: 0.33
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 110 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.3, prisma@^6.19.3, dotenv, prisma

### Community 111 - "prisma"
Cohesion: 0.21
Nodes (10): prisma, findAndCount(), findById(), include, remove(), getList(), call(), check() (+2 more)

### Community 112 - "App.jsx"
Cohesion: 0.26
Nodes (8): App(), Toast(), TYPES, slideInRight, AuthProvider(), fetchAccount(), ToastProvider(), ToastContext

### Community 114 - "recommendationRepository.js"
Cohesion: 0.20
Nodes (14): getMine(), courseSelect, findCandidates(), findOpenCourses(), findOpenForStudent(), findStudentCourseLinks(), findStudentIdByAccountId(), openWhere() (+6 more)

### Community 118 - "rateLimitMiddleware.js"
Cohesion: 0.18
Nodes (8): isReady(), authCredentialLimiter, authIpLimiter, buildLimiter(), { rateLimit, ipKeyGenerator }, { MemoryStore }, RedisFallbackStore, express-rate-limit

## Knowledge Gaps
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `reportService.js` to `authMiddleware.js`, `permissionMiddleware.js`, `recommendationService.js`, `invoiceService.js`, `formatResponse`, `courseController.js`, `courseService.js`, `courseRepository.js`, `Review Repository`, `Comment Repository`, `Coupon Repository`, `Category Controller & Repository`, `accountService.js`, `notificationService.js`, `storage.js`, `authService.js`, `invoiceRoutes.js`, `Administrator Management`, `teacherService.js`, `database.js`, `changeStatusByAdmin`, `Learning Sessions Backend`, `Exam Submission Grading`, `getMyList`, `examService.js`, `AppError`, `uploadMiddleware.js`, `reviewController.js`, `authController.js`, `accountRepository.js`, `recommendationRepository.js`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Should `authMiddleware.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07957957957957958 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FE_RStudy/package.json`, `useFetch`, `ChatPanel.jsx`, `Button.jsx`, `FormAlert`, `SessionDialog.jsx`, `ResourceBrowser.jsx`, `PermissionsPage.jsx`, `ProfileForm.jsx`, `PaymentPage.jsx`, `CourseExamTable.jsx`, `motion.js`, `react-router-dom`, `AppRoutes.jsx`, `DashboardPanel`, `useFetch`, `Button`, `CreateAdminForm.jsx`, `TextField`, `axiosClient.js`, `ExamRoom.jsx`, `TextField`, `format.js`, `App.jsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `database.js` to `invoiceService.js`, `Exam Submission Grading`, `BE_RStudy/package.json`, `Course Routes & Validation`, `deleteAccount.js`, `courseService.js`, `reportService.js`, `Review Repository`, `Comment Repository`, `examService.js`, `dependencies`, `Coupon Repository`, `Category Controller & Repository`, `Category Routes & Validation`, `hash.js`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._
- **Should `invoiceService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05034199726402189 - nodes in this community are weakly interconnected._