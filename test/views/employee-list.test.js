import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../src/views/employee-list.js';

describe('EmployeeList', () => {
  let element;

  beforeEach(async () => {
    window.app = {
      store: {
        employees: [
          {
            id: 1,
            firstName: 'Ahmet',
            lastName: 'Sourtimes',
            email: 'ahmet@sourtimes.org',
            phone: '+(90) 532 123 45 67',
            department: 'Analytics',
            position: 'Junior',
            dateOfEmployment: '2022-09-23',
            dateOfBirth: '1990-03-15',
          },
          {
            id: 2,
            firstName: 'Zeynep',
            lastName: 'Kaya',
            email: 'zeynep.kaya@kaya.com',
            phone: '+(90) 545 234 56 78',
            department: 'Tech',
            position: 'Senior',
            dateOfEmployment: '2021-06-12',
            dateOfBirth: '1988-07-22',
          },
        ],
        getCurrentLanguage: () => 'en',
        t: key => {
          const translations = {
            employeeList: 'Employee List',
            employees: 'Employees',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            department: 'Department',
            position: 'Position',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            areYouSure: 'Are you sure?',
            selectedEmployeeWillBeDeleted:
              'Selected Employee record of {name} will be deleted',
            proceed: 'Proceed',
            cancel: 'Cancel',
            noEmployeesFound: 'No employees found.',
          };
          return translations[key] || key;
        },
      },
    };

    element = await fixture(html`<employee-list></employee-list>`);
    await element.updateComplete;
  });

  afterEach(() => {
    delete window.app;
  });

  describe('rendering', () => {
    it('should render the component', () => {
      expect(element).to.exist;
    });

    it('should render the title', () => {
      const title = element.shadowRoot.querySelector('.title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Employee List');
    });

    it('should render search box', () => {
      const searchBox = element.shadowRoot.querySelector('.search-box');
      expect(searchBox).to.exist;
    });

    it('should render view toggle buttons', () => {
      const toggleBtns = element.shadowRoot.querySelectorAll('.toggle-btn');
      expect(toggleBtns).to.have.length(2);
    });

    it('should render table view by default', () => {
      const tableContainer =
        element.shadowRoot.querySelector('.table-container');
      expect(tableContainer).to.exist;
    });
  });

  describe('employee data display', () => {
    it('should display employees in table view', () => {
      const rows = element.shadowRoot.querySelectorAll('tbody tr');
      expect(rows.length).to.be.greaterThan(0);

      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');
      expect(cells[1].textContent).to.include('Ahmet');
      expect(cells[2].textContent).to.include('Sourtimes');
    });

    it('should display action buttons for each employee', () => {
      const actionBtns = element.shadowRoot.querySelectorAll('.action-btn');
      expect(actionBtns.length).to.be.greaterThan(0);
    });
  });

  describe('search functionality', () => {
    it('should handle search input', async () => {
      const searchBox = element.shadowRoot.querySelector('.search-box');
      expect(searchBox).to.exist;

      searchBox.value = 'Ahmet';
      searchBox.dispatchEvent(new Event('input'));

      expect(() => {
        element.handleSearch({ target: { value: 'Ahmet' } });
      }).to.not.throw();
    });
  });

  describe('view mode toggle', () => {
    it('should toggle between table and grid view', async () => {
      expect(element.viewMode).to.equal('table');

      element.toggleViewMode('grid');
      await element.updateComplete;

      expect(element.viewMode).to.equal('grid');
    });
  });

  describe('delete functionality', () => {
    it('should show delete confirmation modal', async () => {
      const employee = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
      };

      element.showDeleteConfirmation(employee);

      expect(element.showDeleteModal).to.be.true;
      expect(element.employeeToDelete).to.equal(employee);
    });

    it('should close modal when cancel is clicked', async () => {
      element.showDeleteConfirmation({
        id: 1,
        firstName: 'Test',
        lastName: 'User',
      });

      element.hideDeleteModal();

      expect(element.showDeleteModal).to.be.false;
    });
  });

  describe('pagination', () => {
    it('should handle pagination', () => {
      expect(element.currentPage).to.equal(1);

      element.goToPage(2);
      expect(element.currentPage).to.equal(2);
    });
  });
});
