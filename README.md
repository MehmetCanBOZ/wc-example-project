# Employee Management Application

Built with LitElement JavaScript.

## 📋 About the Project

This application is a web application that helps HR personnel manage company employee information. Developed using LitElement JavaScript, it offers responsive design and multi-language support.

## ✨ Features

### 🔍 Employee List

- Display all employee records
- Switch between table and card view
- Pagination support
- Real-time search functionality
- Edit and delete operations for each record

### ➕ Add New Employee

- Comprehensive form validation
- Required fields:
  - First Name
  - Last Name
  - Date of Employment
  - Date of Birth
  - Phone Number
  - Email Address
  - Department
  - Position (Junior, Medior, Senior)

### ✏️ Edit Employee

- Update existing employee information
- Secure update with confirmation modal
- Automatic form validation

### 🗑️ Delete Employee

- Secure deletion process
- Confirmation modal to prevent accidental deletion

## 🛠️ Technical Features

- **Framework**: LitElement JavaScript
- **Router**: Vaadin Router
- **State Management**: Custom store system
- **Responsive Design**: Responsive design
- **Localization**: Turkish and English language support
- **Testing**: Web Test Runner, OpenWc Testing
- **Linting**: ESLint and Prettier

## 🚀 Installation

### Requirements

- Node.js 18+

### Steps

1. Clone the project:

```bash
git clone [repository-url]
cd employee-management
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will run at http://localhost:8000.

## 📝 Commands

- `npm start` - Starts the development server
- `npm run test` - Runs the test suite

## 🏗️ Project Structure

```
src/
├── components/             # Reusable components
│   └── navigation-menu.js
├── views/                  # Page components
│   ├── employee-list.js
│   └── employee-form.js
├── services/               # Business logic and state management
│   ├── Store.js
│   ├── Employee.js
│   ├── API.js
│   └── app.js
├── utils/                  # Helper functions
│   ├── formatters.js
│   └── validation.js
├── localization/           # Multi-language support
│   └── translations.js
├── data/                   # Sample data
│   └── employees.json
├── helper/                 # Helper utilities
│   └── index.js
├── assets/                 # Static assets
│   ├── add.svg
│   ├── edit.svg
│   ├── delete.svg
│   └── employee.svg
└── employee-management.js  # Main application entry point
```

## 🌍 Language Support

The application supports Turkish and English languages. For language switching:

- Language switcher in the navigation menu can be used
- HTML lang attribute is automatically updated

## 🧪 Test Coverage

- Component unit tests
- Utility function tests
- Store functionality tests
- Integration tests

Running tests:

```bash
npm test
```
