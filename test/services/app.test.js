import { expect } from '@open-wc/testing';

const mockStore = {
  employees: [],
  language: 'en',
  setLanguage: lang => {
    mockStore.language = lang;
  },
  t: key => key,
  getCurrentLanguage: () => mockStore.language,
};

describe('App Service', () => {
  let originalApp;
  let originalAddEventListener;
  let eventListeners;

  beforeEach(() => {
    originalApp = window.app;
    originalAddEventListener = window.addEventListener;

    delete window.app;

    mockStore.employees = [];
    mockStore.language = 'en';

    eventListeners = {};
    window.addEventListener = (event, callback) => {
      eventListeners[event] = callback;
      if (event === 'DOMContentLoaded') {
        domContentLoadedCallback = callback;
      }
    };
  });

  afterEach(() => {
    if (originalApp !== undefined) {
      window.app = originalApp;
    } else {
      delete window.app;
    }
    window.addEventListener = originalAddEventListener;
  });

  describe('store integration', () => {
    it('should make store accessible globally', async () => {
      window.app = {};
      window.app.store = mockStore;

      expect(window.app.store).to.equal(mockStore);
      expect(app.store).to.equal(mockStore);
    });
  });
});
