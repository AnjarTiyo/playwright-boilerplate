import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserEnum } from '../data/user-credentials.data';
import { ProductsPage } from '../pages/products.page';
import { verifySucessfulLogin } from '../utils/assertions/auth.assertions';

test('Login as Standard User', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(UserEnum.STANDARD_USER);

  const productsPage = new ProductsPage(page);
  await verifySucessfulLogin(page);
});