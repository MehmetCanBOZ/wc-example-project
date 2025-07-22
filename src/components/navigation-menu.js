import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

class NavigationMenu extends LitElement {
  static properties = {
    currentLanguage: { type: String },
    currentRoute: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .nav-header {
      background-color: white;
      color: #ff6200;
      padding: 0.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 5px 4px rgba(0, 0, 0, 0.1);
      height: auto;
    }

    .nav-section {
      display: flex;
      align-items: center;
    }

    .nav-button {
      background-color: transparent;
      color: white;
      padding: 0.5rem 1.5rem;
      border: none;
      cursor: pointer;
      font-weight: 400;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #f3a777;
    }

    .nav-button-logo {
      color: #ff6200;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav-button-icon {
      width: 24px;
      height: 24px;
      fill: #f3a777;
      transition: fill 0.3s ease;
    }

    .nav-button:hover {
      color: #ff6200;
    }

    .nav-button:hover .nav-button-icon {
      fill: #ff6200;
    }

    .nav-button.active,
    .active {
      color: #ff6200;
    }

    .nav-button.active .nav-button-icon,
    .nav-button-icon.active {
      fill: #ff6200;
    }

    .language-toggle {
      background: none;
      color: white;
      padding: 0.3rem 0.8rem;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .nav-header {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .nav-section {
        width: 100%;
        justify-content: center;
      }

      .nav-button {
        padding: 0.4rem 1rem;
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .nav-section {
        flex-direction: column;
        gap: 0.5rem;
      }

      .nav-button {
        width: 100%;
        justify-content: center;
      }

      .language-toggle {
        align-self: center;
        margin-top: 0.5rem;
      }
    }
  `;

  constructor() {
    super();
    this.currentLanguage = window.app?.store?.getCurrentLanguage() || 'tr';
    this.currentRoute = '/';
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('languagechange', this.handleLanguageChange);

    window.addEventListener(
      'vaadin-router-location-changed',
      this.handleRouteChange,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('languagechange', this.handleLanguageChange);
    window.removeEventListener(
      'vaadin-router-location-changed',
      this.handleRouteChange,
    );
  }

  handleLanguageChange = event => {
    this.currentLanguage = event.detail.language;
  };

  handleRouteChange = event => {
    this.currentRoute = event.detail.location.pathname;
  };

  toggleLanguage() {
    const newLang = this.currentLanguage === 'en' ? 'tr' : 'en';
    window.app.store.setLanguage(newLang);
  }

  render() {
    return html`
      <div class="nav-header">
        <a
          href="/"
          class="nav-button nav-button-logo"
          @click=${e => {
            e.preventDefault();
            Router.go('/');
          }}
          aria-label="${window.app?.store?.t('home')}"
        >
          bank
        </a>

        <div class="nav-section">
          <a
            href="/employees"
            class="nav-button ${this.currentRoute === '/employees'
              ? 'active'
              : ''}"
            @click=${e => {
              e.preventDefault();
              Router.go('/employees');
            }}
            aria-label="${window.app?.store?.t('employees')}"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              class="nav-button-icon ${this.currentRoute === '/employees'
                ? 'active'
                : ''}"
              aria-hidden="true"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            ${window.app?.store?.t('employees')}
          </a>

          <a
            href="/add"
            class="nav-button ${this.currentRoute === '/add' ? 'active' : ''}"
            @click=${e => {
              e.preventDefault();
              Router.go('/add');
            }}
            aria-label="${window.app?.store?.t('addNew')}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="nav-button-icon ${this.currentRoute === '/add'
                ? 'active'
                : ''}"
              aria-hidden="true"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            ${window.app?.store?.t('addNew')}
          </a>

          <button class="language-toggle" @click=${this.toggleLanguage}>
            ${this.currentLanguage === 'tr' ? '🇹🇷' : '🇺🇸'}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
