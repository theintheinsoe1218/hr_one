# Aura HR - Human Resource Management System

<div align="center">

![Aura HR](https://img.shields.io/badge/Aura-HR-8b5cf6?style=for-the-badge&logo=vue.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=flat-square&logo=vuetify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, feature-rich Human Resource Management System built with Vue 3 and Vuetify 3. Focused on clean aesthetics, user experience, and enterprise-grade functionality.

</div>

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| 🏠 **Dashboard** | Executive overview with real-time KPI cards, pending request summaries, and applicant tracking. |
| 👥 **Employees** | Full directory with a **3-tab "Add Employee" dialog**, **sliding detail panel**, and advanced filtering. |
| 🕐 **Attendance** | Weekly calendar view with a "Mark Attendance" workflow featuring **Vuetify Time & Date pickers**. |
| 📅 **Leave Management** | Request workflow with automated balance tracking and approval/rejection system. |
| ⏰ **Overtime** | Unified OT logging with multiplier selection (1.5x, 2.0x) and approval status tracking. |
| 💰 **Payroll** | Payslip generation with **Print functionality**, auto-salary calculation, and net-pay logic. |
| ⭐ **Performance** | Template-based reviews with weighted criteria, rating scales (1-10), and history tracking. |
| 💼 **Recruitment** | Job postings management and a **Drag-and-Drop Kanban Board** for applicant pipeline. |
| 🔐 **User Management** | Complete RBAC (Role-Based Access Control) for Super Admin, Admin, HR, and Employees. |

---

## 🎨 UI/UX Highlights

- **Modern Aesthetics**: Premium glassmorphism effects, vibrant purple/indigo theme, and high-quality typography (Inter/Outfit).
- **Persistence Theme**: Automatically saves your Dark/Light mode preference to `localStorage`.
- **Smart Sidebar**: Intelligent navigation with **Rail (Collapsed)** and **Expanded** modes. The rail mode keeps the interface focused but remains fully functional.
- **Micro-animations**: Smooth transitions, hover effects, and loading states for a premium feel.
- **Theme-Aware Colors**: Fully adaptive UI that looks stunning in both light and dark modes.

---

## 🛠️ Tech Stack

- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework (Composition API)
- **[Vite](https://vitejs.dev/)** - Next Generation Frontend Tooling
- **[Vuetify 3](https://vuetifyjs.com/)** - Material Design Component Framework
- **[Vue Router 4](https://router.vuejs.org/)** - Official Vue.js Router
- **[Pinia](https://pinia.vuejs.org/)** - Intuitive Vue.js State Management
- **[Chart.js](https://www.chartjs.org/)** - Data visualization for HR metrics
- **[@mdi/font](https://pictogrammers.com/library/mdi/)** - Comprehensive Material Design icon set

---

## 📁 Project Structure

```
hr_one/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.vue   # Sidebar + Topbar logic
│   │   └── AttendanceChart.vue       # Analytics components
│   ├── plugins/
│   │   └── vuetify.js                # Theme & global settings
│   ├── router/
│   │   └── index.js                  # App routing & auth guards
│   ├── store/
│   │   └── auth.js                   # Auth state management
│   ├── utils/
│   │   └── api.js                    # API client config
│   ├── views/                        # Feature Pages
│   │   ├── Attendance.vue
│   │   ├── Dashboard.vue
│   │   ├── Employees.vue
│   │   ├── Leave.vue
│   │   ├── Login.vue
│   │   ├── Overtime.vue
│   │   ├── Payroll.vue
│   │   ├── Performance.vue
│   │   ├── Recruitment.vue
│   │   ├── Reviews.vue
│   │   └── UserManagement.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ 
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

Open **http://localhost:5173** in your browser.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@synergy.com` | `password` |

---

## �️ Roadmap Progress

- [x] Modern UI Design & Dashboard
- [x] Advanced Employee Management (Drawer/Tabs)
- [x] Multi-mode Sidebar (Rail/Expand)
- [x] Auto-persistent Theme (Dark/Light)
- [x] Kanban Board for Recruitment
- [x] Payslip Printing System
- [ ] Real Backend API Integration
- [ ] Push Notifications for Leave/OT Requests
- [ ] Advanced PDF Reporting Exports

---

<div align="center">
  Made with ❤️ for HR Professionals
</div>
