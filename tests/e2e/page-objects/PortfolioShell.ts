import type { Page } from '@playwright/test';

const APP_BASENAME = '/portfolio';

export class PortfolioShell {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    const targetPath = path === '/' ? `${APP_BASENAME}/` : `${APP_BASENAME}${path}`;
    await this.page.goto(targetPath);
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 800 });
  }

  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1280, height: 900 });
  }

  async authenticateKimo(): Promise<void> {
    await this.page.addInitScript(() => {
      window.localStorage.setItem('kimo-authenticated', 'true');
    });
  }

  async clearKimoAuthentication(): Promise<void> {
    await this.page.addInitScript(() => {
      window.localStorage.removeItem('kimo-authenticated');
    });
  }

  async openMobileMenu(): Promise<void> {
    await this.page.getByRole('button', { name: /abrir menú/i }).click();
  }

  async clickMobileMenuLink(label: string): Promise<void> {
    await this.page.getByRole('link', { name: label }).click();
  }

  async toggleTheme(): Promise<void> {
    await this.page.getByRole('button', { name: /activar tema (oscuro|claro)/i }).click();
  }

  get html() {
    return this.page.locator('html');
  }

  get desktopNav() {
    return this.page.locator('[data-id="main-nav-desktop"]');
  }

  get mobileMenuButton() {
    return this.page.locator('[data-id="mobile-menu-button"]');
  }

  get contactPage() {
    return this.page.locator('[data-id="contact-page"]');
  }

  get homePage() {
    return this.page.locator('[data-id="home-page"]');
  }

  get booksPage() {
    return this.page.locator('[data-id="books-page"]');
  }

  get placesPage() {
    return this.page.locator('[data-id="places-page"]');
  }

  get loginHeading() {
    return this.page.getByRole('heading', { name: /acceso a kimo/i });
  }
}
