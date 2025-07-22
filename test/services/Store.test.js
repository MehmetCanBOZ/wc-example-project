import { expect } from '@open-wc/testing';
import Store from '../../src/services/Store.js';

describe('Store Service', () => {
  let mockEmployeesData;
  let originalLocalStorage;
  let mockEventListeners;

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
      {
        id: 3,
        firstName: 'Mehmet',
        lastName: 'Özkan',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1992-11-08',
        phone: '+(90) 536 345 67 89',
        email: 'mehmet.ozkan@ozkan.org',
        department: 'Analytics',
        position: 'Medior',
      },
    ];

    mockEventListeners = {};
    const originalDispatchEvent = window.dispatchEvent;

    window.dispatchEvent = event => {
      mockEventListeners[event.type] = event;
      return originalDispatchEvent.call(window, event);
    };

    const localStorageMock = {
      storage: {},
      getItem(key) {
        return this.storage[key] || null;
      },
      setItem(key, value) {
        this.storage[key] = value.toString();
      },
      clear() {
        this.storage = {};
      },
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Store.employees = [];
    Store.language = 'en';

    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });

    Store.employees = [];
    Store.language = 'en';
  });

  describe('setLanguage method', () => {
    it('should set valid language', () => {
      Store.setLanguage('tr');
      expect(Store.language).to.equal('tr');
    });

    it('should not set invalid language', () => {
      const originalLang = Store.language;
      Store.setLanguage('invalid');
      expect(Store.language).to.equal(originalLang);
    });
  });

  describe('translation method', () => {
    it('should return translation for current language', () => {
      Store.language = 'en';
      const result = Store.t('employees');
      expect(result).to.equal('Employees');
    });

    it('should return translation for Turkish', () => {
      Store.language = 'tr';
      const result = Store.t('employees');
      expect(result).to.equal('Çalışanlar');
    });
  });

  describe('getCurrentLanguage method', () => {
    it('should return current language', () => {
      Store.language = 'tr';
      expect(Store.getCurrentLanguage()).to.equal('tr');
    });

    it('should return updated language after change', () => {
      Store.setLanguage('en');
      expect(Store.getCurrentLanguage()).to.equal('en');

      Store.setLanguage('tr');
      expect(Store.getCurrentLanguage()).to.equal('tr');
    });
  });

  describe('addEmployee method', () => {
    it('should add employee with auto-generated ID', () => {
      const employeeData = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'test@example.com',
        phone: '+(90) 532 000 00 00',
        department: 'Tech',
        position: 'Junior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      const result = Store.addEmployee(employeeData);

      expect(result).to.have.property('id');
      expect(result.id).to.equal(1);
      expect(result.firstName).to.equal('Test');
      expect(Store.employees).to.have.length(1);
      expect(Store.employees[0]).to.deep.equal(result);
    });

    it('should generate incremental IDs', () => {
      const employee1 = Store.addEmployee({
        firstName: 'Employee1',
        email: 'emp1@test.com',
      });
      const employee2 = Store.addEmployee({
        firstName: 'Employee2',
        email: 'emp2@test.com',
      });

      expect(employee1.id).to.equal(1);
      expect(employee2.id).to.equal(2);
      expect(Store.employees).to.have.length(2);
    });
  });

  describe('updateEmployee method', () => {
    beforeEach(() => {
      Store.employees = [...mockEmployeesData];
    });

    it('should update existing employee', () => {
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
        phone: '+(90) 532 999 99 99',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      const result = Store.updateEmployee(1, updatedData);

      expect(result).to.exist;
      expect(result.id).to.equal(1);
      expect(result.firstName).to.equal('Updated');
      expect(Store.employees[0]).to.deep.equal(result);
    });
  });

  describe('deleteEmployee method', () => {
    beforeEach(() => {
      Store.employees = [...mockEmployeesData];
    });

    it('should delete existing employee', () => {
      const result = Store.deleteEmployee(2);

      expect(result).to.exist;
      expect(result.id).to.equal(2);
      expect(result.firstName).to.equal('Zeynep');
      expect(Store.employees).to.have.length(2);
      expect(Store.employees.find(emp => emp.id === 2)).to.be.undefined;
    });
  });

  describe('getEmployee method', () => {
    beforeEach(() => {
      Store.employees = [...mockEmployeesData];
    });

    it('should return employee by ID', () => {
      const result = Store.getEmployee(2);
      expect(result).to.exist;
      expect(result.id).to.equal(2);
      expect(result.firstName).to.equal('Zeynep');
    });

    it('should return undefined for non-existent employee', () => {
      const result = Store.getEmployee(999);
      expect(result).to.be.undefined;
    });
  });

  describe('searchEmployees method', () => {
    beforeEach(() => {
      Store.employees = [...mockEmployeesData];
    });

    it('should return all employees when no query', () => {
      const result = Store.searchEmployees('');
      expect(result).to.have.length(3);
      expect(result).to.deep.equal(mockEmployeesData);
    });

    it('should search by first name', () => {
      const result = Store.searchEmployees('Ahmet');
      expect(result).to.have.length(1);
      expect(result[0].firstName).to.equal('Ahmet');
    });

    it('should search by last name', () => {
      const result = Store.searchEmployees('Kaya');
      expect(result).to.have.length(1);
      expect(result[0].lastName).to.equal('Kaya');
    });

    it('should search by email', () => {
      const result = Store.searchEmployees('ahmet@sourtimes.org');
      expect(result).to.have.length(1);
      expect(result[0].email).to.equal('ahmet@sourtimes.org');
    });

    it('should search by department', () => {
      const result = Store.searchEmployees('Analytics');
      expect(result).to.have.length(2); // Ahmet and Mehmet
      expect(result.every(emp => emp.department === 'Analytics')).to.be.true;
    });

    it('should search by position', () => {
      const result = Store.searchEmployees('Senior');
      expect(result).to.have.length(1);
      expect(result[0].position).to.equal('Senior');
    });

    it('should be case insensitive', () => {
      const result = Store.searchEmployees('AHMET');
      expect(result).to.have.length(1);
      expect(result[0].firstName).to.equal('Ahmet');
    });

    it('should handle partial matches', () => {
      const result = Store.searchEmployees('Ahm');
      expect(result).to.have.length(1);
      expect(result[0].firstName).to.equal('Ahmet');
    });
  });

  describe('isEmailUnique method', () => {
    beforeEach(() => {
      Store.employees = [...mockEmployeesData];
    });

    it('should return true for unique email', () => {
      const result = Store.isEmailUnique('unique@example.com');
      expect(result).to.be.true;
    });

    it('should return false for existing email', () => {
      const result = Store.isEmailUnique('ahmet@sourtimes.org');
      expect(result).to.be.false;
    });
  });

  describe('proxy functionality', () => {
    it('should trigger event when employees change', () => {
      const newEmployees = [...mockEmployeesData];
      Store.employees = newEmployees;

      expect(mockEventListeners.employeeschange).to.exist;
      expect(mockEventListeners.employeeschange.detail.employees).to.deep.equal(
        newEmployees,
      );
    });

    it('should trigger event when language changes', () => {
      Store.language = 'tr';

      expect(mockEventListeners.languagechange).to.exist;
      expect(mockEventListeners.languagechange.detail.language).to.equal('tr');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete employee lifecycle', () => {
      const newEmployee = Store.addEmployee({
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        phone: '+(90) 532 000 00 00',
        department: 'Tech',
        position: 'Junior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      });

      expect(Store.employees).to.have.length(1);
      expect(newEmployee.id).to.equal(1);

      const retrieved = Store.getEmployee(1);
      expect(retrieved).to.deep.equal(newEmployee);

      const updated = Store.updateEmployee(1, {
        ...newEmployee,
        firstName: 'Updated',
        position: 'Senior',
      });

      expect(updated.firstName).to.equal('Updated');
      expect(updated.position).to.equal('Senior');

      const searchResults = Store.searchEmployees('Updated');
      expect(searchResults).to.have.length(1);
      expect(searchResults[0]).to.deep.equal(updated);

      const deleted = Store.deleteEmployee(1);
      expect(deleted).to.deep.equal(updated);
      expect(Store.employees).to.have.length(0);
    });
  });
});
