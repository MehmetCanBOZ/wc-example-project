import { expect, fixture, html } from '@open-wc/testing';
import { Router } from '@vaadin/router';
import '../../src/components/navigation-menu.js';

describe('NavigationMenu Component', () => {
  let element;
  let mockStore;
  let originalApp;
  let mockRouterCalls;

  beforeEach(async () => {
    originalApp = window.app;

    mockRouterCalls = [];
    Router.go = route => {
      mockRouterCalls.push(route);
    };

    mockStore = {
      language: 'en',
      getCurrentLanguage: () => mockStore.language,
      setLanguage: lang => {
        mockStore.language = lang;
        window.dispatchEvent(
          new CustomEvent('languagechange', {
            detail: { language: lang },
          }),
        );
      },
      t: key => {
        const translations = {
          home: mockStore.language === 'tr' ? 'Ana Sayfa' : 'Home',
          employees: mockStore.language === 'tr' ? 'Çalışanlar' : 'Employees',
          addNew: mockStore.language === 'tr' ? 'Yeni Ekle' : 'Add New',
        };
        return translations[key] || key;
      },
    };

    window.app = {
      store: mockStore,
    };

    element = await fixture(html`<navigation-menu></navigation-menu>`);
  });

  afterEach(() => {
    if (originalApp !== undefined) {
      window.app = originalApp;
    } else {
      delete window.app;
    }

    if (element) {
      element.disconnectedCallback();
    }
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('navigation-menu');
    });

    it('should initialize with default properties', () => {
      expect(element.currentLanguage).to.equal('en');
      expect(element.currentRoute).to.equal('/');
    });

    it('should initialize with store language if available', async () => {
      mockStore.language = 'tr';
      const newElement = await fixture(
        html`<navigation-menu></navigation-menu>`,
      );

      expect(newElement.currentLanguage).to.equal('tr');
    });
  });

  describe('rendering', () => {
    it('should render navigation header', () => {
      const header = element.shadowRoot.querySelector('.nav-header');
      expect(header).to.exist;
    });

    it('should render logo link', () => {
      const logo = element.shadowRoot.querySelector('.nav-button-logo');
      expect(logo).to.exist;
      expect(logo.textContent.trim()).to.equal('bank');
      expect(logo.getAttribute('href')).to.equal('/');
    });

    it('should render employees link', () => {
      const employeesLink = element.shadowRoot.querySelector(
        'a[href="/employees"]',
      );
      expect(employeesLink).to.exist;
      expect(employeesLink.textContent.trim()).to.include('Employees');
    });

    it('should render add new link', () => {
      const addLink = element.shadowRoot.querySelector('a[href="/add"]');
      expect(addLink).to.exist;
      expect(addLink.textContent.trim()).to.include('Add New');
    });

    it('should render language toggle button', () => {
      const languageToggle =
        element.shadowRoot.querySelector('.language-toggle');
      expect(languageToggle).to.exist;
      expect(languageToggle.textContent.trim()).to.equal('🇺🇸');
    });

    it('should render navigation icons', () => {
      const icons = element.shadowRoot.querySelectorAll('.nav-button-icon');
      expect(icons).to.have.length(2);
    });
  });

  describe('navigation functionality', () => {
    it('should navigate to home when logo is clicked', async () => {
      const logo = element.shadowRoot.querySelector('.nav-button-logo');

      mockRouterCalls.length = 0;
      logo.click();
      await element.updateComplete;

      expect(mockRouterCalls).to.include('/');
    });

    it('should navigate to employees when employees link is clicked', async () => {
      const employeesLink = element.shadowRoot.querySelector(
        'a[href="/employees"]',
      );

      mockRouterCalls.length = 0;
      employeesLink.click();
      await element.updateComplete;

      expect(mockRouterCalls).to.include('/employees');
    });

    it('should navigate to add when add link is clicked', async () => {
      const addLink = element.shadowRoot.querySelector('a[href="/add"]');

      mockRouterCalls.length = 0;
      addLink.click();
      await element.updateComplete;

      expect(mockRouterCalls).to.include('/add');
    });
  });

  describe('active route highlighting', () => {
    it('should highlight active route', async () => {
      element.currentRoute = '/employees';
      await element.updateComplete;

      const employeesLink = element.shadowRoot.querySelector(
        'a[href="/employees"]',
      );
      const employeesIcon = element.shadowRoot.querySelector(
        'a[href="/employees"] .nav-button-icon',
      );

      expect(employeesLink.classList.contains('active')).to.be.true;
      expect(employeesIcon.classList.contains('active')).to.be.true;
    });

    it('should highlight add route when active', async () => {
      element.currentRoute = '/add';
      await element.updateComplete;

      const addLink = element.shadowRoot.querySelector('a[href="/add"]');
      const addIcon = element.shadowRoot.querySelector(
        'a[href="/add"] .nav-button-icon',
      );

      expect(addLink.classList.contains('active')).to.be.true;
      expect(addIcon.classList.contains('active')).to.be.true;
    });

    it('should not highlight inactive routes', async () => {
      element.currentRoute = '/employees';

      const addLink = element.shadowRoot.querySelector('a[href="/add"]');
      const addIcon = element.shadowRoot.querySelector(
        'a[href="/add"] .nav-button-icon',
      );

      expect(addLink.classList.contains('active')).to.be.false;
      expect(addIcon.classList.contains('active')).to.be.false;
    });

    it('should update active state when route changes', async () => {
      element.currentRoute = '/';

      let employeesLink = element.shadowRoot.querySelector(
        'a[href="/employees"]',
      );
      expect(employeesLink.classList.contains('active')).to.be.false;

      element.currentRoute = '/employees';
      await element.updateComplete;

      employeesLink = element.shadowRoot.querySelector('a[href="/employees"]');
      expect(employeesLink.classList.contains('active')).to.be.true;
    });
  });

  describe('language switching', () => {
    it('should display correct flag for current language', async () => {
      element.currentLanguage = 'en';

      const languageToggle =
        element.shadowRoot.querySelector('.language-toggle');
      expect(languageToggle.textContent.trim()).to.equal('🇺🇸');

      element.currentLanguage = 'tr';
      await element.updateComplete;

      expect(languageToggle.textContent.trim()).to.equal('🇹🇷');
    });

    it('should toggle language when language button is clicked', async () => {
      element.currentLanguage = 'en';
      await element.updateComplete;

      const languageToggle =
        element.shadowRoot.querySelector('.language-toggle');
      languageToggle.click();

      expect(mockStore.language).to.equal('tr');
    });

    it('should toggle from Turkish to English', async () => {
      element.currentLanguage = 'tr';
      mockStore.language = 'tr';
      await element.updateComplete;

      const languageToggle =
        element.shadowRoot.querySelector('.language-toggle');
      languageToggle.click();

      expect(mockStore.language).to.equal('en');
    });

    it('should update translations when language changes', async () => {
      element.currentLanguage = 'en';
      await element.updateComplete;

      let employeesLink = element.shadowRoot.querySelector(
        'a[href="/employees"]',
      );
      expect(employeesLink.textContent.trim()).to.include('Employees');

      // Change language
      mockStore.language = 'tr';
      element.currentLanguage = 'tr';
      await element.updateComplete;

      employeesLink = element.shadowRoot.querySelector('a[href="/employees"]');
      expect(employeesLink.textContent.trim()).to.include('Çalışanlar');
    });
  });

  describe('event handling', () => {
    it('should listen for language change events', async () => {
      expect(element.currentLanguage).to.equal('en');

      window.dispatchEvent(
        new CustomEvent('languagechange', {
          detail: { language: 'tr' },
        }),
      );

      await element.updateComplete;
      expect(element.currentLanguage).to.equal('tr');
    });

    it('should listen for route change events', async () => {
      expect(element.currentRoute).to.equal('/');

      window.dispatchEvent(
        new CustomEvent('vaadin-router-location-changed', {
          detail: {
            location: { pathname: '/employees' },
          },
        }),
      );

      await element.updateComplete;
      expect(element.currentRoute).to.equal('/employees');
    });
  });
});
