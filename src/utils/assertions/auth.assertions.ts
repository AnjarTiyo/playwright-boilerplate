import { expect, Page } from "@playwright/test";
import { ProductsPage } from "../../pages/products.page";


export async function verifySucessfulLogin(page: Page) {
    const productsPage = new ProductsPage(page);
    await expect(productsPage.header).toBeVisible();
    await expect(productsPage.inventoryItemList.first()).toBeVisible();
}

export async function verifyLogout(page: Page) {
    const productsPage = new ProductsPage(page);
    await productsPage.goTo();
    await expect(productsPage.header).not.toBeVisible();
}