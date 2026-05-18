import { Given, When, Then } from '@cucumber/cucumber';
import { expect, type Route } from '@playwright/test';
import { PortfolioShell } from '../page-objects/PortfolioShell.ts';

Given('el navegador tiene tamaño móvil', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.setMobileViewport();
});

Given('el navegador tiene tamaño escritorio', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.setDesktopViewport();
});

Given('el usuario está autenticado en Kimo', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.authenticateKimo();
});

Given('el usuario no está autenticado en Kimo', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.clearKimoAuthentication();
});

When('navega a la ruta {string}', async function (path: string) {
  const portfolioShell = new PortfolioShell(this.page);
  const normalizedPath = path.trim();

  if (normalizedPath === '/kimo/books') {
    await this.page.route('**/la-isla-misteriosa.jpg', async (route: Route) => {
      await route.abort();
    });
  }

  await portfolioShell.goto(normalizedPath);
});

Then(/^debería ver el elemento (.+)$/, async function (selector: string) {
  await expect(this.page.locator(selector.trim())).toBeVisible();
});

Then(/^no debería ver el elemento (.+)$/, async function (selector: string) {
  await expect(this.page.locator(selector.trim())).toHaveCount(0);
});

Then('debería ver el heading {string}', async function (heading: string) {
  await expect(this.page.getByRole('heading', { name: heading })).toBeVisible();
});

Then('debería ver el botón del menú móvil', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await expect(portfolioShell.mobileMenuButton).toBeVisible();
});

Then('no debería ver la navegación de escritorio', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await expect(portfolioShell.desktopNav).toBeHidden();
});

When('abre el menú móvil', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.openMobileMenu();
});

When('pulsa el enlace {string} del menú móvil', async function (label: string) {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.clickMobileMenuLink(label);
});

When('cambia el navegador a escritorio', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.setDesktopViewport();
});

Then('debería ver la navegación de escritorio', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await expect(portfolioShell.desktopNav).toBeVisible();
});

Then('no debería ver el botón del menú móvil', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await expect(portfolioShell.mobileMenuButton).toBeHidden();
});

Then('el documento tiene tema {string}', async function (theme: string) {
  const portfolioShell = new PortfolioShell(this.page);
  await expect(portfolioShell.html).toHaveAttribute('data-theme', theme);
});

When('activa el tema', async function () {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.toggleTheme();
});
