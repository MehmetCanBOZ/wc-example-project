import { expect } from '@open-wc/testing';
import API from '../../src/services/API.js';

describe('API Service', () => {
  let originalFetch;
  let mockEmployeesData;

  beforeEach(() => {
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

    originalFetch = window.fetch;

    localStorage.clear();
  });

  afterEach(() => {
    window.fetch = originalFetch;

    localStorage.clear();
  });

  describe('API configuration', () => {
    it('should have correct URL configuration', () => {
      expect(API.url).to.equal('src/data/employees.json');
    });
  });

  describe('fetchEmployees', () => {
    it('should fetch employees successfully', async () => {
      window.fetch = async url => {
        expect(url).to.equal('src/data/employees.json');
        return {
          json: async () => mockEmployeesData,
        };
      };

      const result = await API.fetchEmployees();

      expect(result).to.deep.equal(mockEmployeesData);
      expect(result).to.have.length(2);
      expect(result[0].firstName).to.equal('Ahmet');
      expect(result[1].firstName).to.equal('Zeynep');
    });
  });
});
