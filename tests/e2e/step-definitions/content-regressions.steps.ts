import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { KimoContentPages } from '../page-objects/KimoContentPages.ts';
import { PortfolioShell } from '../page-objects/PortfolioShell.ts';

Given('el usuario navega a la galería de proyecto {string}', async function (path: string) {
  const portfolioShell = new PortfolioShell(this.page);
  await portfolioShell.setDesktopViewport();
  const normalizedPath = path.trim();
  await portfolioShell.goto(normalizedPath);
  const slug = normalizedPath.replace(/\/$/, '').split('/').pop() ?? '';
  await expect(this.page.locator(`[data-id="${slug}-page"]`)).toBeVisible();
});

Then('todas las ProjectCard de {string} muestran miniaturas', async function (prefix: string) {
  const kimoPages = new KimoContentPages(this.page);
  const cards = kimoPages.projectCards(prefix);
  const count = await cards.count();

  expect(count).toBeGreaterThan(0);

  const firstImage = cards.first().locator('img');
  const src = await firstImage.getAttribute('src');
  expect(src).toContain('/thumbs/');
});

When('navega a la galería de proyecto {string}', async function (path: string) {
  const portfolioShell = new PortfolioShell(this.page);
  const normalizedPath = path.trim();
  await portfolioShell.goto(normalizedPath);
  const slug = normalizedPath.replace(/\/$/, '').split('/').pop() ?? '';
  await expect(this.page.locator(`[data-id="${slug}-page"]`)).toBeVisible();
});

Then('la portada del libro {string} usa el fallback', async function (title: string) {
  const kimoPages = new KimoContentPages(this.page);
  const image = kimoPages.bookCover(title);
  await image.evaluate((node) => {
    node.dispatchEvent(new Event('error'));
  });
  await expect(image).toHaveAttribute('src', /_blank\.jpg$/);
});

When('abre la portada del libro {string}', async function (title: string) {
  const kimoPages = new KimoContentPages(this.page);
  await kimoPages.openBookCover(title);
});

Then('se muestra el modal del libro {string}', async function (title: string) {
  const kimoPages = new KimoContentPages(this.page);
  await expect(kimoPages.bookModal()).toBeVisible();
  await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
});

When('cierra el modal con Escape', async function () {
  const kimoPages = new KimoContentPages(this.page);
  await kimoPages.closeBookModalWithEscape();
});

Then('el modal del libro no está visible', async function () {
  const kimoPages = new KimoContentPages(this.page);
  await expect(kimoPages.bookModal()).toHaveCount(0);
});

When('cambia a vista tabla', async function () {
  const kimoPages = new KimoContentPages(this.page);
  await kimoPages.switchBooksToTableView();
  await expect(this.page.locator('[data-id="books-table"]')).toBeVisible();
});

When('filtra los libros por título {string}', async function (title: string) {
  const kimoPages = new KimoContentPages(this.page);
  await kimoPages.filterBooksByTitle(title);
});

Then('la fila del libro {string} es visible', async function (title: string) {
  await expect(this.page.getByRole('row', { name: new RegExp(title, 'i') })).toBeVisible();
});

Then('debería ver el mapa de lugares', async function () {
  const kimoPages = new KimoContentPages(this.page);
  await expect(kimoPages.placesMap()).toBeVisible();
});

Then('debería ver la tabla de lugares', async function () {
  const kimoPages = new KimoContentPages(this.page);
  await expect(kimoPages.placesTable()).toBeVisible();
});

When('ordena la tabla por ciudad', async function () {
  const kimoPages = new KimoContentPages(this.page);
  await kimoPages.sortPlacesByCity();
});

Then('la primera fila de lugares contiene {string}', async function (text: string) {
  const kimoPages = new KimoContentPages(this.page);
  await expect(kimoPages.firstPlaceRow()).toContainText(text);
});
