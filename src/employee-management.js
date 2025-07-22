import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './components/navigation-menu.js';
import './views/employee-list.js';
import './views/employee-form.js';

class EmployeeManagement extends LitElement {
  static properties = {
    currentLanguage: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1500px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }
    }
  `;

  constructor() {
    super();
    this.currentLanguage = window.app?.store?.getCurrentLanguage() || 'tr';
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

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#management'));

    router.setRoutes([
      { path: '/', component: 'employee-list' },
      { path: '/employees', component: 'employee-list' },
      { path: '/add', component: 'employee-form' },
      { path: '/edit/:id', component: 'employee-form' },
      { path: '(.*)', redirect: '/' },
    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>

      <main class="main-content">
        <div id="management"></div>
      </main>
    `;
  }
}

customElements.define('employee-management', EmployeeManagement);
