import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../src/views/employee-form.js';

describe('EmployeeForm', () => {
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
        ],
        getCurrentLanguage: () => 'en',
        t: key => {
          const translations = {
            addEmployee: 'Add Employee',
            editEmployee: 'Edit Employee',
            youAreEditing: 'You are editing',
            save: 'Save',
            cancel: 'Cancel',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            department: 'Department',
            position: 'Position',
            dateOfEmployment: 'Date of Employment',
            dateOfBirth: 'Date of Birth',
            firstNameRequired: 'First name is required',
            lastNameRequired: 'Last name is required',
            emailRequired: 'Email is required',
            emailInvalid: 'Please enter a valid email address',
            emailNotUnique: 'This email address is already in use',
            phoneRequired: 'Phone number is required',
            phoneInvalid: 'Please enter a valid phone number',
            departmentRequired: 'Department is required',
            positionRequired: 'Position is required',
            dateOfEmploymentRequired: 'Date of employment is required',
            dateOfBirthRequired: 'Date of birth is required',
          };
          return translations[key] || key;
        },
        // eslint-disable-next-line arrow-body-style
        getEmployee: id => {
          return window.app.store.employees.find(
            emp => emp.id === parseInt(id, 10),
          );
        },
        // eslint-disable-next-line arrow-body-style
        isEmailUnique: (email, excludeId = null) => {
          return !window.app.store.employees.some(
            emp =>
              emp.email.toLowerCase() === email.toLowerCase() &&
              emp.id !== excludeId,
          );
        },
      },
    };

    element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;
  });

  afterEach(() => {
    delete window.app;
  });

  describe('rendering', () => {
    it('should render the component', () => {
      expect(element).to.exist;
    });

    it('should render add form by default', () => {
      const title = element.shadowRoot.querySelector('.title');
      expect(title.textContent).to.equal('Add Employee');
      expect(element.isEdit).to.be.false;
    });

    it('should render form action buttons', () => {
      const saveBtn = element.shadowRoot.querySelector('.btn-primary');
      const cancelBtn = element.shadowRoot.querySelector('.btn-secondary');

      expect(saveBtn).to.exist;
      expect(cancelBtn).to.exist;
      expect(saveBtn.textContent.trim()).to.equal('Save');
      expect(cancelBtn.textContent.trim()).to.equal('Cancel');
    });
  });

  describe('form validation', () => {
    it('should show validation errors for empty required fields', async () => {
      element.validateAndSubmit();
      await element.updateComplete;

      expect(Object.keys(element.errors).length).to.be.greaterThan(0);
    });

    it('should validate email format', async () => {
      element.formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      element.validateAndSubmit();
      await element.updateComplete;

      expect(element.errors.email).to.include('emailInvalid');
    });
  });

  describe('form submission', () => {
    it('should handle valid form submission', async () => {
      element.formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      expect(() => {
        element.submitForm();
      }).to.not.throw();
    });
  });

  describe('edit mode', () => {
    beforeEach(async () => {
      const mockLocation = {
        params: { id: '1' },
      };

      element.onBeforeEnter(mockLocation);
      await element.updateComplete;
    });

    it('should set edit mode correctly', () => {
      expect(element.isEdit).to.be.true;
      expect(element.employeeId).to.equal('1');
    });

    it('should load employee data', () => {
      expect(element.formData.firstName).to.equal('Ahmet');
      expect(element.formData.lastName).to.equal('Sourtimes');
      expect(element.formData.email).to.equal('ahmet@sourtimes.org');
    });
  });
});
