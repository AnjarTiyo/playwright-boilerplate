import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserEnum } from '../data/user-credentials.data';
import { ProductsPage } from '../pages/products.page';
import { verifyLogout, verifySucessfulLogin } from '../utils/assertions/auth.assertions';

test.describe('Feature: Authorization', {
  tag: ['@auth', '@regression']
}, () => {
  test('Login as Standard User', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Login as Standard User', async () => {
      await loginPage.loginAs(UserEnum.STANDARD_USER);
    });

    await test.step('Verify successful login', async () => {
      await verifySucessfulLogin(page);
    })
  });

  test('Logout from app will delete all state', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await test.step('Login as Standard User', async () => {
      await loginPage.goto();
      await loginPage.loginAs(UserEnum.STANDARD_USER);
    })

    await test.step('Logout from app', async () => {
      await productsPage.logout();
    })

    await test.step('Forcefully go to inventory page should be prohibited', async () => {
      await verifyLogout(page);
    })

  })
});