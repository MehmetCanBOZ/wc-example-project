import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { formatDate, debounce, paginate } from '../utils/formatters.js';
import { sanitizeInput } from '../utils/security.js';

const styles = css`
  :host {
    display: block;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .title {
    font-size: 1.4rem;
    color: #ff6200;
    margin: 0;
    font-weight: 400;
  }

  .controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-box {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    min-width: 250px;
    transition: border-color 0.3s ease;
  }

  .search-box:focus {
    outline: none;
    border-color: #ff6200;
  }

  .view-toggle {
    display: flex;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 4px;
  }

  .toggle-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 2.5rem;
    color: #f3a777;
  }

  .toggle-btn.active {
    color: #ff6200;
  }

  .table-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background-color: #f8f9fa;
    padding: 1.5rem;
    font-weight: 400;
    color: #ff6200;
    border-bottom: 2px solid #e9ecef;
    white-space: nowrap;
    text-transform: center;
  }

  td {
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
    color: #555;
    text-align: center;
  }

  tr:hover {
    background-color: #f8f9fa;
  }

  /* Grid View Styles */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 3rem 8rem;
    margin-top: 1rem;
  }

  .employee-card {
    background: white;
    border-radius: 4px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    border: 1px solid #f0f0f0;
  }

  .employee-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .card-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 2rem;
  }

  .card-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .field-label {
    font-weight: 500;
    color: #888;
    font-size: 1rem;
    letter-spacing: 0.5px;
  }

  .field-value {
    color: #333;
    font-size: 1rem;
    font-weight: 500;
  }

  .grid-actions {
    display: flex;
    gap: 1rem;
    justify-content: start;
    margin-top: 1rem;
  }

  .grid-action-btn {
    border: none;
    border-radius: 8px;
    background-color: transparent;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: white;
  }

  .grid-action-btn svg {
    width: 24px;
    height: 24px;
    fill: white;
  }

  .grid-edit-btn {
    background-color: #562086;
  }

  .grid-edit-btn:hover {
    background-color: #3a105f;
  }

  .grid-delete-btn {
    background-color: #ff6200;
  }

  .grid-delete-btn:hover {
    background-color: #e55a00;
  }

  .actions {
    display: flex;
    gap: 0;
    justify-content: start;
  }

  .action-btn {
    border: none;
    border-radius: 8px;
    background-color: transparent;
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 50px;
    justify-content: center;
    color: #ff6200;
  }

  .action-btn svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
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
    max-width: 450px;
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
    font-weight: 400;
    color: #ff6200;
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
  }

  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-end;
  }

  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background-color: #ff6200;
    color: white;
  }

  .btn-primary:hover {
    background-color: #e55a00;
  }

  .btn-secondary {
    background-color: transparent;
    color: #666;
    border: 2px solid #e0e0e0;
  }

  .btn-secondary:hover {
    background-color: #f5f5f5;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }

  .pagination-btn {
    border: none;
    background-color: transparent;
    color: black;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .pagination-btn:hover:not(:disabled) {
    border-color: #ff6200;
    color: #ff6200;
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: #ccc;
  }

  .pagination-nav {
    font-size: 1.5rem;
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff6200;
  }

  .pagination-number {
    padding: 0.5rem 1rem;
    min-width: 40px;
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination-number.active {
    background-color: #ff6200;
    color: white;
    border-color: #ff6200;
  }

  .pagination-number.active:hover {
    background-color: #e55a00;
    border-color: #e55a00;
    color: white;
  }

  .pagination-dots {
    padding: 0.5rem 0.75rem;
    color: #666;
    font-weight: 500;
  }

  .page-info {
    font-size: 0.9rem;
    color: #666;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .empty-column-header {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: stretch;
    }

    .controls {
      justify-content: space-between;
    }

    .search-box {
      min-width: auto;
      flex: 1;
    }

    .grid-container {
      grid-template-columns: 1fr;
    }

    .table-container {
      font-size: 0.8rem;
    }

    th,
    td {
      padding: 0.5rem;
    }
  }
`;

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    currentLanguage: { type: String },
    viewMode: { type: String },
    searchQuery: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    showDeleteModal: { type: Boolean },
    employeeToDelete: { type: Object },
  };

  static styles = styles;

  constructor() {
    super();
    this.employees = [];
    this.currentLanguage = window.app?.store?.getCurrentLanguage() || 'tr';
    this.viewMode = 'table';
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = this.viewMode === 'grid' ? 4 : 10;
    this.showDeleteModal = false;
    this.employeeToDelete = null;

    if (window.app?.store?.employees) {
      this.employees = window.app.store.employees;
    }

    this.debouncedSearch = debounce(query => {
      this.searchQuery = query;
      this.currentPage = 1;
    }, 300);
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('employeeschange', this.handleEmployeesChange);
    window.addEventListener('languagechange', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('employeeschange', this.handleEmployeesChange);
    window.removeEventListener('languagechange', this.handleLanguageChange);
  }

  handleEmployeesChange = event => {
    this.employees = event.detail.employees;
  };

  handleLanguageChange = event => {
    this.currentLanguage = event.detail.language;
  };

  handleSearch(e) {
    this.debouncedSearch(sanitizeInput(e.target.value));
  }

  toggleViewMode(mode) {
    this.viewMode = mode;
  }

  editEmployee(employee) {
    Router.go(`/edit/${employee.id}`);
    this.requestUpdate();
  }

  showDeleteConfirmation(employee) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  hideDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      window.app.store.deleteEmployee(this.employeeToDelete.id);
      this.hideDeleteModal();
    }
  }

  goToPage(page) {
    this.currentPage = page;
  }

  getFilteredEmployees() {
    const employees = this.employees || [];

    return this.searchQuery
      ? window.app.store.searchEmployees(this.searchQuery) || []
      : employees;
  }

  getPaginatedData() {
    const filteredEmployees = this.getFilteredEmployees();

    return paginate(filteredEmployees, this.currentPage, this.itemsPerPage);
  }

  // eslint-disable-next-line class-methods-use-this
  renderTableView(paginatedData) {
    const items = paginatedData?.items || [];

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th><span class="empty-column-header">Select</span></th>
              <th>${window.app.store.t('firstName')}</th>
              <th>${window.app.store.t('lastName')}</th>
              <th>${window.app.store.t('dateOfEmployment')}</th>
              <th>${window.app.store.t('dateOfBirth')}</th>
              <th>${window.app.store.t('phone')}</th>
              <th>${window.app.store.t('email')}</th>
              <th>${window.app.store.t('department')}</th>
              <th>${window.app.store.t('position')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(
              employee => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Select ${employee.firstName} ${employee.lastName}"
                    />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${formatDate(employee.dateOfEmployment)}</td>
                  <td>${formatDate(employee.dateOfBirth)}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td>
                    <div class="actions">
                      <button
                        class="action-btn"
                        @click=${() => this.editEmployee(employee)}
                        aria-label="Edit ${employee.firstName} ${employee.lastName}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          width="24px"
                          height="24px"
                          fill="#ff6200"
                      >
                        <path
                          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"
                        />
                        </svg>
                      </button>
                      <button
                        class="action-btn"
                        @click=${() => this.showDeleteConfirmation(employee)}
                        aria-label="Delete ${employee.firstName} ${employee.lastName}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24px"
                          height="24px"
                          fill="#ff6200"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  renderGridView(paginatedData) {
    const items = paginatedData?.items || [];

    return html`
      <div class="grid-container">
        ${items.map(
          employee => html`
            <div class="employee-card">
              <div class="card-content">
                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('firstName')}</span
                  >
                  <span class="field-value"> ${employee.firstName}</span>
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('lastName')}</span
                  >
                  <span class="field-value"> ${employee.lastName}</span>
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('dateOfEmployment')}</span
                  >
                  <span class="field-value"
                    >${formatDate(employee.dateOfEmployment)}</span
                  >
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('dateOfBirth')}</span
                  >
                  <span class="field-value"
                    >${formatDate(employee.dateOfBirth)}</span
                  >
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('phone')}</span
                  >
                  <span class="field-value">${employee.phone}</span>
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('email')}</span
                  >
                  <span class="field-value">${employee.email}</span>
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('department')}</span
                  >
                  <span class="field-value">${employee.department}</span>
                </div>

                <div class="card-field">
                  <span class="field-label"
                    >${window.app.store.t('position')}</span
                  >
                  <span class="field-value">${employee.position}</span>
                </div>
              </div>

              <div class="grid-actions">
                <button
                  class="grid-action-btn grid-edit-btn"
                  @click=${() => this.editEmployee(employee)}
                  aria-label="Edit ${employee.firstName} ${employee.lastName}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path
                      d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"
                    />
                  </svg>
                  ${window.app.store.t('edit')}
                </button>
                <button
                  class="grid-action-btn grid-delete-btn"
                  @click=${() => this.showDeleteConfirmation(employee)}
                  aria-label="Delete ${employee.firstName} ${employee.lastName}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                  ${window.app.store.t('delete')}
                </button>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  renderPagination(paginatedData) {
    if (!paginatedData || paginatedData.totalPages <= 1) return html``;

    const { currentPage, totalPages } = paginatedData;

    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 3;
      if (totalPages <= maxVisible) {
        // eslint-disable-next-line no-plusplus
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        const start = Math.max(2, currentPage - 2);

        const end = Math.min(totalPages - 1, currentPage + 2);

        if (start > 2) {
          pages.push('...');
        }
        // eslint-disable-next-line no-plusplus
        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== totalPages) {
            pages.push(i);
          }
        }
        if (end < totalPages - 1) {
          pages.push('...');
        }

        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const visiblePages = getVisiblePages();

    return html`
      <div class="pagination">
        <button
          class="pagination-btn pagination-nav"
          ?disabled=${!paginatedData.hasPrev}
          @click=${() => this.goToPage(currentPage - 1)}
          aria-label="Previous page"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        ${visiblePages.map(page => {
          if (page === '...') {
            return html`<span class="pagination-dots">...</span>`;
          }

          return html`
            <button
              class="pagination-btn pagination-number ${currentPage === page
                ? 'active'
                : ''}"
              @click=${() => this.goToPage(page)}
              aria-label="Page ${page}"
              aria-current=${currentPage === page ? 'page' : 'false'}
            >
              ${page}
            </button>
          `;
        })}

        <button
          class="pagination-btn pagination-nav"
          ?disabled=${!paginatedData.hasNext}
          @click=${() => this.goToPage(currentPage + 1)}
          aria-label="Next page"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    `;
  }

  render() {
    this.itemsPerPage = this.viewMode === 'grid' ? 4 : 10;
    const paginatedData = this.getPaginatedData();

    const hasEmployees = paginatedData?.items?.length > 0;

    return html`
      <div class="header">
        <h1 class="title">${window.app.store.t('employeeList')}</h1>

        <div class="controls">
          <input
            type="text"
            class="search-box"
            placeholder="Search employees..."
            @input=${this.handleSearch}
          />

          <div class="view-toggle">
            <button
              class="toggle-btn ${this.viewMode === 'table' ? 'active' : ''}"
              @click=${() => this.toggleViewMode('table')}
              title="Table View"
            >
              ☰
            </button>
            <button
              class="toggle-btn ${this.viewMode === 'grid' ? 'active' : ''}"
              @click=${() => this.toggleViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      ${!hasEmployees
        ? html`<div class="empty-state">
            ${window.app.store.t('noEmployeesFound')}
          </div>`
        : html`
            ${this.viewMode === 'table'
              ? this.renderTableView(paginatedData)
              : this.renderGridView(paginatedData)}
          `}
      ${this.renderPagination(paginatedData)}
      ${this.showDeleteModal
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <div class="modal-header">
                  <h2 class="modal-title">
                    ${window.app.store.t('areYouSure')}
                  </h2>
                  <button class="close-btn" @click=${this.hideDeleteModal}>
                    ×
                  </button>
                </div>
                <div class="modal-content">
                  ${this.employeeToDelete
                    ? window.app.store.t('selectedEmployeeWillBeDeleted', {
                        name: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`,
                      })
                    : ''}
                </div>
                <div class="modal-actions">
                  <button class="btn btn-primary" @click=${this.confirmDelete}>
                    ${window.app.store.t('proceed')}
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click=${this.hideDeleteModal}
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

customElements.define('employee-list', EmployeeList);
