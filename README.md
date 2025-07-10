# 🎓 Student-Teacher Booking Appointment System

A modern web-based appointment booking system that allows **students** to schedule meetings with **teachers**, and enables **admins** to manage teachers and registrations. Built using **React.js**, **Vite**, **TailwindCSS**, and **Firebase**, it streamlines communication in educational institutions.

---

## 📌 Project Overview

The project provides a **real-time scheduling interface** for students and teachers. It reduces manual coordination and improves accessibility. Users can interact through a clean, responsive interface with secure login and personalized dashboards.

---

## 🧠 Domain

**Education** – Streamlining academic scheduling between students and faculty.

---

## 🛠️ Technologies Used

| Layer        | Tech Stack                       |
|--------------|----------------------------------|
| Frontend     | React.js, Vite, TailwindCSS      |
| Backend      | Firebase (Auth, Realtime DB)     |
| Hosting      | Firebase Hosting (Optional)      |
| Logging      | JavaScript-based console/file logging |

---

## 🚀 Features & Modules

### 👨‍🏫 Teacher
- Login/logout
- Schedule available appointment slots
- Approve/cancel appointments
- View messages from students
- View all appointment history

### 👨‍🎓 Student
- Register/login
- Search teacher (name/department/subject)
- Book appointment
- Send message (appointment purpose)
- View booking status

### 🔧 Admin
- Login/logout
- Add/update/delete teachers
- Approve student registrations
- View appointment logs

---
## 🛠️ Modules Interconnect Workflow Diagram

![Uploading diagram.png…]()


---

## ❓ Problem Statement

Scheduling appointments in educational environments is often time-consuming. This system provides a **real-time, digital booking platform** where students can book appointments with teachers anytime, from anywhere.

---

## ⚙️ System Architecture

### 🧱 Overview

The system follows a **client-server architecture** using **Firebase** for backend services.

### 🧩 Architectural Components

#### 1. Frontend (Client)
- Built with **ReactJS** using **Vite** for fast development
- Styled with **TailwindCSS**
- Role-based dashboards: Student, Teacher, Admin
- Messaging & booking interfaces

#### 2. Backend (Firebase)
- **Firebase Authentication**: Handles user sessions
- **Realtime Database**: Stores users, teachers, appointments, messages, logs
- **Firebase Hosting**: (Optional) for live deployment
- **RBAC**: Firebase rules enforce role-based access control

### 🧭 Workflow (Text Diagram)

```plaintext
+----------------+         +------------------+         +----------------------+
|  Student UI    |         |  Teacher UI      |         |     Admin UI         |
+----------------+         +------------------+         +----------------------+
        |                         |                              |
        | Login/Register          | Login                       | Login
        |-----------------------> |---------------------------> |------------------+
        |                         |                              |                 |
        | Search Teachers         | Set Available Slots          | Manage Teachers |
        | Book Appointment        | Approve/Cancel Appointments  | Approve Students|
        | Send Message            | Read Messages                | View Logs       |
        | View Appointment Status | View Appointments            |                 |
        V                         V                              V
+--------------------------------------------------------------------------+
|                      Firebase Backend (Auth + DB + Hosting)              |
|   - Authentication                                                        |
|   - Realtime Database (Users, Appointments, Messages, Logs)              |
|   - Firebase Hosting (Optional)                                          |
+--------------------------------------------------------------------------+
