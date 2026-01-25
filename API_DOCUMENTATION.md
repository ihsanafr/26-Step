# API Documentation - 26-Step Application

Base URL: `https://your-domain.com/api`

## Authentication

Semua endpoint yang memerlukan autentikasi menggunakan **Bearer Token** yang didapat dari endpoint `/login`. Token harus dikirim di header:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### 1. Register User

**POST** `/register`

Mendaftarkan user baru.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "password_confirmation": "Password123"
}
```

**Validation Rules:**
- `name`: required, string, min:2, max:255, hanya huruf, spasi, hyphen, dan apostrof
- `email`: required, valid email format, unique
- `password`: required, min:8, confirmed, harus mengandung huruf besar, huruf kecil, dan angka

**Response (201):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": null,
    "created_at": "2026-01-25T10:00:00.000000Z"
  },
  "email_verified": false
}
```

---

### 2. Login

**POST** `/login`

Login user dan mendapatkan access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": "https://...",
    "created_at": "2026-01-25T10:00:00.000000Z"
  },
  "token": "1|xxxxxxxxxxxxx",
  "token_type": "Bearer"
}
```

**Error Response (403):**
```json
{
  "message": "Please verify your email address before logging in.",
  "email_verified": false,
  "user_id": 1
}
```

---

### 3. Verify Email

**POST** `/verify-email` atau **GET** `/verify-email?token=xxx&email=xxx`

Verifikasi email user menggunakan token atau code.

**Request Body (POST):**
```json
{
  "email": "john@example.com",
  "token": "verification_token_here",  // atau
  "code": "123456"  // 6 digit code
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully.",
  "email_verified": true
}
```

---

### 4. Resend Verification Email

**POST** `/resend-verification-email`

Mengirim ulang email verifikasi.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent successfully. Please check your inbox."
}
```

---

### 5. Submit Feedback

**POST** `/feedback`

Mengirim feedback (public, tidak perlu auth).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Bug Report",
  "message": "I found a bug..."
}
```

**Response (201):**
```json
{
  "message": "Feedback berhasil dikirim",
  "feedback": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Bug Report",
    "message": "I found a bug...",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
}
```

---

## Protected Endpoints (Requires Authentication)

### User Management

#### Get Current User

**GET** `/user`

Mendapatkan informasi user yang sedang login.

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "/storage/avatars/xxx.jpg",
  "avatar_url": "https://...",
  "is_admin": false,
  "storage_limit": 52428800,
  "created_at": "2026-01-25T10:00:00.000000Z"
}
```

---

#### Update Profile

**PUT** `/user/profile`

Update profil user (name dan password).

**Request Body:**
```json
{
  "name": "John Updated",
  "current_password": "OldPassword123",
  "password": "NewPassword123",
  "password_confirmation": "NewPassword123"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

#### Update Avatar

**POST** `/user/avatar`

Upload avatar user.

**Request:** `multipart/form-data`
- `avatar`: file (image, max 5MB)

**Response (200):**
```json
{
  "message": "Avatar updated successfully",
  "user": { ... },
  "avatar_url": "https://..."
}
```

---

#### Logout

**POST** `/logout`

Logout user dan hapus token.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Tasks

### List Tasks

**GET** `/tasks`

Mendapatkan daftar semua tasks user.

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the project",
    "category": "work",
    "priority": "high",
    "status": "in_progress",
    "due_date": "2026-01-30",
    "progress": 50,
    "target_id": 1,
    "is_recurring": false,
    "task_date": "2026-01-25",
    "created_at": "2026-01-25T10:00:00.000000Z",
    "target": { ... }
  }
]
```

---

### Create Task

**POST** `/tasks`

Membuat task baru.

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the project",
  "category": "work",
  "priority": "low|medium|high",
  "status": "pending|in_progress|completed|todo|on_progress|on_hold|finish",
  "due_date": "2026-01-30",
  "progress": 50,
  "target_id": 1,
  "is_recurring": false,
  "recurring_type": "daily|weekly|monthly",
  "recurring_end_date": "2026-12-31",
  "task_date": "2026-01-25"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Complete project",
  ...
}
```

---

### Get Task

**GET** `/tasks/{id}`

Mendapatkan detail task.

**Response (200):**
```json
{
  "id": 1,
  "title": "Complete project",
  ...
}
```

---

### Update Task

**PUT** `/tasks/{id}`

Update task.

**Request Body:** (same as create, all fields optional)

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated title",
  ...
}
```

---

### Delete Task

**DELETE** `/tasks/{id}`

