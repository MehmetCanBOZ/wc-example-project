import { expect } from '@open-wc/testing';
import { loadData, getEmployeeById } from '../../src/services/Employee.js';

describe('Employee Service', () => {
  let mockEmployeesData;
  let originalApp;
  let originalFetch;

  beforeEach(() => {
    originalApp = window.app;
    originalFetch = window.fetch;

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

    window.app = {
      store: {
        employees: [],
      },
    };

    localStorage.clear();
  });

  afterEach(() => {
    if (originalApp !== undefined) {
      window.app = originalApp;
    } else {
      delete window.app;
    }

    window.fetch = originalFetch;
    // Clear localStorage
    localStorage.clear();
  });

  describe('loadData function', () => {
    it('should load employees from storage when available', async () => {
      localStorage.setItem('employees', JSON.stringify(mockEmployeesData));

      await loadData();

      expect(window.app.store.employees).to.deep.equal(mockEmployeesData);
      expect(window.app.store.employees).to.have.length(3);
      expect(window.app.store.employees[0].firstName).to.equal('Ahmet');
      expect(window.app.store.employees[1].firstName).to.equal('Zeynep');
      expect(window.app.store.employees[2].firstName).to.equal('Mehmet');
    });

    it('should fetch employees from API when storage is empty', async () => {
      localStorage.removeItem('employees');

      window.fetch = async () => ({
        json: async () => mockEmployeesData,
      });

      await loadData();

      expect(window.app.store.employees).to.deep.equal(mockEmployeesData);
      expect(window.app.store.employees).to.have.length(3);
    });

    it('should fetch employees from API when storage has empty array', async () => {
      localStorage.setItem('employees', JSON.stringify([]));

      window.fetch = async () => ({
        json: async () => mockEmployeesData,
      });

      await loadData();

      expect(window.app.store.employees).to.deep.equal(mockEmployeesData);
      expect(window.app.store.employees).to.have.length(3);
    });
  });

  describe('getEmployeeById function', () => {
    beforeEach(async () => {
      window.app.store.employees = mockEmployeesData;
    });

    it('should return employee by ID', async () => {
      const employee = await getEmployeeById(1);

      expect(employee).to.exist;
      expect(employee.id).to.equal(1);
      expect(employee.firstName).to.equal('Ahmet');
      expect(employee.lastName).to.equal('Sourtimes');
      expect(employee.email).to.equal('ahmet@sourtimes.org');
    });

    it('should return null for non-existent ID', async () => {
      const employee = await getEmployeeById(999);

      expect(employee).to.be.null;
    });
  });
});
