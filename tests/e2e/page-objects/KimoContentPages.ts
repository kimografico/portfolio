import type { Page } from '@playwright/test';

const APP_BASENAME = '/portfolio';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class KimoContentPages {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async switchBooksToTableView(): Promise<void> {
    await this.page.getByRole('button', { name: /tabla/i }).click();
  }

  async filterBooksByTitle(title: string): Promise<void> {
    await this.page.getByLabel('Título').fill(title);
  }

  async openBookCover(title: string): Promise<void> {
    await this.page.locator(`[data-id="book-cover-${slugify(title)}"]`).click();
  }

  async closeBookModalWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async sortPlacesByCity(): Promise<void> {
    await this.page.locator('[data-id="table-sort-btn-city"]').click();
  }

  async goToBooks(): Promise<void> {
    await this.page.goto(`${APP_BASENAME}/kimo/books`);
  }

  async goToPlaces(): Promise<void> {
    await this.page.goto(`${APP_BASENAME}/kimo/places`);
  }

  projectCards(prefix: string) {
    return this.page.locator(`[data-id^="${prefix}-card-"]`);
  }

  bookCover(title: string) {
    return this.page.locator(`[data-id="book-cover-${slugify(title)}"] img`);
  }

  bookModal() {
    return this.page.locator('[data-id="book-modal"]');
  }

  booksTable() {
    return this.page.locator('[data-id="books-table"]');
  }

  booksFilterInput() {
    return this.page.locator('[data-id="books-filter-title-input"]');
  }

  placesMap() {
    return this.page.locator('[data-id="places-map"]');
  }

  placesTable() {
    return this.page.locator('[data-id="places-table"]');
  }

  firstPlaceRow() {
    return this.page.getByRole('row').nth(1);
  }

  firstBookRow() {
    return this.page.locator('[data-id="table-row-0"]');
  }
}