Hapus task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Targets

### List Targets

**GET** `/targets`

Mendapatkan daftar semua targets user.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Learn React",
    "description": "Master React framework",
    "target_date": "2026-12-31",
    "status": "active|completed|cancelled",
    "progress": 30,
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Target

**POST** `/targets`

Membuat target baru.

**Request Body:**
```json
{
  "title": "Learn React",
  "description": "Master React framework",
  "target_date": "2026-12-31",
  "status": "active|completed|cancelled",
  "progress": 0
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Learn React",
  ...
}
```

---

### Get Target

**GET** `/targets/{id}`

Mendapatkan detail target.

---

### Update Target

**PUT** `/targets/{id}`

Update target.

---

### Delete Target

**DELETE** `/targets/{id}`

Hapus target.

---

## Categories

### List Categories

**GET** `/categories`

Mendapatkan daftar semua categories user.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Work",
    "color": "#3b82f6",
    "icon": "briefcase",
    "type": "task|transaction",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Category

**POST** `/categories`

Membuat category baru.

**Request Body:**
```json
{
  "name": "Work",
  "color": "#3b82f6",
  "icon": "briefcase",
  "type": "task|transaction"
}
```

---

### Get Category

**GET** `/categories/{id}`

---

### Update Category

**PUT** `/categories/{id}`

---

### Delete Category

**DELETE** `/categories/{id}`

---

## Financial Transactions

### List Transactions

**GET** `/financial-transactions`

Mendapatkan daftar semua transaksi keuangan user.

**Query Parameters:**
- `type` (optional): `income` atau `expense`
- `category` (optional): Filter by category
- `start_date` (optional): Filter from date
- `end_date` (optional): Filter to date

**Response (200):**
```json
[
  {
    "id": 1,
    "type": "income|expense",
    "amount": 1000000,
    "description": "Salary",
    "category": "salary",
    "date": "2026-01-25",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Transaction

**POST** `/financial-transactions`

Membuat transaksi keuangan baru.

**Request Body:**
```json
{
  "type": "income|expense",
  "amount": 1000000,
  "description": "Salary",
  "category": "salary",
  "date": "2026-01-25"
}
```

---

### Get Transaction

**GET** `/financial-transactions/{id}`

---

### Update Transaction

**PUT** `/financial-transactions/{id}`

---

### Delete Transaction

**DELETE** `/financial-transactions/{id}`

---

## Budgets

### List Budgets

**GET** `/budgets`

Mendapatkan daftar semua budgets user.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Monthly Budget",
    "amount": 5000000,
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "is_active": true,
    "color": "#3b82f6",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Budget

**POST** `/budgets`

Membuat budget baru.

**Request Body:**
```json
{
  "name": "Monthly Budget",
  "amount": 5000000,
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "is_active": true,
  "color": "#3b82f6"
}
```

---

### Get Budget

**GET** `/budgets/{id}`

---

### Update Budget

**PUT** `/budgets/{id}`

---

### Delete Budget

**DELETE** `/budgets/{id}`

---

## Savings

### List Savings

**GET** `/savings`

Mendapatkan daftar semua savings user.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Emergency Fund",
    "target_amount": 10000000,
    "current_amount": 5000000,
    "target_date": "2026-12-31",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Saving

**POST** `/savings`

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "target_amount": 10000000,
  "current_amount": 0,
  "target_date": "2026-12-31"
}
```

---

### Get Saving

**GET** `/savings/{id}`

---

### Update Saving

**PUT** `/savings/{id}`

---

### Delete Saving

**DELETE** `/savings/{id}`

---

## Time Trackings

### List Time Trackings

**GET** `/time-trackings`

Mendapatkan daftar semua time tracking user.

**Query Parameters:**
- `date` (optional): Filter by date
- `task_id` (optional): Filter by task

**Response (200):**
```json
[
  {
    "id": 1,
    "task_id": 1,
    "start_time": "2026-01-25 09:00:00",
    "end_time": "2026-01-25 10:00:00",
    "duration": 3600,
    "description": "Working on project",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Time Tracking

**POST** `/time-trackings`

**Request Body:**
```json
{
  "task_id": 1,
  "start_time": "2026-01-25 09:00:00",
  "end_time": "2026-01-25 10:00:00",
  "duration": 3600,
  "description": "Working on project"
}
```

---

### Get Time Tracking

**GET** `/time-trackings/{id}`

---

### Update Time Tracking

**PUT** `/time-trackings/{id}`

---

### Delete Time Tracking

**DELETE** `/time-trackings/{id}`

---

## Schedules

### List Schedules

**GET** `/schedules`

Mendapatkan daftar semua schedules user.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Team Meeting",
    "description": "Weekly team meeting",
    "start_time": "2026-01-25 10:00:00",
    "end_time": "2026-01-25 11:00:00",
    "is_all_day": false,
    "color": "#3b82f6",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Schedule

**POST** `/schedules`

**Request Body:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly team meeting",
  "start_time": "2026-01-25 10:00:00",
  "end_time": "2026-01-25 11:00:00",
  "is_all_day": false,
  "color": "#3b82f6"
}
```

