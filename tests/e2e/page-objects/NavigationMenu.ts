import type { Page } from '@playwright/test';

class NavigationMenu {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  gotoHome() {
    return this.page.goto('');
  }

  clickMenu(pageId: 'graphic-design' | 'dev' | 'contacto') {
    const selectors = {
      'graphic-design': '[data-id="main-nav-link-graphic-design"]',
      dev: '[data-id="main-nav-link-dev"]',
      contacto: '[data-id="main-nav-link-contacto"]',
    };
    return this.page.click(selectors[pageId]);
  }

  clickLogo() {
    return this.page.click('[data-id="logo-link"]');
  }

  isOnPage(pageId: 'home' | 'graphic-design' | 'dev' | 'contacto') {
    const selectors = {
      home: '[data-id="home-page"]',
      'graphic-design': '[data-id="graphic-design-home"]',
      dev: '[data-id="developer-home"]',
      contacto: '[data-id="contact-page"]',
    };
    return this.page
      .locator(selectors[pageId])
      .waitFor({ state: 'visible' })
      .then(() => true);
  }
}

export { NavigationMenu };
