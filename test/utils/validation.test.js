import { expect } from '@open-wc/testing';
import {
  validationRules,
  validateField,
  validateForm,
} from '../../src/utils/validation.js';

describe('Validation Utils', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = {
      employees: [
        {
          id: 1,
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet@example.com',
          phone: '+(90) 532 123 45 67',
          department: 'Tech',
          position: 'Senior',
          dateOfEmployment: '2022-01-01',
          dateOfBirth: '1990-01-01',
        },
        {
          id: 2,
          firstName: 'Mehmet',
          lastName: 'Demir',
          email: 'mehmet@example.com',
          phone: '+(90) 533 234 56 78',
          department: 'Analytics',
          position: 'Junior',
          dateOfEmployment: '2023-01-01',
          dateOfBirth: '1995-01-01',
        },
      ],
      isEmailUnique(email, excludeId = null) {
        return !this.employees.some(
          emp =>
            emp.email.toLowerCase() === email.toLowerCase() &&
            emp.id !== excludeId,
        );
      },
    };
  });

  describe('validationRules', () => {
    describe('required', () => {
      it('should return true for non-empty strings', () => {
        expect(validationRules.required('test')).to.be.true;
        expect(validationRules.required('a')).to.be.true;
      });

      it('should return false for empty strings', () => {
        expect(validationRules.required('')).to.be.false;
        expect(validationRules.required('   ')).to.be.false;
      });

      it('should return false for null/undefined', () => {
        expect(validationRules.required(null)).to.be.false;
        expect(validationRules.required(undefined)).to.be.false;
      });

      it('should handle numbers', () => {
        expect(validationRules.required(0)).to.be.true;
        expect(validationRules.required(123)).to.be.true;
      });
    });

    describe('email', () => {
      it('should validate correct email formats', () => {
        expect(validationRules.email('test@example.com')).to.be.true;
        expect(validationRules.email('user.name@domain.co.uk')).to.be.true;
        expect(validationRules.email('user+tag@example.org')).to.be.true;
        expect(validationRules.email('123@456.com')).to.be.true;
      });

      it('should reject invalid email formats', () => {
        expect(validationRules.email('invalid')).to.be.false;
        expect(validationRules.email('test@')).to.be.false;
        expect(validationRules.email('@example.com')).to.be.false;
        expect(validationRules.email('test@.com')).to.be.false;
        expect(validationRules.email('test.example.com')).to.be.false;
        expect(validationRules.email('test @example.com')).to.be.false; // space
      });
    });

    describe('phone', () => {
      it('should validate Turkish phone number formats', () => {
        expect(validationRules.phone('+90 532 123 45 67')).to.be.true;
        expect(validationRules.phone('0532 123 45 67')).to.be.true;
        expect(validationRules.phone('(532) 123 45 67')).to.be.true;
        expect(validationRules.phone('532 123 45 67')).to.be.true;
        expect(validationRules.phone('5321234567')).to.be.true;
      });

      it('should reject invalid phone formats', () => {
        expect(validationRules.phone('123')).to.be.false;
        expect(validationRules.phone('abc def ghij')).to.be.false;
        expect(validationRules.phone('+1 555 123 4567')).to.be.false;
        expect(validationRules.phone('')).to.be.false;
      });
    });

    describe('date', () => {
      it('should validate correct date formats', () => {
        expect(validationRules.date('2023-01-01')).to.be.true;
        expect(validationRules.date('2023-12-31')).to.be.true;
        expect(validationRules.date('1990-06-15')).to.be.true;
      });
    });
  });

  describe('validateField', () => {
    it('should validate required fields', () => {
      const errors = validateField('', ['required'], 'firstName');

      expect(errors).to.include('firstNameRequired');
    });

    it('should validate email fields', () => {
      const errors = validateField('invalid-email', ['email'], 'email');

      expect(errors).to.include('emailInvalid');
    });

    it('should validate phone fields', () => {
      const errors = validateField('123', ['phone'], 'phone');

      expect(errors).to.include('phoneInvalid');
    });

    it('should validate date fields', () => {
      const errors = validateField('invalid-date', ['date'], 'dateOfBirth');

      expect(errors).to.include('dateInvalid');
    });

    it('should validate email uniqueness', () => {
      const errors = validateField(
        'ahmet@example.com',
        ['unique-email'],
        'email',
        mockStore,
      );

      expect(errors).to.include('emailNotUnique');
    });

    it('should pass email uniqueness check when email is unique', () => {
      const errors = validateField(
        'unique@email.com',
        ['unique-email'],
        'email',
        mockStore,
      );

      expect(errors).to.not.include('emailNotUnique');
    });

    it('should not validate format for empty optional fields', () => {
      const errors = validateField('', ['email'], 'email');

      expect(errors).to.be.empty;
    });

    it('should validate format for non-empty fields', () => {
      const errors = validateField('invalid', ['email'], 'email');

      expect(errors).to.include('emailInvalid');
    });
  });

  describe('validateForm', () => {
    it('should validate all required fields', () => {
      const formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        dateOfEmployment: '',
        dateOfBirth: '',
      };

      const errors = validateForm(formData, mockStore);

      expect(errors).to.have.property('firstName');
      expect(errors).to.have.property('lastName');
      expect(errors).to.have.property('email');
      expect(errors).to.have.property('phone');
      expect(errors).to.have.property('department');
      expect(errors).to.have.property('position');
      expect(errors).to.have.property('dateOfEmployment');
      expect(errors).to.have.property('dateOfBirth');
    });

    it('should return no errors for valid form data', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      const errors = validateForm(formData, mockStore);

      expect(Object.keys(errors)).to.have.length(0);
    });

    it('should validate email format and uniqueness', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      const errors = validateForm(formData, mockStore);

      expect(errors.email).to.include('emailInvalid');
    });

    it('should validate phone format', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: 'invalid-phone',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      const errors = validateForm(formData, mockStore);

      expect(errors.phone).to.include('phoneInvalid');
    });

    it('should validate date formats', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: 'invalid-date',
        dateOfBirth: 'invalid-date',
      };

      const errors = validateForm(formData, mockStore);

      expect(errors.dateOfEmployment).to.include('dateInvalid');
      expect(errors.dateOfBirth).to.include('dateInvalid');
    });

    it('should handle missing store parameter', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '+(90) 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      };

      const errors = validateForm(formData);

      expect(Object.keys(errors)).to.have.length(0);
    });
  });

  describe('position validation', () => {
    it('should accept valid positions', () => {
      const errors = validateField('Junior', ['required'], 'position');
      expect(errors).to.be.empty;

      const errors2 = validateField('Senior', ['required'], 'position');
      expect(errors2).to.be.empty;

      const errors3 = validateField('Medior', ['required'], 'position');
      expect(errors3).to.be.empty;
    });

    it('should require position field', () => {
      const errors = validateField('', ['required'], 'position');
      expect(errors).to.include('positionRequired');
    });
  });
});