---

### Get Schedule

**GET** `/schedules/{id}`

---

### Update Schedule

**PUT** `/schedules/{id}`

---

### Delete Schedule

**DELETE** `/schedules/{id}`

---

## Habits

### List Habits

**GET** `/habits`

Mendapatkan daftar semua habits user.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Morning Exercise",
    "description": "30 minutes exercise",
    "frequency": "daily",
    "target_days": 30,
    "is_active": true,
    "color": "#3b82f6",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Habit

**POST** `/habits`

**Request Body:**
```json
{
  "name": "Morning Exercise",
  "description": "30 minutes exercise",
  "frequency": "daily|weekly|monthly",
  "target_days": 30,
  "is_active": true,
  "color": "#3b82f6"
}
```

---

### Get Habit

**GET** `/habits/{id}`

---

### Update Habit

**PUT** `/habits/{id}`

---

### Delete Habit

**DELETE** `/habits/{id}`

---

## Habit Logs

### List Habit Logs

**GET** `/habits/{habit_id}/logs`

Mendapatkan daftar log untuk habit tertentu.

**Response (200):**
```json
[
  {
    "id": 1,
    "habit_id": 1,
    "date": "2026-01-25",
    "completed": true,
    "notes": "Completed successfully",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Habit Log

**POST** `/habits/{habit_id}/logs`

**Request Body:**
```json
{
  "date": "2026-01-25",
  "completed": true,
  "notes": "Completed successfully"
}
```

---

### Get Habit Log

**GET** `/habits/{habit_id}/logs/{log_id}`

---

### Update Habit Log

**PUT** `/habits/{habit_id}/logs/{log_id}`

---

### Delete Habit Log

**DELETE** `/habits/{habit_id}/logs/{log_id}`

---

## Notes

### List Notes

**GET** `/notes`

Mendapatkan daftar semua notes user.

**Query Parameters:**
- `category_id` (optional): Filter by category

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Meeting Notes",
    "content": "Notes content...",
    "category_id": 1,
    "is_pinned": false,
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Note

**POST** `/notes`

**Request Body:**
```json
{
  "title": "Meeting Notes",
  "content": "Notes content...",
  "category_id": 1,
  "is_pinned": false
}
```

---

### Get Note

**GET** `/notes/{id}`

---

### Update Note

**PUT** `/notes/{id}`

---

### Delete Note

**DELETE** `/notes/{id}`

---

## Journal Note Categories

### List Categories

**GET** `/journal-note-categories`

Mendapatkan daftar semua journal/note categories user.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Personal",
    "color": "#3b82f6",
    "icon": "user",
    "type": "journal|note",
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Category

**POST** `/journal-note-categories`

**Request Body:**
```json
{
  "name": "Personal",
  "color": "#3b82f6",
  "icon": "user",
  "type": "journal|note"
}
```

---

### Get Category

**GET** `/journal-note-categories/{id}`

---

### Update Category

**PUT** `/journal-note-categories/{id}`

---

### Delete Category

**DELETE** `/journal-note-categories/{id}`

---

## Folders

### List Folders

**GET** `/folders`

Mendapatkan daftar semua folders user.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Documents",
    "parent_id": null,
    "path": "Documents",
    "created_at": "2026-01-25T10:00:00.000000Z",
    "children": []
  }
]
```

---

### Create Folder

**POST** `/folders`

**Request Body:**
```json
{
  "name": "Documents",
  "parent_id": null
}
```

---

### Update Folder

**PUT** `/folders/{id}`

---

### Delete Folder

**DELETE** `/folders/{id}`

---

## Files

### List Files

**GET** `/files`

Mendapatkan daftar semua files user.

**Query Parameters:**
- `category` (optional): Filter by category
- `folder_id` (optional): Filter by folder

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "document.pdf",
    "original_name": "document.pdf",
    "path": "files/1/document.pdf",
    "url": "https://.../storage/files/1/document.pdf",
    "mime_type": "application/pdf",
    "size": 1024000,
    "category": "documents",
    "description": "Important document",
    "folder_id": 1,
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Upload Files

