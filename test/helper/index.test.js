import { expect } from '@open-wc/testing';
import { saveToStorage, loadFromStorage } from '../../src/helper/index.js';

describe('Helper Functions', () => {
  let originalLocalStorage;
  let mockEmployeesData;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;

    mockEmployeesData = [
      {
        id: 1,
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        dateOfEmployment: '2022-09-23',
        dateOfBirth: '1990-03-15',
        phone: '+(90) 532 123 45 67',
        email: 'ahmet@sourtimes.org',
        department: 'Analytics',
        position: 'Junior',
      },
      {
        id: 2,
        firstName: 'Zeynep',
        lastName: 'Kaya',
        dateOfEmployment: '2021-06-12',
        dateOfBirth: '1988-07-22',
        phone: '+(90) 545 234 56 78',
        email: 'zeynep.kaya@kaya.com',
        department: 'Tech',
        position: 'Senior',
      },
    ];

    const localStorageMock = {
      storage: {},
      getItem(key) {
        return this.storage[key] || null;
      },
      setItem(key, value) {
        this.storage[key] = value != null ? value.toString() : String(value);
      },
      clear() {
        this.storage = {};
      },
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('should save JSON string to localStorage', async () => {
    const jsonData = JSON.stringify(mockEmployeesData);

    await saveToStorage(jsonData);

    expect(localStorage.getItem('employees')).to.equal(jsonData);
  });

  it('should load valid JSON data from localStorage', async () => {
    const jsonData = JSON.stringify(mockEmployeesData);
    localStorage.setItem('employees', jsonData);

    const result = await loadFromStorage();

    expect(result).to.deep.equal(mockEmployeesData);
  });

  it('should handle save and load data', async () => {
    const testData = JSON.stringify(mockEmployeesData);

    await saveToStorage(testData);

    const result = await loadFromStorage();

    expect(result).to.deep.equal(mockEmployeesData);
  });
});
