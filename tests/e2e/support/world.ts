import { After, Before, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

class CustomWorld extends World {
  browser: import('playwright').Browser | undefined;

  context: import('playwright').BrowserContext | undefined;

  page: import('playwright').Page | undefined;

  constructor(options: import('@cucumber/cucumber').WorldOptions) {
    super(options);
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  const headless = process.env.E2E_HEADLESS !== 'false';
  const slowMo = Number(process.env.E2E_SLOW_MO ?? '0');

  this.browser = await chromium.launch({
    headless,
    slowMo: Number.isNaN(slowMo) ? 0 : slowMo,
  });
  this.context = await this.browser.newContext({
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5174/portfolio/',
  });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
