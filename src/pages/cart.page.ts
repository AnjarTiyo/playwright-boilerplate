import { expect, Locator, Page } from "@playwright/test";
import { SelectedProduct } from "./products.page";

export class CartPage {
    readonly page: Page;
    readonly cartItemContainer: Locator;
    readonly itemTitle: Locator;
    readonly itemDescription: Locator;
    readonly itemPrice: Locator;
    readonly itemQty: Locator;
    readonly itemRemoveButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItemContainer = page.locator('[data-test="inventory-item"]');
        this.itemTitle = page.locator('[data-test="inventory-item-name"]');
        this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
        this.itemQty = page.locator('[data-test="cart-item-quantity"]');
        this.itemRemoveButton = page.locator('button', { hasText: 'Remove' });
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async verifyOnCartPage() {
        const cartItems = await this.cartItemContainer.count();
        expect(cartItems).toBeGreaterThan(0);
    }

    async verifyCartItem(product: SelectedProduct) {
        const productTitle = this.cartItemContainer.locator(`[data-test="inventory-item-name"]`, { hasText: product.title });

        const productDescription = this.cartItemContainer.locator(`[data-test="inventory-item-desc"]`, { hasText: product.description });
        const productPrice = this.cartItemContainer.locator(`[data-test="inventory-item-price"]`, { hasText: product.price });
        const productQty = this.cartItemContainer.locator(`[data-test="item-quantity"]`, { hasText: String(product.qty) });

        expect(await productTitle.count()).toBe(1);
        expect(await productTitle.textContent()).toBe(product.title);

        expect(await productDescription.count()).toBe(1);
        expect(await productDescription.textContent()).toBe(product.description);

        expect(await productPrice.count()).toBe(1);
        expect(await productPrice.textContent()).toBe(product.price);
    }
}