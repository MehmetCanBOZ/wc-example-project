import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { validateForm } from '../utils/validation.js';
import { positions, formatDateForInput } from '../utils/formatters.js';

const emptyFormData = {
  firstName: '',
  lastName: '',
  dateOfEmployment: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  department: '',
  position: '',
};

class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { type: Object },
    formData: { type: Object },
    errors: { type: Object },
    currentLanguage: { type: String },
    isEdit: { type: Boolean },
    showConfirmModal: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .header {
      margin-bottom: 2rem;
    }

    .title {
      font-size: 1.25rem;
      color: #ff6200;
      margin: 0 0 0.5rem 0;
      font-weight: 400;
    }

    .subtitle {
      color: black;
      font-size: 1rem;
      padding: 1rem;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 1400px;
      min-height: 75vh;
    }

    .form-grid {
      display: grid;
      padding: 2rem 4rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 4rem 8rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .field-label {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .field-input {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      background-color: white;
      color: black;
    }

    .field-input:focus {
      outline: none;
      border-color: #ff6200;
    }

    .field-input.error {
      border-color: #dc3545;
    }

    .field-select {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      background-color: white;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .field-select:focus {
      outline: none;
      border-color: #ff6200;
    }

    .field-select.error {
      border-color: #dc3545;
    }

    .date-input {
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
    }

    .date-input:focus {
      outline: none;
      border-color: #ff6200;
    }

    .date-input.error {
      border-color: #dc3545;
    }

    .date-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #ff6200;
      font-size: 1.2rem;
      pointer-events: none;
    }

    .field-error {
      color: #dc3545;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 4rem;
      align-items: center;
      justify-content: center;
      margin-top: 5rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 320px;
    }

    .btn-primary {
      background-color: #e55a00;
      color: white;
    }

    .btn-primary:hover {
      background-color: #d54a00;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: transparent;
      color: #666;
      border: 2px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background-color: #f5f5f5;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .modal-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0.25rem;
    }

    .modal-content {
      margin-bottom: 2rem;
      color: #555;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1.5rem;
        margin: 0 -1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
    this.formData = emptyFormData;
    this.errors = {};
    this.currentLanguage = window.app?.store?.getCurrentLanguage() || 'tr';
    this.isEdit = false;
    this.showConfirmModal = false;
  }

  connectedCallback() {
    super.connectedCallback();

    if (window.app?.store) {
      this.currentLanguage = window.app.store.getCurrentLanguage();
    }

    window.addEventListener('languagechange', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('languagechange', this.handleLanguageChange);
  }

  handleLanguageChange = event => {
    this.currentLanguage = event.detail.language;
  };

  onBeforeEnter(location) {
    this.employeeId = location?.params?.id;
    this.isEdit = !!this.employeeId;

    if (this.isEdit) {
      this.employee = window.app.store.getEmployee(this.employeeId);

      if (this.employee) {
        this.formData = { ...this.employee };
      } else {
        Router.go('/employees');
        return;
      }
    } else {
      this.formData = emptyFormData;
    }

    this.errors = {};
  }

  handleFieldChange(field, value) {
    this.formData = {
      ...this.formData,
      [field]: value,
    };

    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: undefined,
      };
    }
  }

  validateAndSubmit() {
    const validationErrors = validateForm(
      this.formData,
      window.app.store,
      this.isEdit ? parseInt(this.employeeId, 10) : null,
    );

    this.errors = validationErrors;

    if (Object.keys(validationErrors).length === 0) {
      if (this.isEdit) {
        this.showConfirmModal = true;
      } else {
        this.submitForm();
      }
    }
  }

  submitForm() {
    try {
      if (this.isEdit) {
        window.app.store.updateEmployee(this.employeeId, this.formData);
      } else {
        window.app.store.addEmployee(this.formData);
      }

      Router.go('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  hideConfirmModal() {
    this.showConfirmModal = false;
  }

  confirmSubmit() {
    this.hideConfirmModal();
    this.submitForm();
  }

  getFieldError(field) {
    const fieldErrors = this.errors[field];
    if (!fieldErrors || fieldErrors.length === 0) return '';

    return window.app.store.t(fieldErrors[0]);
  }

  renderFormField(field, label, type = 'text', options = null) {
    const value = this.formData?.[field] || '';
    const hasError = this.errors?.[field] && this.errors[field].length > 0;
    const error = this.getFieldError(field);

    if (type === 'select') {
      return html`
        <div class="form-field">
          <label class="field-label" for="${field}"
            >${window.app.store.t(label)}</label
          >
          <select
            id="${field}"
            class="field-select ${hasError ? 'error' : ''}"
            @change=${e => this.handleFieldChange(field, e.target.value)}
          >
            <option value="">${window.app.store.t('pleaseSelect')}</option>
            ${options.map(
              option => html`
                <option value="${option}" ?selected=${value === option}>
                  ${window.app.store.t(option.toLowerCase())}
                </option>
              `,
            )}
          </select>
          ${error ? html`<div class="field-error">${error}</div>` : ''}
        </div>
      `;
    }

    if (type === 'date') {
      return html`
        <div class="form-field">
          <label class="field-label" for="${field}"
            >${window.app.store.t(label)}</label
          >
          <input
            id="${field}"
            type="date"
            class="date-input ${hasError ? 'error' : ''}"
            .value=${formatDateForInput(value)}
            @change=${e => this.handleFieldChange(field, e.target.value)}
          />
          ${error ? html`<div class="field-error">${error}</div>` : ''}
        </div>
      `;
    }

    const getInputType = inputType => {
      switch (inputType) {
        case 'email':
        case 'tel':
        case 'password':
        case 'search':
        case 'url':
        case 'number':
        case 'text':
          return inputType;
        default:
          return 'text';
      }
    };

    return html`
      <div class="form-field">
        <label class="field-label" for="${field}"
          >${window.app.store.t(label)}</label
        >
        <input
          id="${field}"
          type="${getInputType(type)}"
          class="field-input ${hasError ? 'error' : ''}"
          .value=${value}
          @input=${e => this.handleFieldChange(field, e.target.value)}
        />
        ${error ? html`<div class="field-error">${error}</div>` : ''}
      </div>
    `;
  }

  render() {
    const title = this.isEdit
      ? window.app.store.t('editEmployee')
      : window.app.store.t('addEmployee');

    const subtitle = this.isEdit
      ? `${window.app.store.t('youAreEditing')} ${this.formData.firstName} ${this.formData.lastName}`
      : '';

    return html`
      <div class="header">
        <h1 class="title">${title}</h1>
      </div>

      <div class="form-container">
        ${subtitle ? html`<p class="subtitle">${subtitle}</p>` : ''}
        <div class="form-grid">
          ${this.renderFormField('firstName', 'firstName')}
          ${this.renderFormField('lastName', 'lastName')}
          ${this.renderFormField(
            'dateOfEmployment',
            'dateOfEmployment',
            'date',
          )}
          ${this.renderFormField('dateOfBirth', 'dateOfBirth', 'date')}
          ${this.renderFormField('phone', 'phone', 'tel')}
          ${this.renderFormField('email', 'email', 'email')}
          ${this.renderFormField('department', 'department')}
          ${this.renderFormField('position', 'position', 'select', positions)}
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click=${this.validateAndSubmit}>
            ${window.app.store.t('save')}
          </button>
          <button
            class="btn btn-secondary"
            @click=${() => Router.go('/employees')}
          >
            ${window.app.store.t('cancel')}
          </button>
        </div>
      </div>

      ${this.showConfirmModal
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <div class="modal-header">
                  <h2 class="modal-title">Confirm Update</h2>
                  <button class="close-btn" @click=${this.hideConfirmModal}>
                    &times;
                  </button>
                </div>
                <div class="modal-content">
                  ${html`Are you sure you want to update the employee
                    information for
                    <strong
                      >${this.formData.firstName}
                      ${this.formData.lastName}</strong
                    >?`}
                </div>
                <div class="modal-actions">
                  <button class="btn btn-primary" @click=${this.confirmSubmit}>
                    ${window.app.store.t('save')}
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click=${this.hideConfirmModal}
                  >
                    ${window.app.store.t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
