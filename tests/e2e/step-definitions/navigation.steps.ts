import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { NavigationMenu } from '../page-objects/NavigationMenu.ts';

let navigation: NavigationMenu;

Given('el usuario está en la página de inicio', async function () {
  navigation = new NavigationMenu(this.page);
  await navigation.gotoHome();
  expect(await navigation.isOnPage('home')).toBeTruthy();
});

When('navega a la página de diseño gráfico desde el menú', async function () {
  await navigation.clickMenu('graphic-design');
});

Then('debería ver la página de diseño gráfico', async function () {
  expect(await navigation.isOnPage('graphic-design')).toBeTruthy();
});

When('navega a la página de desarrollo web desde el menú', async function () {
  await navigation.clickMenu('dev');
});

Then('debería ver la página de desarrollo web', async function () {
  expect(await navigation.isOnPage('dev')).toBeTruthy();
});

When('navega a la página de contacto desde el menú', async function () {
  await navigation.clickMenu('contacto');
});

Then('debería ver la página de contacto', async function () {
  expect(await navigation.isOnPage('contacto')).toBeTruthy();
});

When('hace clic en el logo', async function () {
  await navigation.clickLogo();
});

Then('debería volver a la página de inicio', async function () {
  expect(await navigation.isOnPage('home')).toBeTruthy();
});
