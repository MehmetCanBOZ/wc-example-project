import API from './API.js';
import { loadFromStorage } from '../helper/index.js';

export async function loadData() {
  const employees = await loadFromStorage();

  if (!employees?.length) {
    app.store.employees = await API.fetchEmployees();
  } else {
    app.store.employees = employees;
  }
}

export async function getEmployeeById(id) {
  if (app.store.employees == null) {
    await loadData();
  }

  for (const employee of app.store.employees) {
    if (employee.id === id) {
      return employee;
    }
  }
  return null;
}
