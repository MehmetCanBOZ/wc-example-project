/* eslint-disable */
import { saveToStorage } from '../helper/index.js';
import { translations } from '../localization/translations.js';

function detectLanguage() {
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang && translations[htmlLang]) {
    return htmlLang;
  }

  const browserLang = navigator.language.split('-')[0];
  return translations[browserLang] ? browserLang : 'en';
}

const Store = {
  employees: [],
  language: detectLanguage(),

  setLanguage(lang) {
    if (translations[lang]) {
      this.language = lang;
      document.documentElement.setAttribute('lang', lang);
    }
  },

  t(key, replacements = {}) {
    const translation =
      translations[this.language]?.[key] || translations.en[key] || key;

    return Object.keys(replacements).reduce(
      (text, placeholder) =>
        text.replace(
          new RegExp(`\\{${placeholder}\\}`, 'g'),
          replacements[placeholder],
        ),
      translation,
    );
  },

  getCurrentLanguage() {
    return this.language;
  },

  addEmployee(employeeData) {
    const newEmployee = {
      ...employeeData,
      id: Math.max(0, ...this.employees.map(e => e.id)) + 1,
    };
    this.employees = [...this.employees, newEmployee];
    return newEmployee;
  },

  updateEmployee(id, employeeData) {
    const index = this.employees.findIndex(emp => emp.id === parseInt(id, 10));
    if (index !== -1) {
      const updatedEmployee = { ...employeeData, id: parseInt(id, 10) };
      this.employees = [
        ...this.employees.slice(0, index),
        updatedEmployee,
        ...this.employees.slice(index + 1),
      ];
      return updatedEmployee;
    }
    return null;
  },

  deleteEmployee(id) {
    const employee = this.employees.find(emp => emp.id === parseInt(id, 10));
    if (employee) {
      this.employees = this.employees.filter(
        emp => emp.id !== parseInt(id, 10),
      );
      return employee;
    }
    return null;
  },

  getEmployee(id) {
    return this.employees.find(emp => emp.id === parseInt(id, 10));
  },

  searchEmployees(query) {
    if (!query) return this.employees;

    const lowerQuery = query.toLowerCase();
    return this.employees.filter(
      emp =>
        emp.firstName.toLowerCase().includes(lowerQuery) ||
        emp.lastName.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery) ||
        emp.department.toLowerCase().includes(lowerQuery) ||
        emp.position.toLowerCase().includes(lowerQuery),
    );
  },

  isEmailUnique(email, excludeId = null) {
    return !this.employees.some(
      emp =>
        emp.email.toLowerCase() === email.toLowerCase() && emp.id !== excludeId,
    );
  },
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;

    if (property === 'employees') {
      saveToStorage(JSON.stringify(value));
      window.dispatchEvent(
        new CustomEvent('employeeschange', {
          detail: { employees: value },
        }),
      );
    }

    if (property === 'language') {
      window.dispatchEvent(
        new CustomEvent('languagechange', {
          detail: { language: value },
        }),
      );
    }

    return true;
  },
});

export default proxiedStore;
