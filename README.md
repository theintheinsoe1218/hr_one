# HRMS Pro - Human Resource Management System

<div align="center">

![HRMS Pro](https://img.shields.io/badge/HRMS-Pro-8b5cf6?style=for-the-badge&logo=vue.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=flat-square&logo=vuetify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, feature-rich Human Resource Management System built with Vue 3 and Vuetify 3.

</div>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🏠 **Dashboard** | HR overview with KPI stats, employee growth chart & recent activity feed |
| 👥 **Employees** | Employee directory with search, department filter & status management |
| 🕐 **Attendance** | Dynamic daily attendance tracker with weekly calendar navigation |
| 📅 **Leave Management** | Leave request workflow with balance tracker & approval system |
| ⏰ **Overtime** | OT log management with approval tracking |
| 💰 **Payroll** | Salary summary, pay stub download & payment history |
| ⭐ **Performance** | KPI tracking, goal progress & employee evaluations |
| 📝 **My Reviews** | Personal performance reviews & peer feedback |
| 💼 **Recruitment** | Job postings, candidate management & pipeline tracking |

---

## 🛠️ Tech Stack

- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript Framework (Composition API)
- **[Vite](https://vitejs.dev/)** - Next Generation Frontend Tooling
- **[Vuetify 3](https://vuetifyjs.com/)** - Material Design Component Framework
- **[Vue Router 4](https://router.vuejs.org/)** - Official Vue.js Router
- **[Pinia](https://pinia.vuejs.org/)** - Intuitive Vue.js State Management
- **[Axios](https://axios-http.com/)** - HTTP Client with JWT Interceptors
- **[Chart.js](https://www.chartjs.org/)** + **[vue-chartjs](https://vue-chartjs.org/)** - Beautiful Charts
- **[VueUse](https://vueuse.org/)** - Collection of Vue Composition Utilities
- **[JWT Decode](https://github.com/auth0/jwt-decode)** - JSON Web Token decoder
- **[@mdi/font](https://pictogrammers.com/library/mdi/)** - Material Design Icons

---

## 📁 Project Structure

```
hr_one/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.vue   # Sidebar + Topbar layout
│   │   └── AttendanceChart.vue       # Weekly attendance bar chart
│   ├── plugins/
│   │   └── vuetify.js                # Vuetify theme configuration
│   ├── router/
│   │   └── index.js                  # Vue Router with auth guards
│   ├── store/
│   │   └── auth.js                   # Pinia auth store (JWT)
│   ├── utils/
│   │   └── api.js                    # Axios instance + interceptors
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Employees.vue
│   │   ├── Attendance.vue
│   │   ├── Leave.vue
│   │   ├── Overtime.vue
│   │   ├── Payroll.vue
│   │   ├── Performance.vue
│   │   ├── Reviews.vue
│   │   └── Recruitment.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/theintheinsoe1218/hr_one.git

# 2. Navigate to project directory
cd hr_one

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔐 Authentication

The application uses **JWT-based authentication**. For the demo:

| Field | Value |
|-------|-------|
| Email | `admin@synergy.com` |
| Password | `password` |

> **Note:** The current implementation uses mock authentication. To connect to a real backend, update `src/store/auth.js` with your actual API endpoint and configure `VITE_API_URL` in your `.env` file.

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://your-api-server.com/api
```

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Theme & Customization

The app uses a **purple/indigo color palette** configured in `src/plugins/vuetify.js`. Both **Light** and **Dark** modes are supported and can be toggled from the top navigation bar.

To change the primary color:

```js
// src/plugins/vuetify.js
colors: {
  primary: '#8b5cf6',  // Change this to your brand color
  ...
}
```

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Login | JWT-secured login with role-based access |
| Dashboard | Executive overview with charts & activity feed |
| Attendance | Weekly calendar with daily record tracking |
| Leave Management | Leave balance cards + request approval workflow |

---

## 🔌 API Integration

All HTTP requests go through the centralized Axios instance in `src/utils/api.js`:

- **Request Interceptor** – Automatically attaches JWT Bearer token to every request
- **Response Interceptor** – Handles `401 Unauthorized` by logging out and redirecting to `/login`

---

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Role-based access control (Admin / HR / Manager / Staff)
- [ ] Real-time notifications
- [ ] Employee document uploads
- [ ] Payroll calculation engine
- [ ] Reporting & export to Excel/PDF
- [ ] Mobile responsive improvements

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ using Vue 3 + Vuetify 3
</div>
