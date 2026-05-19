# Tests E2E - Portfolio

Tests funcionales End-to-End para el portfolio personal (Playwright + Cucumber + Page Objects).

## 📑 Índice

- [🏗️ Arquitectura del proyecto](#arquitectura-del-proyecto)
- [🛠️ Scripts pnpm disponibles](#scripts-pnpm)
- [📖 Recursos adicionales](#recursos-adicionales)
- [👥 Soporte y contacto](#soporte-y-contacto)

<a id="arquitectura-del-proyecto" name="arquitectura-del-proyecto"></a>

## 🏗️ Arquitectura del proyecto

```text
/tests/e2e/
├── features/           # Archivos .feature con escenarios BDD (Gherkin)
│   └── login.feature
├── page-objects/       # Page Objects: lógica de interacción con la app
│   └── LoginPage.ts
├── step-definitions/   # Implementación de los pasos de los features
│   └── login.steps.ts
├── playwright.config.ts  # Configuración de Playwright
├── cucumber.js           # Configuración de Cucumber
└── README.md           # Esta documentación
```

### Ejemplo de feature (features/login.feature)

```gherkin
Feature: Login

  Scenario: Usuario accede con credenciales válidas
    Given el usuario está en la página de login
    When introduce usuario "admin" y contraseña "1234"
    And pulsa el botón de login
    Then ve la página de inicio
```

### Ejemplo de Page Object (page-objects/LoginPage.ts)

```ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }
  async login(username: string, password: string) {
    await this.page.fill('[data-id="login-username"]', username);
    await this.page.fill('[data-id="login-password"]', password);
    await this.page.click('[data-id="login-btn"]');
  }
}
```

### Ejemplo de Step Definition (step-definitions/login.steps.ts)

```ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

let loginPage: LoginPage;

Given('el usuario está en la página de login', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

When('introduce usuario {string} y contraseña {string}', async function (username, password) {
  await loginPage.login(username, password);
});

Then('ve la página de inicio', async function () {
  await expect(this.page.locator('[data-id="home-page"]')).toBeVisible();
});
```

<a id="scripts-pnpm" name="scripts-pnpm"></a>

## 🛠️ Scripts pnpm disponibles

| Comando              | Descripción                          |
| -------------------- | ------------------------------------ |
| `pnpm run e2e`       | Ejecuta todos los tests E2E          |
| `pnpm run e2e:debug` | Ejecuta tests E2E en modo debug (UI) |

> Puedes personalizar los scripts en `package.json` según la configuración de Playwright y Cucumber.

<a id="recursos-adicionales" name="recursos-adicionales"></a>

## 📖 Recursos adicionales

- [Playwright Docs](https://playwright.dev/)
- [Cucumber.js Docs](https://cucumber.io/docs/guides/10-minute-tutorial/)
- [Testing Library: By data-id](https://testing-library.com/docs/queries/bytestid/)

<a id="soporte-y-contacto" name="soporte-y-contacto"></a>

## 👥 Soporte y contacto

Este proyecto es didáctico. Para dudas, abre un issue en el repositorio o contacta con el autor.