**POST** `/files/upload`

Upload satu atau lebih files.

**Request:** `multipart/form-data`
- `files[]`: array of files (max 100MB per file)
- `category` (optional): string
- `description` (optional): string

**Response (201):**
```json
[
  {
    "id": 1,
    "name": "document.pdf",
    "url": "https://...",
    "size": 1024000,
    ...
  }
]
```

**Error (400):**
```json
{
  "message": "Storage limit exceeded. Maximum allowable storage is 50MB"
}
```

---

### Get File

**GET** `/files/{id}`

---

### Update File

**PUT** `/files/{id}`

**Request Body:**
```json
{
  "name": "Updated Name",
  "category": "documents",
  "description": "Updated description",
  "folder_id": 1
}
```

---

### Delete File

**DELETE** `/files/{id}`

---

### Download File

**GET** `/files/{id}/download`

Download file (returns file as download).

---

## Links

### List Links

**GET** `/links`

Mendapatkan daftar semua links user.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Google",
    "url": "https://google.com",
    "description": "Search engine",
    "category": "tools",
    "is_favorite": false,
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Link

**POST** `/links`

**Request Body:**
```json
{
  "title": "Google",
  "url": "https://google.com",
  "description": "Search engine",
  "category": "tools",
  "is_favorite": false
}
```

---

### Get Link

**GET** `/links/{id}`

---

### Update Link

**PUT** `/links/{id}`

---

### Delete Link

**DELETE** `/links/{id}`

---

## Journals

### List Journals

**GET** `/journals`

Mendapatkan daftar semua journals user.

**Query Parameters:**
- `date` (optional): Filter by date
- `mood` (optional): Filter by mood
- `is_private` (optional): boolean
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "My Day",
    "content": "Journal content...",
    "date": "2026-01-25",
    "mood": "happy",
    "tags": ["personal", "reflection"],
    "is_private": false,
    "weather": "sunny",
    "location": "Home",
    "color": "#3b82f6",
    "cover_image": "https://...",
    "category_id": 1,
    "category": { ... },
    "created_at": "2026-01-25T10:00:00.000000Z"
  }
]
```

---

### Create Journal

**POST** `/journals`

**Request Body:**
```json
{
  "title": "My Day",
  "content": "Journal content...",
  "date": "2026-01-25",
  "mood": "happy",
  "tags": ["personal", "reflection"],
  "is_private": false,
  "weather": "sunny",
  "location": "Home",
  "color": "#3b82f6",
  "cover_image": "https://...",
  "category_id": 1
}
```

---

### Get Journal

**GET** `/journals/{id}`

---

### Update Journal

**PUT** `/journals/{id}`

---

### Delete Journal

**DELETE** `/journals/{id}`

---

### Upload Journal Cover

**POST** `/journals/cover`

Upload cover image untuk journal.

**Request:** `multipart/form-data`
- `cover`: file (image)

**Response (200):**
```json
{
  "url": "https://.../storage/journals/covers/xxx.jpg"
}
```

---

### Upload Journal Content Image

**POST** `/journals/content-image`

Upload image untuk content journal (untuk rich text editor).

**Request:** `multipart/form-data`
- `image`: file (image)

**Response (200):**
```json
{
  "url": "https://.../storage/journals/content/xxx.jpg"
}
```

---

## Activities

### Get Activities by Date

**GET** `/activities/date/{date}`

Mendapatkan semua activities pada tanggal tertentu.

**Path Parameter:**
- `date`: Format YYYY-MM-DD (contoh: 2026-01-25)

**Response (200):**
```json
{
  "date": "2026-01-25",
  "tasks": [ ... ],
  "schedules": [ ... ],
  "habits": [ ... ],
  "journals": [ ... ]
}
```

---

### Get Activities by Date Range

**GET** `/activities/range?start_date=2026-01-01&end_date=2026-01-31`

Mendapatkan semua activities dalam rentang tanggal.

**Query Parameters:**
- `start_date`: Format YYYY-MM-DD (required)
- `end_date`: Format YYYY-MM-DD (required)

**Response (200):**
```json
{
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "activities": [
    {
      "date": "2026-01-01",
      "tasks": [ ... ],
      "schedules": [ ... ],
      ...
    }
  ]
}
```

---

## Admin Endpoints (Requires Admin Role)

### Get Dashboard Stats

**GET** `/admin/dashboard`

Mendapatkan statistik dashboard admin.

**Response (200):**
```json
{
  "users": {
    "total": 100,
    "new_today": 5,
    "new_this_week": 20,
    "new_this_month": 50
  },
  "tasks": {
    "total": 1000,
    "completed": 600,
    "in_progress": 200,
    "pending": 200
  },
  "targets": {
    "total": 200,
    "active": 150,
    "completed": 50
  },
  "habits": {
    "total": 300,
    "active": 250
  },
  "transactions": {
    "total": 5000,
    "income": 100000000,
    "expense": 50000000
  },
  "budgets": 100,
  "journals": 500,
  "notes": 300,
  "files": 200,
  "links": 150
}
```

---

### Get All Users

**GET** `/admin/users`

Mendapatkan daftar semua users dengan pagination.

**Query Parameters:**
- `per_page` (optional): Items per page (default: 15)
- `search` (optional): Search by name or email

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "is_admin": false,
      "tasks_count": 10,
      "completed_tasks_count": 5,
      "habits_count": 3,
      "journals_count": 5,
      "created_at": "2026-01-25T10:00:00.000000Z"
    }
  ],
  "current_page": 1,
  "last_page": 10,
  "total": 150
}
```

