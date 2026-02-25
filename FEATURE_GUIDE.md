
# Feature Guide: El Shate' Academy

This guide details the specific features and workflows implemented in the platform.

## 1. Drip Content (Scheduled Release) 💧

**Purpose**: To prevent students from binge-watching content and ensure structured learning.

**How it works**:
1.  **Instructor**: In the "Edit Lesson" modal, sets a `Drip Delay` (e.g., 3 days).
2.  **System**: Calculates the unlock date: `Enrollment Date + Drip Delay`.
3.  **Student**:
    -   Sees a "Locked" icon on the lesson in the sidebar.
    -   Hovering shows "Available [Date]".
    -   Attempting to access shows a "Content Locked" screen.

**Implementation**:
-   `backend/src/enrollments`: Checks enrollment date.
-   `frontend/src/app/learn/course/[courseId]`: Logic `isLessonLocked(lesson)`.

---

## 2. Secure Video Player 🔐

**Purpose**: To protect intellectual property and minimize piracy.

**Features**:
-   **Dynamic Watermark**: An overlay showing the current user's email and ID moves randomly across the screen every 5 seconds.
-   **Provider Agnostic**: Supports Local files, YouTube (embed), Vdocipher (stub), and Bunny.net (stub).
-   **Controls**: Context menu (right-click) is disabled. Download button hidden for local videos.

**Implementation**:
-   `frontend/src/components/student/SecureVideoPlayer.tsx`.

---

## 3. Stripe Payments 💳

**Purpose**: To monetize courses securely.

**Workflow**:
1.  **User**: Clicks "Enroll Now" on a paid course.
2.  **Backend**: `PaymentsService` creates a Stripe Checkout Session.
3.  **Frontend**: Redirects user to Stripe's hosted page.
4.  **Stripe**: Processes payment and redirects to `/enroll/success`.
5.  **Success Page**: Verifies `session_id` with backend to confirm payment and activate enrollment.

**Implementation**:
-   `backend/src/payments/payments.service.ts`
-   `frontend/src/app/enroll/success/page.tsx`

---

## 4. Admin Dashboard 👑

**Purpose**: Complete oversight of the platform.

**Capabilities**:
-   **Stats**: Real-time count of Users, Enrollments, and Revenue.
-   **User Table**: Filterable list of all registered users.
-   **Course Grid**: View all courses and their publication status.

**Implementation**:
-   `backend/src/admin/admin.service.ts` (Aggregates data)
-   `frontend/src/app/admin/page.tsx` (Visualizes data)

---

## 5. Course Certificates 🏆

**Purpose**: Reward students for completion.

**Logic**:
-   Checks if `Enrollment.progress === 100`.
-   Generates a PDF (currently mock URL) for download.

**Implementation**:
-   `backend/src/certificates/certificates.service.ts`
