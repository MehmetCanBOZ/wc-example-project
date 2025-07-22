export const validationRules = {
  required: value => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'number') return true;
    return value.toString().trim().length > 0;
  },

  email: value => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: value => {
    if (!value) return false;
    // eslint-disable-next-line no-useless-escape
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+90|90|0)?[1-9]\d{9}$/;
    return phoneRegex.test(cleanPhone);
  },

  date: value => {
    if (!value) return false;
    const date = new Date(value);
    return date instanceof Date && date.getFullYear() > 1900;
  },
};

export const validateField = (
  value,
  rules,
  fieldName,
  employeeStore = null,
  excludeId = null,
) => {
  const errors = [];

  if (rules.includes('required') && !validationRules.required(value)) {
    errors.push(`${fieldName}Required`);
  }

  if (value && value.toString().trim()) {
    if (rules.includes('email') && !validationRules.email(value)) {
      errors.push('emailInvalid');
    }

    if (
      rules.includes('unique-email') &&
      employeeStore &&
      !employeeStore.isEmailUnique(value, excludeId)
    ) {
      errors.push('emailNotUnique');
    }

    if (rules.includes('phone') && !validationRules.phone(value)) {
      errors.push('phoneInvalid');
    }

    if (rules.includes('date') && !validationRules.date(value)) {
      errors.push('dateInvalid');
    }
  }

  return errors;
};

export const validateForm = (
  formData,
  employeeStore = null,
  excludeId = null,
) => {
  const validationConfig = {
    firstName: ['required'],
    lastName: ['required'],
    email: ['required', 'email', 'unique-email'],
    phone: ['required', 'phone'],
    department: ['required'],
    position: ['required'],
    dateOfEmployment: ['required', 'date'],
    dateOfBirth: ['required', 'date'],
  };

  const errors = {};

  for (const [field, rules] of Object.entries(validationConfig)) {
    const fieldErrors = validateField(
      formData[field],
      rules,
      field,
      employeeStore,
      excludeId,
    );
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return errors;
};