---

### Get User Details

**GET** `/admin/users/{id}`

Mendapatkan detail user tertentu.

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "is_admin": false,
  "storage_limit": 52428800,
  "created_at": "2026-01-25T10:00:00.000000Z",
  "tasks": [ ... ],
  "habits": [ ... ],
  ...
}
```

---

### Update User

**PUT** `/admin/users/{id}`

Update user (admin only, tidak bisa update diri sendiri).

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "NewPassword123",
  "is_admin": false,
  "storage_limit": 104857600
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": { ... }
}
```

---

### Delete User

**DELETE** `/admin/users/{id}`

Hapus user (tidak bisa hapus diri sendiri).

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

### Get Active Users

**GET** `/admin/active-users`

Mendapatkan daftar users yang aktif (ada session dalam 1 jam terakhir).

**Response (200):**
```json
{
  "active_users": [
    {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "sessions": [
        {
          "ip_address": "192.168.1.1",
          "location": null,
          "latitude": null,
          "longitude": null,
          "user_agent": "Mozilla/5.0...",
          "last_activity": "2026-01-25T10:00:00.000000Z"
        }
      ],
      "total_sessions": 1,
      "last_activity": "2026-01-25T10:00:00.000000Z"
    }
  ],
  "total": 5
}
```

---

### Get Analytics

**GET** `/admin/analytics`

Mendapatkan data analytics.

**Response (200):**
```json
{
  "user_registrations": [
    { "date": "2026-01-01", "count": 10 },
    { "date": "2026-01-02", "count": 15 },
    ...
  ],
  "task_completions": [ ... ],
  "revenue": [ ... ]
}
```

---

### Get Feedbacks

**GET** `/admin/feedbacks`

Mendapatkan daftar semua feedbacks (admin only).

**Query Parameters:**
- `per_page` (optional): Items per page (default: 15)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Bug Report",
      "message": "I found a bug...",
      "created_at": "2026-01-25T10:00:00.000000Z"
    }
  ],
  "current_page": 1,
  "last_page": 5,
  "total": 50
}
```

---

### Delete Feedback

**DELETE** `/admin/feedbacks/{id}`

Hapus feedback (admin only).

**Response (200):**
```json
{
  "message": "Feedback berhasil dihapus"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "You cannot update your own account"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Server Error"
}
```

---

## Notes

1. **Authentication**: Semua endpoint yang protected memerlukan header `Authorization: Bearer {token}`
2. **Date Format**: Gunakan format ISO 8601 (YYYY-MM-DD atau YYYY-MM-DD HH:mm:ss)
3. **Pagination**: Endpoint yang support pagination menggunakan query parameter `per_page` dan mengembalikan Laravel pagination format
4. **File Upload**: Max file size adalah 100MB per file (files) dan 5MB untuk avatar
5. **Storage Limit**: Setiap user memiliki storage limit yang dapat diatur oleh admin
6. **CORS**: Backend sudah dikonfigurasi untuk menerima request dari semua origin
7. **Rate Limiting**: Mungkin ada rate limiting pada beberapa endpoint (tergantung konfigurasi server)

---

## Base URL Examples

- **Development**: `http://localhost:8000/api`
- **Production**: `https://yourdomain.com/api` atau `https://api.yourdomain.com/api`

---

**Last Updated**: January 25, 2026
