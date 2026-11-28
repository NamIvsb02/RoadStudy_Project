# Graph Report - RoadStudy  (2026-11-28)

## Corpus Check
- 451 files · ~203,729 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: (none) 16, .example 2, .css 2)

## Summary
- 2433 nodes · 7557 edges · 106 communities (98 shown, 8 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 439 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9489b612`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- authService.js
- Initial Database Migration
- react
- FE_RStudy/package.json
- recommendationService.js
- cache.js
- formatResponse
- lucide-react
- ExamReviewPage.jsx
- courseService.js
- ChatPanel.jsx
- @prisma/client
- openapi.js
- authService.js
- prisma
- reviewRepository.js
- HomeHero.jsx
- Comment Repository
- react
- commentController.js
- jwt.js
- couponService.js
- categoryService.js
- reportService.js
- notificationService.js
- storage.js
- courseRepository.js
- SoftLogoCanvas.jsx
- EmptyState
- ProfileForm.jsx
- permissionMiddleware.js
- react-router-dom
- adminService.js
- teacherService.js
- CourseExamTable.jsx
- database.js
- CourseLearningPage.jsx
- recommendationRepository.js
- Learning Sessions Backend
- Exam Submission Grading
- motion.js
- Course Routes & Validation
- Exam Routes & Validation
- ref_zod
- getPagination
- signAccessToken
- Learning Routes & Validation
- authRepository.js
- steps
- accountService.js
- Review Routes & Validation
- examService.js
- BE_RStudy/package.json
- Auth Routes & Validation
- TeacherExamsPage.jsx
- categoryRoutes.js
- Submission Routes & Validation
- app.js
- AppRoutes.jsx
- backend
- useFetch.js
- hardening.p2.test.js
- invoiceService.js
- invoiceRoutes.js
- course.public.test.js
- Course Tests
- CommentSection.jsx
- cloudinary.integration.test.js
- reviewController.js
- swagger.test.js
- review.test.js
- scripts.test.js
- enrollment.test.js
- exam.test.js
- ReviewForm.jsx
- resourceService.js
- ResourceBrowser.jsx
- Test Auth Helpers
- package.json
- permissions
- @tanstack/react-query
- authController.js
- PaymentDetailDialog.jsx
- AdminCoursesPage.jsx
- CouponForm.jsx
- hash.js
- redis.test.js
- authMiddleware.js
- reportRoutes.js
- useAuth
- account.test.js
- comment.test.js
- resourceRoutes.js
- TextField
- scripts
- motion.js
- dotenv
- Button
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `AppError` - 169 edges
2. `formatResponse()` - 131 edges
3. `react` - 125 edges
4. `useFetch()` - 83 edges
5. `Button()` - 79 edges
6. `react-router-dom` - 77 edges
7. `useAuth()` - 73 edges
8. `ROUTES` - 64 edges
9. `FormAlert()` - 54 edges
10. `AppRoutes()` - 53 edges

## Surprising Connections (you probably didn't know these)
- `issueTokenPair()` --calls--> `createRefreshToken()`  [EXTRACTED]
  BE_RStudy/src/services/authService.js → BE_RStudy/src/repositories/authRepository.js
- `getProof()` --calls--> `getProof()`  [EXTRACTED]
  BE_RStudy/src/controllers/invoiceController.js → BE_RStudy/src/services/invoiceService.js
- `Layout()` --calls--> `PageSkeleton()`  [EXTRACTED]
  FE_RStudy/src/components/Layout.jsx → FE_RStudy/src/components/common/PageSkeleton.jsx
- `AppRoutes()` --calls--> `Layout()`  [EXTRACTED]
  FE_RStudy/src/routes/AppRoutes.jsx → FE_RStudy/src/components/Layout.jsx
- `LoginPage()` --calls--> `AuthShell()`  [EXTRACTED]
  FE_RStudy/src/pages/auth/LoginPage.jsx → FE_RStudy/src/components/common/AuthShell.jsx

## Import Cycles
- None detected.

## Communities (106 total, 8 thin omitted)

### Community 0 - "authService.js"
Cohesion: 0.16
Nodes (17): hasSmtpConfig, nodemailer, sendMail(), login(), me(), findByIdSafe(), findRefreshTokenByHashAnyState(), findValidRefreshToken() (+9 more)

### Community 1 - "Initial Database Migration"
Cohesion: 0.05
Nodes (68): "Account", Account_email_key, "Administrator", Administrator_accountId_key, "AiConversation", "AiMessage", AiMessage_conversationId_idx, "AnswerOption" (+60 more)

### Community 2 - "react"
Cohesion: 0.12
Nodes (17): accountApi, adminApi, AUTH_LOGOUT_EVENT, axiosClient, NO_REFRESH_URLS, reportApi, App(), Toast() (+9 more)

### Community 3 - "FE_RStudy/package.json"
Cohesion: 0.06
Nodes (46): dependencies, axios@^1.20.0, dayjs@^1.11.23, framer-motion@^14.9.1, @hookform/resolvers@^6.0.2, lucide-react@^1.68.0, react@^19.2.8, react-hook-form@^7.91.0 (+38 more)

### Community 4 - "recommendationService.js"
Cohesion: 0.09
Nodes (38): AiError, buildOpenAiBody(), callGemini(), callOpenAiCompatible(), describeConfig(), failIfNotOk(), generateJson(), getConfig() (+30 more)

### Community 5 - "cache.js"
Cohesion: 0.07
Nodes (47): shutdown(), checkHealth(), close(), isEnabled(), isReady(), key(), Redis, url (+39 more)

### Community 6 - "formatResponse"
Cohesion: 0.08
Nodes (41): changeStatus(), updateAvatar(), getConversation(), listConversations(), sendMessage(), changeStatus(), create(), getById() (+33 more)

### Community 7 - "lucide-react"
Cohesion: 0.17
Nodes (11): COURSES_ITEM, examPathFor(), getMenuItems(), HOME_ITEM, MY_COURSES_ITEM, RESOURCES_ITEM, SOCIAL_ICONS, SITE_INFO (+3 more)

### Community 8 - "ExamReviewPage.jsx"
Cohesion: 0.16
Nodes (23): submissionApi, ResultBadge(), secondsLeft(), useCountdown(), AttemptHistory(), ExamDetailPage(), InfoItem(), durationBetween() (+15 more)

### Community 9 - "courseService.js"
Cohesion: 0.10
Nodes (40): approve(), changeStatus(), create(), getAdminById(), getAdminList(), getMyById(), getMyList(), getPublicById() (+32 more)

### Community 10 - "ChatPanel.jsx"
Cohesion: 0.24
Nodes (10): chatbotApi, ChatInput(), ChatPanel(), SUGGESTIONS, TypingIndicator(), MessageBubble(), messageIn, typingDot() (+2 more)

### Community 11 - "@prisma/client"
Cohesion: 0.14
Nodes (23): countPendingRefundByCourse(), countPendingRefundByRegistration(), createInvoice(), createRegistration(), db(), findById(), findCourseById(), findMine() (+15 more)

### Community 12 - "openapi.js"
Cohesion: 0.16
Nodes (14): version, buildOperation(), ERROR_TEXT, fs, inspect(), LIMITERS, METHODS, moduleOrder() (+6 more)

### Community 13 - "authService.js"
Cohesion: 0.18
Nodes (9): crypto, createOtp(), findLatestOtp(), sendOtp(), bcrypt, compareOtp(), crypto, generateOtpCode() (+1 more)

### Community 14 - "prisma"
Cohesion: 0.17
Nodes (13): prisma, ACTIVE_STATUSES, { Prisma }, REGISTRATION_STATUSES, call(), check(), main(), names() (+5 more)

### Community 15 - "reviewRepository.js"
Cohesion: 0.09
Nodes (36): { ContentStatus, ReviewStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createResponse(), createReview(), findActiveRegistration(), findAnyReviewByStudentAndCourse(), findCourseForReview() (+28 more)

### Community 16 - "HomeHero.jsx"
Cohesion: 0.16
Nodes (12): RoadPath(), SHAPES, SearchBox(), heroLine, imageReveal, pathDraw, scaleReveal, useMediaQuery() (+4 more)

### Community 17 - "Comment Repository"
Cohesion: 0.11
Nodes (32): authorSelect, commentSelect, { ContentStatus, RegistrationStatus }, COUNTED_REGISTRATION, courseGuardSelect, createComment(), createReply(), findActiveRegistration() (+24 more)

### Community 18 - "react"
Cohesion: 0.16
Nodes (21): authApi, AuthIllustration(), AuthShell(), useToast(), commonShape, forgotPasswordSchema, GENDERS, resetPasswordSchema (+13 more)

### Community 19 - "commentController.js"
Cohesion: 0.42
Nodes (8): create(), currentUser(), listByCourse(), remove(), removeReply(), reply(), update(), updateReply()

### Community 20 - "jwt.js"
Cohesion: 0.22
Nodes (12): sha256(), jwt, signRefreshToken(), bcrypt, call(), check(), countBy(), fs (+4 more)

### Community 21 - "couponService.js"
Cohesion: 0.13
Nodes (28): countInvoices(), countStudentUsage(), create(), db(), decrementUsedCount(), findByCode(), findById(), findCourseById() (+20 more)

### Community 22 - "categoryService.js"
Cohesion: 0.12
Nodes (29): changeStatus(), create(), getAdminById(), getAdminList(), getPublicById(), getPublicList(), remove(), update() (+21 more)

### Community 23 - "reportService.js"
Cohesion: 0.17
Nodes (19): create(), findAndCount(), findById(), findOpenDuplicate(), findTarget(), include, OPEN_STATUSES, resolveViolation() (+11 more)

### Community 24 - "notificationService.js"
Cohesion: 0.13
Nodes (28): list, markAllRead, markRead, unreadCount, countUnread(), create(), createMany(), findAccountIdByStudentId() (+20 more)

### Community 25 - "storage.js"
Cohesion: 0.13
Nodes (25): baseFolder(), crypto, driver(), EXTENSIONS, fs, getCloudinary(), isUrl(), ownCloudinaryAsset() (+17 more)

### Community 26 - "courseRepository.js"
Cohesion: 0.12
Nodes (9): buildPublicWhere(), buildWhere(), courseInclude, findAndCount(), findPublicAndCount(), PUBLIC_SORTS, publicBaseWhere, publicDetailSelect (+1 more)

### Community 27 - "SoftLogoCanvas.jsx"
Cohesion: 0.26
Nodes (12): GlobalLoadingOverlay(), OverlayContent(), drawShadow(), easeInOutCubic(), easeInQuad(), easeOutCubic(), easeOutQuad(), getSource() (+4 more)

### Community 28 - "EmptyState"
Cohesion: 0.14
Nodes (31): examApi, ChatHistory(), Card(), COURSE_GRID_CLASS, CourseCardSkeleton(), CourseGrid(), EmptyState(), ErrorState() (+23 more)

### Community 29 - "ProfileForm.jsx"
Cohesion: 0.16
Nodes (14): TeacherFields(), ChangePasswordForm(), ProfileForm(), ProfileInfo(), toFormValues(), toNull(), toPayload(), baseShape (+6 more)

### Community 30 - "permissionMiddleware.js"
Cohesion: 0.29
Nodes (7): router, base, changeStatusSchema, createCouponSchema, updateCouponSchema, validateCouponSchema, { z }

### Community 31 - "react-router-dom"
Cohesion: 0.10
Nodes (31): ChatCourseCard(), CourseCard(), CourseCover(), SearchSuggestions(), StatusRow(), ROLE_HOME, ROUTES, useMyRegistration() (+23 more)

### Community 32 - "adminService.js"
Cohesion: 0.10
Nodes (34): createAdministrator(), getAdministrator(), getMe(), listAdministrators(), listSystemFunctions(), setAdministratorPermissions(), setAdministratorStatus(), administratorInclude (+26 more)

### Community 33 - "teacherService.js"
Cohesion: 0.14
Nodes (21): getMyStats(), getPublic(), listForAdmin(), listPublic(), setApproval(), findByAccountId(), findPublicById(), getStats() (+13 more)

### Community 34 - "CourseExamTable.jsx"
Cohesion: 0.19
Nodes (22): StatusBadge(), TONES, GENDER_LABELS, ROLE_LABELS, CategoryTable(), CouponTable(), discountText(), PaymentTable() (+14 more)

### Community 35 - "database.js"
Cohesion: 0.16
Nodes (14): buildDatasourceUrl(), client, { PrismaClient }, PUBLIC_ACCOUNT_FIELDS, PUBLIC_MODELS, setParam(), WRITE_OPERATIONS, check() (+6 more)

### Community 36 - "CourseLearningPage.jsx"
Cohesion: 0.15
Nodes (20): learningApi, FormAlert(), dayFormatter, formatSessionTime(), fromInputValue(), inputFormatter, sessionState(), timeFormatter (+12 more)

### Community 37 - "recommendationRepository.js"
Cohesion: 0.22
Nodes (13): courseSelect, findCandidates(), findOpenCourses(), findOpenForStudent(), findStudentCourseLinks(), findStudentIdByAccountId(), openWhere(), summarySelect (+5 more)

### Community 38 - "Learning Sessions Backend"
Cohesion: 0.18
Nodes (19): createSession(), deleteSession(), findCourse(), findLearning(), findSession(), findSessions(), findStudentIdByAccountId(), hasPaidRegistration() (+11 more)

### Community 39 - "Exam Submission Grading"
Cohesion: 0.15
Nodes (33): hasConfirmedRegistration(), attemptInclude, closeAttempt(), countAttempts(), createAttempt(), db(), findAttemptById(), findExamForStart() (+25 more)

### Community 40 - "motion.js"
Cohesion: 0.09
Nodes (36): recommendationApi, Reveal(), RevealGroup(), ScrollProgress(), SectionHeader(), UPCOMING_EXAMS, FAQ_ITEMS, accordion (+28 more)

### Community 41 - "Course Routes & Validation"
Cohesion: 0.10
Nodes (22): adminNeedsPermission(), adminOnly, checkCoursePermission, courseEditor, router, teacherOnly, categoryId, changeStatusSchema (+14 more)

### Community 42 - "Exam Routes & Validation"
Cohesion: 0.14
Nodes (18): adminNeedsPermission(), ALL, checkAdminPermission, MANAGER, router, changeStatusSchema, createExamSchema, createQuestionSchema (+10 more)

### Community 43 - "ref_zod"
Cohesion: 0.20
Nodes (9): fadeIn, CategoryDialog(), CategoryForm(), schema, toBody(), CreateAdminForm(), DEFAULT_VALUES, createAdminSchema (+1 more)

### Community 44 - "getPagination"
Cohesion: 0.10
Nodes (30): list(), cancel(), create(), getMine(), listMine(), approve(), approveRefund(), completeRefund() (+22 more)

### Community 45 - "signAccessToken"
Cohesion: 0.16
Nodes (17): signAccessToken(), call(), check(), main(), call(), check(), crypto, fs (+9 more)

### Community 46 - "Learning Routes & Validation"
Cohesion: 0.16
Nodes (13): adminNeedsPermission(), checkAdminPermission, router, teacherOnly, courseIdParamSchema, createSessionSchema, httpsUrl, optionalUrl (+5 more)

### Community 47 - "authRepository.js"
Cohesion: 0.16
Nodes (17): changePassword(), logout(), resetPassword(), ACCOUNT_SAFE_SELECT, consumeOtp(), createRefreshToken(), findById(), findLatestValidOtp() (+9 more)

### Community 48 - "steps"
Cohesion: 0.08
Nodes (30): defaults, env, runs-on, steps, run, DATABASE_URL, DIRECT_URL, VITE_API_URL (+22 more)

### Community 49 - "accountService.js"
Cohesion: 0.14
Nodes (17): updateProfile(), findByIdSafe(), LIST_SELECT, revokeAllRefreshTokens(), SAFE_SELECT, updateAvatarIfCurrent(), updateProfile(), updateStatus() (+9 more)

### Community 50 - "Review Routes & Validation"
Cohesion: 0.17
Nodes (13): router, studentOnly, teacherOnly, courseIdParamSchema, createReviewSchema, idParamSchema, listQuerySchema, ratingValue (+5 more)

### Community 51 - "examService.js"
Cohesion: 0.10
Nodes (43): CONFIRMED_REGISTRATION, countAttemptsByExams(), createExam(), createQuestion(), deleteExam(), deleteQuestion(), findCourseById(), findExamBasic() (+35 more)

### Community 52 - "BE_RStudy/package.json"
Cohesion: 0.07
Nodes (41): author, dependencies, bcrypt@^6.0.0, cloudinary@^2.11.0, cors@^2.8.6, express@^5.2.1, express-rate-limit@^8.7.5, helmet@^8.3.0 (+33 more)

### Community 53 - "Auth Routes & Validation"
Cohesion: 0.15
Nodes (17): authCredentialLimiter, authIpLimiter, contentWriteLimiter, { rateLimit, ipKeyGenerator }, express, router, changePasswordSchema, forgotPasswordSchema (+9 more)

### Community 54 - "TeacherExamsPage.jsx"
Cohesion: 0.30
Nodes (10): CourseSelect(), TableSkeleton(), AdminExamsPage(), fetchCourses(), byNewest(), CourseExamTable(), fetchMyCourses(), TeacherExamsPage() (+2 more)

### Community 55 - "categoryRoutes.js"
Cohesion: 0.21
Nodes (11): adminOnly, router, categoryName, { CategoryStatus }, changeStatusSchema, createCategorySchema, description, idParamSchema (+3 more)

### Community 56 - "Submission Routes & Validation"
Cohesion: 0.22
Nodes (11): adminNeedsPermission(), checkAdminPermission, router, answerSchema, answersField, saveAnswersSchema, startSchema, strictObject() (+3 more)

### Community 57 - "app.js"
Cohesion: 0.10
Nodes (21): app, cors, corsOrigins, express, helmet, morgan, path, server (+13 more)

### Community 58 - "AppRoutes.jsx"
Cohesion: 0.06
Nodes (52): teacherApi, StatCard(), ProtectedRoute(), PERMISSIONS, AdminDashboardPage(), CountCard(), fetchPendingPayments(), fetchPendingTeachers() (+44 more)

### Community 59 - "backend"
Cohesion: 0.06
Nodes (33): VITE_API_URL, VITE_ASSET_URL, build, container_name, env_file, environment, ports, restart (+25 more)

### Community 60 - "useFetch.js"
Cohesion: 0.11
Nodes (42): ConfirmDialog(), DashboardPanel(), getPages(), Pagination(), STATUS_MAPS, AccountsFilterBar(), AccountsTable(), AccountsPage() (+34 more)

### Community 61 - "hardening.p2.test.js"
Cohesion: 0.29
Nodes (9): AVATAR_DIR, avatarForm(), BASE, call(), check(), countBy(), fs, main() (+1 more)

### Community 62 - "invoiceService.js"
Cohesion: 0.12
Nodes (42): countPendingRefundByRegistration(), createSupportRequest(), db(), findInvoiceById(), findInvoices(), findStudentIdByAccountId(), findSupportRequestById(), findSupportRequests() (+34 more)

### Community 63 - "invoiceRoutes.js"
Cohesion: 0.12
Nodes (19): buildUploader(), DOC_MIMES, hasValidSignature(), IMAGE_MIMES, multer, SIGNATURES, adminNeedsPermission(), canHandlePayment (+11 more)

### Community 64 - "course.public.test.js"
Cohesion: 0.33
Nodes (9): call(), check(), ids(), KEY, list(), main(), sameOrder(), sameSet() (+1 more)

### Community 65 - "Course Tests"
Cohesion: 0.31
Nodes (9): ADMIN, call(), check(), ids(), main(), makeTeacher(), stamp, STUDENT (+1 more)

### Community 66 - "CommentSection.jsx"
Cohesion: 0.21
Nodes (15): commentApi, reviewApi, ContentForm(), schema, InlineConfirmDelete(), ReportButton(), REPORTERS, Avatar() (+7 more)

### Community 67 - "cloudinary.integration.test.js"
Cohesion: 0.29
Nodes (11): bodies, call(), check(), DOCX_MIN, formOf(), httpStatus(), main(), PDF_MIN (+3 more)

### Community 68 - "reviewController.js"
Cohesion: 0.36
Nodes (9): create(), currentUser(), getMine(), listByCourse(), parseListQuery(), removeResponse(), respond(), update() (+1 more)

### Community 69 - "swagger.test.js"
Cohesion: 0.38
Nodes (10): buildOpenApi(), listRoutes(), parseSpec(), routeKey(), check(), main(), path, sleep() (+2 more)

### Community 70 - "review.test.js"
Cohesion: 0.39
Nodes (8): authHeaders(), call(), check(), ids(), main(), sameOrder(), sleep(), stamp

### Community 71 - "scripts.test.js"
Cohesion: 0.15
Nodes (16): asset(), check(), cloudStorage, fakeCloudinary(), fakePrisma(), fakeStorage(), FIELD_OF, fs (+8 more)

### Community 72 - "enrollment.test.js"
Cohesion: 0.33
Nodes (8): call(), check(), fs, main(), path, PNG, proofForm(), tokenOf()

### Community 73 - "exam.test.js"
Cohesion: 0.46
Nodes (7): call(), check(), correctOf(), leaksAnswer(), main(), makeQ(), wrongOf()

### Community 74 - "ReviewForm.jsx"
Cohesion: 0.28
Nodes (8): StarRating(), STARS, FieldError(), EASE, MyReviewBox(), ReviewForm(), schema, FILTERS

### Community 75 - "resourceService.js"
Cohesion: 0.21
Nodes (13): create(), findAndCount(), findById(), findTeacherByAccountId(), include, remove(), { CategoryStatus }, create() (+5 more)

### Community 76 - "ResourceBrowser.jsx"
Cohesion: 0.12
Nodes (23): categoryApi, FilterPanel(), FilterRadioList(), FilterSection(), PageColumns(), fetchCategories(), useCategories(), useDebouncedValue() (+15 more)

### Community 77 - "Test Auth Helpers"
Cohesion: 0.29
Nodes (10): check(), main(), put(), stamp, asToken(), authHeaders(), buildCandidates(), cache (+2 more)

### Community 78 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, prettier@^3.10.1, prettier

### Community 79 - "permissions"
Cohesion: 0.22
Nodes (8): hooks, PreToolUse, SessionStart, permissions, allow, ask, deny, $schema

### Community 80 - "@tanstack/react-query"
Cohesion: 0.38
Nodes (4): react-dom@^19.2.8, queryClient, react-dom, @tanstack/react-query

### Community 89 - "authController.js"
Cohesion: 0.16
Nodes (14): forgotPassword(), refresh(), register(), resendOtp(), verifyEmail(), createStudentAccount(), createTeacherAccount(), findByEmail() (+6 more)

### Community 90 - "PaymentDetailDialog.jsx"
Cohesion: 0.17
Nodes (15): couponApi, enrollmentApi, invoiceApi, NoteDialog(), NoteForm(), ProofImage(), useGlobalLoading(), useProofImage() (+7 more)

### Community 91 - "AdminCoursesPage.jsx"
Cohesion: 0.15
Nodes (21): courseApi, BackButton(), CourseForm(), courseSchema, EDITABLE_STATUSES, EMPTY_COURSE, isNumber(), toCourseBody() (+13 more)

### Community 92 - "CouponForm.jsx"
Cohesion: 0.28
Nodes (10): scaleIn, CouponDialog(), CouponForm(), couponSchema, EMPTY_COUPON, isNumber(), toBody(), toFormValues() (+2 more)

### Community 93 - "hash.js"
Cohesion: 0.18
Nodes (12): CATEGORIES, getDates(), main(), prisma, { PrismaClient }, TEACHERS, main(), prisma (+4 more)

### Community 94 - "redis.test.js"
Cohesion: 0.35
Nodes (11): check(), docker(), main(), path, ready(), sleep(), { spawn, execFileSync }, startServer() (+3 more)

### Community 95 - "authMiddleware.js"
Cohesion: 0.09
Nodes (23): authenticate(), authorize(), optionalAuthenticate(), readToken(), validate(), router, router, writers (+15 more)

### Community 97 - "reportRoutes.js"
Cohesion: 0.33
Nodes (7): adminOnly, router, createReportSchema, idParamSchema, processReportSchema, rejectReportSchema, { z }

### Community 100 - "useAuth"
Cohesion: 0.11
Nodes (28): notificationApi, NotificationBell(), SHAKE, NotificationItem(), getMenuItems(), UserMenu(), LeaderRoute(), ADMIN_NAV (+20 more)

### Community 102 - "account.test.js"
Cohesion: 0.57
Nodes (6): call(), callBoth(), check(), expectAllowed(), expectBlocked(), main()

### Community 103 - "comment.test.js"
Cohesion: 0.48
Nodes (6): call(), check(), ids(), main(), sleep(), stamp

### Community 104 - "resourceRoutes.js"
Cohesion: 0.20
Nodes (11): loadAdmin(), requireAdmin(), requireLeader(), requirePermission(), router, adminNeedsPermission(), checkAdminPermission, router (+3 more)

### Community 106 - "TextField"
Cohesion: 0.21
Nodes (12): resourceApi, FormField(), inputClass(), PasswordInput, loginSchema, LoginPage(), GENDER_OPTIONS, StudentFields() (+4 more)

### Community 107 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, db:generate, db:migrate, db:studio, dev, postinstall, start, test

### Community 108 - "motion.js"
Cohesion: 0.11
Nodes (27): AuthLayout(), ChatWidget(), GuestPrompt(), BottomNav(), Footer(), Header(), MainNav(), getNavItems() (+19 more)

### Community 110 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.3, prisma@^6.19.3, dotenv, prisma

### Community 112 - "Button"
Cohesion: 0.16
Nodes (20): ReportDialog(), ReportForm(), schema, Button(), SIZES, VARIANTS, TextField, ReportActionDialog() (+12 more)

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `examService.js` to `authService.js`, `recommendationService.js`, `formatResponse`, `courseService.js`, `@prisma/client`, `authService.js`, `prisma`, `reviewRepository.js`, `Comment Repository`, `couponService.js`, `categoryService.js`, `reportService.js`, `notificationService.js`, `storage.js`, `adminService.js`, `teacherService.js`, `database.js`, `recommendationRepository.js`, `Learning Sessions Backend`, `Exam Submission Grading`, `getPagination`, `authRepository.js`, `accountService.js`, `invoiceService.js`, `invoiceRoutes.js`, `reviewController.js`, `resourceService.js`, `authController.js`, `authMiddleware.js`, `resourceRoutes.js`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Should `Initial Database Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `FE_RStudy/package.json`, `ExamReviewPage.jsx`, `ChatPanel.jsx`, `HomeHero.jsx`, `react`, `SoftLogoCanvas.jsx`, `EmptyState`, `ProfileForm.jsx`, `react-router-dom`, `CourseExamTable.jsx`, `CourseLearningPage.jsx`, `motion.js`, `ref_zod`, `TeacherExamsPage.jsx`, `AppRoutes.jsx`, `useFetch.js`, `CommentSection.jsx`, `ReviewForm.jsx`, `ResourceBrowser.jsx`, `@tanstack/react-query`, `PaymentDetailDialog.jsx`, `AdminCoursesPage.jsx`, `CouponForm.jsx`, `useAuth`, `TextField`, `motion.js`, `Button`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.12096774193548387 - nodes in this community are weakly interconnected._
- **Why does `formatResponse()` connect `formatResponse` to `authService.js`, `teacherService.js`, `reviewController.js`, `cache.js`, `courseService.js`, `getPagination`, `authRepository.js`, `accountService.js`, `commentController.js`, `Auth Routes & Validation`, `categoryService.js`, `authController.js`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `FE_RStudy/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05782312925170068 - nodes in this community are weakly interconnected._
- **Should `recommendationService.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._