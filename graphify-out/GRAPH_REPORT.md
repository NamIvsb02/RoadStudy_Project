# Graph Report - RoadStudy  (2026-11-27)

## Corpus Check
- 441 files · ~200,122 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: (none) 16, .example 2, .css 2)

## Summary
- 2391 nodes · 7073 edges · 113 communities (105 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 439 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89acb06c`
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
- courseService.js
- ChatPanel.jsx
- @prisma/client
- openapi.js
- examService.js
- courseRepository.js
- Review Repository
- commentRoutes.js
- Comment Repository
- Button
- sessionFormat.js
- app.js
- couponRepository.js
- Category Controller & Repository
- AppError
- notificationService.js
- storage.js
- authService.js
- StatusBadge
- DashboardPanel
- ProfileForm.jsx
- ref_zod
- PaymentPage.jsx
- Administrator Management
- teacherService.js
- CourseExamTable.jsx
- database.js
- ForYouSection.jsx
- scripts.test.js
- Learning Sessions Backend
- Exam Submission Grading
- TeacherShowcase.jsx
- Course Routes & Validation
- Exam Routes & Validation
- deleteAccount.js
- getPagination
- reportService.js
- Learning Routes & Validation
- motion.js
- steps
- useAuth
- Review Routes & Validation
- examRepository.js
- BE_RStudy/package.json
- Auth Routes & Validation
- couponService.js
- Category Routes & Validation
- Submission Routes & Validation
- adminValidator.js
- AppRoutes.jsx
- backend
- useFetch.js
- useFetch
- dependencies
- AppError.js
- Public Course Tests
- Course Tests
- react
- ExamForm.jsx
- reviewController.js
- swagger.test.js
- Review Tests
- HomePage.jsx
- dashboardConfig.js
- exam.test.js
- CourseEditPage.jsx
- axiosClient.js
- reportRepository.js
- Test Auth Helpers
- package.json
- permissions
- commentController.js
- reportRoutes.js
- storage.test.js
- ExamRoom.jsx
- account.test.js
- CouponForm.jsx
- hash.js
- comment.test.js
- authService.js
- ExamCountdown.jsx
- jwt.js
- format.js
- @tanstack/react-query
- vite.config.js
- redis.test.js
- hardening.p2.test.js
- accountService.js
- cloudinary.integration.test.js
- invoice.test.js
- coupon.test.js
- scripts
- enrollment.test.js
- scripts
- dotenv
- listManage
- framer-motion

## God Nodes (most connected - your core abstractions)
1. `AppError` - 159 edges
2. `formatResponse()` - 131 edges
3. `react` - 117 edges
4. `useFetch()` - 81 edges
5. `react-router-dom` - 75 edges
6. `Button()` - 70 edges
7. `useAuth()` - 67 edges
8. `ROUTES` - 62 edges
9. `AppRoutes()` - 53 edges
10. `lucide-react` - 52 edges

## Surprising Connections (you probably didn't know these)
- `listByCourse()` --calls--> `findManyByCourse()`  [EXTRACTED]
  BE_RStudy/src/services/examService.js → BE_RStudy/src/repositories/examRepository.js
- `loadExam()` --calls--> `findExamById()`  [EXTRACTED]
  BE_RStudy/src/services/examService.js → BE_RStudy/src/repositories/examRepository.js
- `create()` --calls--> `createExam()`  [EXTRACTED]
  BE_RStudy/src/services/examService.js → BE_RStudy/src/repositories/examRepository.js
- `remove()` --calls--> `deleteExam()`  [EXTRACTED]
  BE_RStudy/src/services/examService.js → BE_RStudy/src/repositories/examRepository.js
- `list()` --calls--> `list()`  [EXTRACTED]
  BE_RStudy/src/controllers/couponController.js → BE_RStudy/src/services/couponService.js

## Import Cycles
- None detected.

## Communities (113 total, 8 thin omitted)

### Community 0 - "authMiddleware.js"
Cohesion: 0.16
Nodes (12): authenticate(), authorize(), optionalAuthenticate(), readToken(), router, router, router, verifyAccessToken() (+4 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.05
Nodes (68): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+60 more)

### Community 2 - "permissionMiddleware.js"
Cohesion: 0.19
Nodes (12): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), router, router, base, changeStatusSchema (+4 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.15
Nodes (19): devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18, @types/react-dom@^19.2.7 (+11 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.07
Nodes (47): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+39 more)

### Community 5 - "cache.js"
Cohesion: 0.07
Nodes (45): checkHealth(), isEnabled(), isReady(), key(), Redis, url, buildLimiter(), bump() (+37 more)

### Community 6 - "invoiceService.js"
Cohesion: 0.11
Nodes (44): hasSmtpConfig, nodemailer, sendMail(), countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findInvoices() (+36 more)

### Community 7 - "formatResponse"
Cohesion: 0.08
Nodes (50): getConversation(), listConversations(), sendMessage(), changeStatus(), create(), getById(), list(), remove() (+42 more)

### Community 8 - "useFetch"
Cohesion: 0.21
Nodes (18): examApi, ResultBadge(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween(), formatDuration(), formatScore() (+10 more)

### Community 9 - "courseService.js"
Cohesion: 0.10
Nodes (38): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+30 more)

### Community 10 - "ChatPanel.jsx"
Cohesion: 0.22
Nodes (11): chatbotApi, ChatHistory(), ChatInput(), ChatPanel(), SUGGESTIONS, TypingIndicator(), MessageBubble(), typingDot() (+3 more)

### Community 11 - "@prisma/client"
Cohesion: 0.13
Nodes (27): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+19 more)

### Community 12 - "openapi.js"
Cohesion: 0.16
Nodes (14): version, buildOperation(), ERROR_TEXT, fs, inspect(), LIMITERS, METHODS, moduleOrder() (+6 more)

### Community 13 - "examService.js"
Cohesion: 0.21
Nodes (20): countAttemptsByExams(), findCourseById(), findStudentIdByAccountId(), hasConfirmedRegistration(), updateExam(), assertCanManageCourse(), assertStudentCanAccess(), BOTH (+12 more)

### Community 14 - "courseRepository.js"
Cohesion: 0.12
Nodes (9): buildPublicWhere(), buildWhere(), courseInclude, findAndCount(), findPublicAndCount(), PUBLIC_SORTS, publicBaseWhere, publicDetailSelect (+1 more)

### Community 15 - "Review Repository"
Cohesion: 0.09
Nodes (7): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, responderSelect, responseSelect, reviewerSelect, reviewSelect

### Community 16 - "commentRoutes.js"
Cohesion: 0.25
Nodes (8): router, writers, content, contentBodySchema, courseIdParamSchema, idParamSchema, replyIdParamSchema, { z }

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "Button"
Cohesion: 0.06
Nodes (72): authApi, AuthShell(), BENEFITS, NoteDialog(), NoteForm(), ReportDialog(), ReportForm(), schema (+64 more)

### Community 19 - "sessionFormat.js"
Cohesion: 0.25
Nodes (8): dayFormatter, formatSessionTime(), inputFormatter, sessionState(), timeFormatter, BADGES, DOTS, SessionList()

### Community 20 - "app.js"
Cohesion: 0.13
Nodes (14): app, cors, corsOrigins, express, helmet, morgan, path, server (+6 more)

### Community 21 - "couponRepository.js"
Cohesion: 0.18
Nodes (7): countStudentUsage(), db(), decrementUsedCount(), findByCode(), findById(), incrementUsedCount(), RELEASED_INVOICE_STATUSES

### Community 22 - "Category Controller & Repository"
Cohesion: 0.16
Nodes (21): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+13 more)

### Community 23 - "AppError"
Cohesion: 0.21
Nodes (17): getProof(), getProof(), buildPagination(), { ContentStatus, CourseStatus, CategoryStatus, ReviewStatus }, createReview(), getCourseOrThrow(), getMyReview(), getPublicCourseOrThrow() (+9 more)

### Community 24 - "notificationService.js"
Cohesion: 0.12
Nodes (29): handle(), list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany() (+21 more)

### Community 25 - "storage.js"
Cohesion: 0.08
Nodes (32): buildWhere(), findAndCount(), findById(), create(), findAndCount(), findById(), findTeacherByAccountId(), include (+24 more)

### Community 26 - "authService.js"
Cohesion: 0.09
Nodes (33): changePassword(), forgotPassword(), logout(), me(), refresh(), register(), resetPassword(), verifyEmail() (+25 more)

### Community 27 - "StatusBadge"
Cohesion: 0.19
Nodes (13): StatusBadge(), AccountsTable(), AdminList(), PermissionEditor(), fetchAdmins(), fetchFunctions(), PermissionsPage(), getTarget() (+5 more)

### Community 28 - "DashboardPanel"
Cohesion: 0.26
Nodes (11): courseApi, CourseSelect(), DashboardPanel(), AdminExamsPage(), fetchCourses(), byNewest(), CourseExamTable(), fetchMyCourses() (+3 more)

### Community 29 - "ProfileForm.jsx"
Cohesion: 0.16
Nodes (14): accountApi, TeacherFields(), AvatarUploader(), ProfileForm(), toFormValues(), toNull(), toPayload(), baseShape (+6 more)

### Community 30 - "ref_zod"
Cohesion: 0.11
Nodes (17): PERMISSIONS, validate(), express, manageAccounts, router, router, express, router (+9 more)

### Community 31 - "PaymentPage.jsx"
Cohesion: 0.12
Nodes (20): enrollmentApi, ProofImage(), ACTIVE, useMyRegistration(), useProofImage(), EnrollPanel(), PaymentActions(), PaymentPage() (+12 more)

### Community 32 - "Administrator Management"
Cohesion: 0.16
Nodes (22): getMe(), listSystemFunctions(), administratorInclude, createAdministrator(), findAccessByAccountId(), findAdministratorById(), findFunctionsByIds(), listAdministrators() (+14 more)

### Community 33 - "teacherService.js"
Cohesion: 0.14
Nodes (21): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+13 more)

### Community 34 - "CourseExamTable.jsx"
Cohesion: 0.25
Nodes (16): TONES, ACTION_DANGER, ACTION_LINK, ACTIONS, TABLE, TBODY, TD, TD_ACTION (+8 more)

### Community 35 - "database.js"
Cohesion: 0.12
Nodes (22): buildDatasourceUrl(), client, prisma, { PrismaClient }, PUBLIC_ACCOUNT_FIELDS, PUBLIC_MODELS, setParam(), WRITE_OPERATIONS (+14 more)

### Community 36 - "ForYouSection.jsx"
Cohesion: 0.23
Nodes (9): recommendationApi, REVEAL_PRESETS, revealLeft, stagger, VIEWPORT, POINTS, CONTAINER, LINK_ON_DARK (+1 more)

### Community 37 - "scripts.test.js"
Cohesion: 0.09
Nodes (29): cleanup(), CLOUD_KINDS, FIELDS, fs, isStillReferenced(), listCloudinary(), loadReferences(), path (+21 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.16
Nodes (32): attemptInclude, closeAttempt(), countAttempts(), createAttempt(), db(), findAttemptById(), findExamForStart(), findInProgress() (+24 more)

### Community 40 - "TeacherShowcase.jsx"
Cohesion: 0.23
Nodes (12): CourseCard(), COURSE_GRID_CLASS, CourseGrid(), Reveal(), RevealGroup(), SectionHeader(), staggerOf(), AiAdvisorSection() (+4 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.11
Nodes (19): adminOnly, router, teacherOnly, categoryId, changeStatusSchema, courseName, { CourseStatus }, coverImageUrl (+11 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "deleteAccount.js"
Cohesion: 0.39
Nodes (7): collect(), delegateOf(), hasId(), main(), prisma, { PrismaClient, Prisma }, PROTECTED_EMAILS

### Community 44 - "getPagination"
Cohesion: 0.22
Nodes (14): approve(), approveRefund(), completeRefund(), getById(), listAll(), listMine(), listMyRefundRequests(), listRefundRequests() (+6 more)

### Community 45 - "reportService.js"
Cohesion: 0.31
Nodes (10): assertNotFinal(), conflict(), create(), FINAL, getById(), getExistingOrThrow(), getList(), process() (+2 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "motion.js"
Cohesion: 0.11
Nodes (21): RoadPath(), SHAPES, chatPanel, DURATION, fadeUp, heroLine, imageReveal, listItem (+13 more)

### Community 48 - "steps"
Cohesion: 0.08
Nodes (30): defaults, env, runs-on, steps, run, DATABASE_URL, DIRECT_URL, VITE_API_URL (+22 more)

### Community 49 - "useAuth"
Cohesion: 0.09
Nodes (39): notificationApi, AuthLayout(), ChatWidget(), GuestPrompt(), BottomNav(), Footer(), Header(), MainNav() (+31 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "examRepository.js"
Cohesion: 0.12
Nodes (20): CONFIRMED_REGISTRATION, createExam(), createQuestion(), deleteExam(), deleteQuestion(), findExamBasic(), findExamById(), findManyByCourse() (+12 more)

### Community 52 - "BE_RStudy/package.json"
Cohesion: 0.07
Nodes (41): author, dependencies, bcrypt@^6.0.0, cloudinary@^2.11.0, cors@^2.8.6, express@^5.2.1, express-rate-limit@^8.7.5, helmet@^8.3.0 (+33 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.15
Nodes (17): authCredentialLimiter, authIpLimiter, contentWriteLimiter, { rateLimit, ipKeyGenerator }, express, router, changePasswordSchema, forgotPasswordSchema (+9 more)

### Community 54 - "couponService.js"
Cohesion: 0.24
Nodes (14): assertRules(), calculateDiscount(), changeStatus(), create(), getById(), getUsabilityError(), getUsableCoupon(), list() (+6 more)

### Community 55 - "Category Routes & Validation"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "adminValidator.js"
Cohesion: 0.20
Nodes (12): createAdministrator(), getAdministrator(), listAdministrators(), setAdministratorPermissions(), setAdministratorStatus(), createAdminSchema, idParamSchema, listQuerySchema (+4 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.08
Nodes (40): LeaderRoute(), PermissionRoute(), ProtectedRoute(), ROLE_HOME, ForbiddenPage(), ResourceListPage(), AccountsPage, AdminCategoriesPage (+32 more)

### Community 59 - "backend"
Cohesion: 0.06
Nodes (33): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+25 more)

### Community 60 - "useFetch.js"
Cohesion: 0.07
Nodes (46): axiosClient, categoryApi, couponApi, invoiceApi, reportApi, resourceApi, teacherApi, ConfirmDialog() (+38 more)

### Community 61 - "useFetch"
Cohesion: 0.13
Nodes (28): Card(), CourseCardSkeleton(), EmptyState(), ErrorState(), ListSkeleton(), LoadingState(), PageColumns(), Pagination() (+20 more)

### Community 62 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-hook-form@^7.91.0, react-router-dom@^7.18.4 (+5 more)

### Community 63 - "AppError.js"
Cohesion: 0.12
Nodes (19): buildUploader(), DOC_MIMES, hasValidSignature(), IMAGE_MIMES, multer, SIGNATURES, adminNeedsPermission(), canHandlePayment (+11 more)

### Community 64 - "Public Course Tests"
Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"
Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "react"
Cohesion: 0.12
Nodes (25): commentApi, reviewApi, ContentForm(), schema, InlineConfirmDelete(), ReportButton(), REPORTERS, Sidebar() (+17 more)

### Community 67 - "ExamForm.jsx"
Cohesion: 0.30
Nodes (9): ExamForm(), EMPTY_QUESTION(), examSchema, isNumber(), numberField(), optionSchema, questionSchema, toExamBody() (+1 more)

### Community 68 - "reviewController.js"
Cohesion: 0.36
Nodes (9): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+1 more)

### Community 69 - "swagger.test.js"
Cohesion: 0.38
Nodes (10): buildOpenApi(), listRoutes(), parseSpec(), routeKey(), check(), main(), path, sleep() (+2 more)

### Community 70 - "Review Tests"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "HomePage.jsx"
Cohesion: 0.29
Nodes (8): FAQ_ITEMS, accordion, FaqItem(), FaqSection(), LINK_PRIMARY, HomePage(), loadLatestCourse(), loadTeachers()

### Community 72 - "dashboardConfig.js"
Cohesion: 0.19
Nodes (14): StatCard(), PERMISSIONS, AdminDashboardPage(), CountCard(), fetchPendingPayments(), fetchPendingTeachers(), PENDING_CARDS, TOTAL_CARDS (+6 more)

### Community 73 - "exam.test.js"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "CourseEditPage.jsx"
Cohesion: 0.16
Nodes (14): learningApi, BackButton(), courseSchema, EDITABLE_STATUSES, EMPTY_COURSE, isNumber(), toFormValues(), CourseEditPage() (+6 more)

### Community 75 - "axiosClient.js"
Cohesion: 0.20
Nodes (10): axios@^1.20.0, adminApi, AUTH_LOGOUT_EVENT, NO_REFRESH_URLS, App(), AuthProvider(), fetchAccount(), ToastProvider() (+2 more)

### Community 77 - "Test Auth Helpers"
Cohesion: 0.48
Nodes (6): asToken(), authHeaders(), buildCandidates(), cache, makeToken(), verifies()

### Community 78 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, prettier@^3.10.1, prettier

### Community 79 - "permissions"
Cohesion: 0.22
Nodes (8): hooks, PreToolUse, SessionStart, permissions, allow, ask, deny, $schema

### Community 80 - "commentController.js"
Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 81 - "reportRoutes.js"
Cohesion: 0.33
Nodes (7): adminOnly, router, createReportSchema, idParamSchema, processReportSchema, rejectReportSchema, { z }

### Community 89 - "storage.test.js"
Cohesion: 0.31
Nodes (8): check(), exists(), fs, main(), path, PDF_MIN, png(), PNG_1X1

### Community 90 - "ExamRoom.jsx"
Cohesion: 0.21
Nodes (10): submissionApi, secondsLeft(), useCountdown(), ExamTakePage(), ExamRoom(), toList(), QuestionCard(), pad() (+2 more)

### Community 91 - "account.test.js"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 92 - "CouponForm.jsx"
Cohesion: 0.32
Nodes (9): CouponDialog(), CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues(), toIso() (+1 more)

### Community 93 - "hash.js"
Cohesion: 0.18
Nodes (12): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+4 more)

### Community 94 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 95 - "authService.js"
Cohesion: 0.14
Nodes (19): login(), resendOtp(), crypto, createOtp(), findByEmail(), findLatestOtp(), assertTeacherApproved(), crypto (+11 more)

### Community 96 - "ExamCountdown.jsx"
Cohesion: 0.33
Nodes (6): UPCOMING_EXAMS, CountdownCard(), ExamCountdown(), getParts(), pad(), TONES

### Community 97 - "jwt.js"
Cohesion: 0.20
Nodes (14): issueTokenPair(), sha256(), jwt, parseDurationToMs(), signRefreshToken(), bcrypt, call(), check() (+6 more)

### Community 98 - "format.js"
Cohesion: 0.12
Nodes (22): ChatCourseCard(), CourseCover(), NotificationItem(), SearchBox(), SearchSuggestions(), StatusRow(), dropdown, useDebouncedValue() (+14 more)

### Community 99 - "@tanstack/react-query"
Cohesion: 0.32
Nodes (5): react-dom@^19.2.8, @tanstack/react-query@^5.107.1, queryClient, react-dom, @tanstack/react-query

### Community 100 - "vite.config.js"
Cohesion: 0.29
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.6, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 101 - "redis.test.js"
Cohesion: 0.35
Nodes (11): check(), docker(), main(), path, ready(), sleep(), { spawn, execFileSync }, startServer() (+3 more)

### Community 102 - "hardening.p2.test.js"
Cohesion: 0.29
Nodes (9): AVATAR_DIR, avatarForm(), BASE, call(), check(), countBy(), fs, main() (+1 more)

### Community 103 - "accountService.js"
Cohesion: 0.11
Nodes (22): changeStatus(), list(), updateAvatar(), updateProfile(), findByIdSafe(), list(), LIST_SELECT, revokeAllRefreshTokens() (+14 more)

### Community 104 - "cloudinary.integration.test.js"
Cohesion: 0.29
Nodes (11): bodies, call(), check(), DOCX_MIN, formOf(), httpStatus(), main(), PDF_MIN (+3 more)

### Community 105 - "invoice.test.js"
Cohesion: 0.16
Nodes (18): signAccessToken(), call(), check(), main(), call(), check(), main(), sleep() (+10 more)

### Community 106 - "coupon.test.js"
Cohesion: 0.53
Nodes (5): call(), check(), codes(), main(), valid

### Community 107 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 108 - "enrollment.test.js"
Cohesion: 0.29
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 109 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 110 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.3, prisma@^6.19.3, dotenv, prisma

### Community 111 - "listManage"
Cohesion: 0.67
Nodes (3): findTeacherByAccountId(), findManyForManage(), listManage()

### Community 112 - "framer-motion"
Cohesion: 0.15
Nodes (10): ScrollProgress(), Switch(), Toast(), TYPES, EASE, slideInRight, ToastContext, FILTERS (+2 more)

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `authMiddleware.js`, `permissionMiddleware.js`, `recommendationService.js`, `invoiceService.js`, `formatResponse`, `courseService.js`, `@prisma/client`, `examService.js`, `Comment Repository`, `Category Controller & Repository`, `notificationService.js`, `storage.js`, `authService.js`, `ref_zod`, `Administrator Management`, `teacherService.js`, `database.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `reportService.js`, `examRepository.js`, `couponService.js`, `adminValidator.js`, `AppError.js`, `reviewController.js`, `authService.js`, `accountService.js`, `listManage`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FE_RStudy/package.json`, `useFetch`, `ChatPanel.jsx`, `Button`, `sessionFormat.js`, `StatusBadge`, `DashboardPanel`, `ProfileForm.jsx`, `PaymentPage.jsx`, `CourseExamTable.jsx`, `ForYouSection.jsx`, `TeacherShowcase.jsx`, `motion.js`, `useAuth`, `AppRoutes.jsx`, `useFetch.js`, `useFetch`, `dependencies`, `ExamForm.jsx`, `HomePage.jsx`, `CourseEditPage.jsx`, `axiosClient.js`, `ExamRoom.jsx`, `CouponForm.jsx`, `ExamCountdown.jsx`, `format.js`, `@tanstack/react-query`, `framer-motion`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
- **Why does `@prisma/client` connect `@prisma/client` to `database.js`, `invoiceService.js`, `formatResponse`, `Exam Submission Grading`, `courseService.js`, `Course Routes & Validation`, `deleteAccount.js`, `examService.js`, `reportService.js`, `Review Repository`, `Comment Repository`, `BE_RStudy/package.json`, `AppError`, `Category Controller & Repository`, `couponService.js`, `Category Routes & Validation`, `storage.js`, `hash.js`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `recommendationService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07337526205450734 - nodes in this community are weakly interconnected._
- **Should `cache.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06721215663354763 - nodes in this community are weakly interconnected._