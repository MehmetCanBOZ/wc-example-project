import { saveToStorage } from '../helper/index.js';

const API = {
  url: 'src/data/employees.json',
  fetchEmployees: async () => {
    const result = await fetch(API.url);
    const employees = await result.json();

    await saveToStorage(employees);
    return employees;
  },
};

export default API;
