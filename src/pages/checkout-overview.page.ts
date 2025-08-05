import { expect, Locator, Page } from "@playwright/test";
import { SelectedProduct } from "./products.page";

export class CheckoutOverviewPage {
    readonly page: Page;
    readonly header: Locator;
    readonly itemContainer: Locator;
    readonly subTotal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('[data-test="header"]');
        this.itemContainer = page.locator('[data-test="inventory-item"]');
        this.subTotal = page.locator('//div[@data-test="subtotal-label"]');
    }

    async verifyProduct(product: SelectedProduct) {
        const productTitle = this.itemContainer.locator(`[data-test="inventory-item-name"]`, { hasText: product.title });

        const productDescription = this.itemContainer.locator(`[data-test="inventory-item-desc"]`, { hasText: product.description });
        const productPrice = this.itemContainer.locator(`[data-test="inventory-item-price"]`, { hasText: product.price });
        const productQty = this.itemContainer.locator(`[data-test="item-quantity"]`, { hasText: String(product.qty) });

        expect(await productTitle.count()).toBe(1);
        expect(await productTitle.textContent()).toBe(product.title);

        expect(await productDescription.count()).toBe(1);
        expect(await productDescription.textContent()).toBe(product.description);

        expect(await productPrice.count()).toBe(1);
        expect(await productPrice.textContent()).toBe(product.price);
    }

    async verifyTotalPrice(selectedProducts: SelectedProduct[]) {
        // Hitung subtotal yang diharapkan
        const expectedSubtotal = selectedProducts.reduce((sum, product) => {
            const price = parseFloat(product.price.replace('$', '').replace(',', ''));
            return sum + (isNaN(price) ? 0 : price * product.qty);
        }, 0);

        // Ambil dan bersihkan text subtotal dari UI
        const rawText = await this.subTotal.textContent();
        if (!rawText) throw new Error("Subtotal text not found");

        const cleanedText = rawText
            .replace(/Item total:\s*/i, '') // hapus label
            .replace('$', '')
            .replace(',', '')
            .trim();

        const actualSubtotal = parseFloat(cleanedText);
        if (isNaN(actualSubtotal)) {
            throw new Error(`Invalid subtotal format after cleaning: "${cleanedText}"`);
        }

        console.log("Actual Subtotal:", actualSubtotal.toFixed(2));
        console.log("Expected Subtotal:", expectedSubtotal.toFixed(2));

        // Cek hasil akhir dengan toleransi 2 angka desimal
        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
    }
}