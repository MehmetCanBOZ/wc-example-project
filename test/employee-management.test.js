import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../src/employee-management.js';

describe('EmployeeManagement', () => {
  let element;

  beforeEach(async () => {
    window.app = {
      store: {
        getCurrentLanguage: () => 'en',
      },
    };

    element = await fixture(html`<employee-management></employee-management>`);
  });

  afterEach(() => {
    delete window.app;
  });

  it('should render the component', () => {
    expect(element).to.exist;
  });

  it('should render navigation-menu component', () => {
    const navigationMenu = element.shadowRoot.querySelector('navigation-menu');
    expect(navigationMenu).to.exist;
  });

  it('should render main content area', () => {
    const mainContent = element.shadowRoot.querySelector('.main-content');
    expect(mainContent).to.exist;
  });

  it('should render router management', () => {
    const outlet = element.shadowRoot.querySelector('#management');
    expect(outlet).to.exist;
  });

  it('should initialize with default language from store', () => {
    expect(element.currentLanguage).to.equal('en');
  });

  it('should handle language change events', () => {
    const languageEvent = new CustomEvent('languagechange', {
      detail: { language: 'tr' },
    });
    window.dispatchEvent(languageEvent);

    expect(element.currentLanguage).to.equal('tr');
  });
});
