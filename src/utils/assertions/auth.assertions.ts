import { expect, Page } from "@playwright/test";
import { ProductsPage } from "../../pages/products.page";


export async function verifySucessfulLogin(page: Page) {
    const productsPage = new ProductsPage(page);
    await expect(productsPage.header).toBeVisible();
    await expect(productsPage.inventoryItemList.first()).toBeVisible();
}