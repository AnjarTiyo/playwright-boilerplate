import { expect, Locator, Page } from "@playwright/test";
import { SortOptionKey, sortOptions } from "../fixtures/filter.fixture";

export type SelectedProduct = {
    title: string;
    description: string;
    price: string;
    qty?: number;
};

export class ProductsPage {
    readonly page: Page;
    readonly header: Locator;
    readonly menuButton: Locator;
    readonly cartButton: Locator;
    readonly cartCount: Locator;
    readonly sortButton: Locator;
    readonly inventoryItemList: Locator;
    readonly inventoryItem: Locator;
    readonly itemImage: Locator;
    readonly itemName: Locator;
    readonly itemDescription: Locator;
    readonly itemPrice: Locator;
    readonly addToCartButton: Locator;
    readonly removeFromCartButton: Locator;
    readonly filterButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator("//span[text()='Products' and @data-test='title']");
        this.inventoryItemList = page.locator("//div[@data-test='inventory-item']");
        this.menuButton = page.locator("//button[@id='react-burger-menu-btn']");
        this.cartButton = page.locator("//a[@data-test='shopping-cart-link']");
        this.cartCount = page.locator("//span[@data-test='shopping-cart-badge']");
        this.sortButton = page.locator("//button[@data-test='product_sort_container']");
        this.inventoryItem = page.locator("//div[@data-test='inventory-item']");
        this.itemImage = page.locator("//div[@data-test='inventory-item']//img");
        this.itemName = page.locator("//div[@data-test='inventory-item-name']");
        this.itemDescription = page.locator("//div[@data-test='inventory-item-desc']");
        this.itemPrice = page.locator("//div[@data-test='inventory-item-price']");
        this.addToCartButton = page.locator("//button[@data-test='add-to-cart']");
        this.removeFromCartButton = page.locator("//button[@data-test='remove-from-cart']");
        this.filterButton = page.locator("select[data-test='product-sort-container']");
    }

    private getProductLocator(productName: string): Locator {
        return this.page.locator("[data-test='inventory-item']").filter({ hasText: productName });
    }

    async addToCart(productName: string) {
        await this.page.locator('[data-test="inventory-item"]', {
            hasText: productName
        }).locator('button', {
            hasText: 'Add to cart'
        }).click();
    }

    async removeFromCart(productName: string) {
        await this.page.locator('[data-test="inventory-item"]', {
            hasText: productName
        }).locator('button', {
            hasText: 'Remove'
        }).click();
    }

    async getCartCount(): Promise<number> {
        const count = await this.cartCount.count();
        if (count === 0) return 0;

        const text = await this.cartCount.textContent();
        const parsed = parseInt(text ?? '0', 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    async isProductSelected(productName: string): Promise<boolean> {
        const product = await this.page.locator('[data-test="inventory-item"]', {
            hasText: productName
        });
        return await product.count() > 0;
    }

    async getProductDetails(productName: string): Promise<SelectedProduct | null> {
        const product = this.getProductLocator(productName);

        if (!(await product.isVisible())) return null;

        const title = await product.locator("[data-test='inventory-item-name']").textContent();
        const description = await product.locator("[data-test='inventory-item-desc']").textContent();
        const price = await product.locator("[data-test='inventory-item-price']").textContent();

        return {
            title: title?.trim() ?? "",
            description: description?.trim() ?? "",
            price: price?.trim() ?? "",
            qty: 1 // Saucedemo doesnt support dynamic quantities
        };
    }

    async getProductList(): Promise<SelectedProduct[]> {
        const items = await this.inventoryItem.all();

        const products: SelectedProduct[] = [];
        for (const item of items) {
            const title = await item.locator("[data-test='inventory-item-name']").textContent();
            const description = await item.locator("[data-test='inventory-item-desc']").textContent();
            const priceText = await item.locator("[data-test='inventory-item-price']").textContent();

            products.push({
                title: title?.trim() || '',
                description: description?.trim() || '',
                price: priceText?.trim() || '',
            });
        }

        return products;
    }

    async filterByCategory(category: SortOptionKey) {
        const selected = sortOptions[category].value;
        await this.filterButton.selectOption({ value: selected });
        await expect(this.filterButton).toHaveValue(selected);
    }

    async verifyFilteredProductsOrder(category: SortOptionKey) {
        const productList = await this.getProductList();

        const actualTitles = productList.map(p => p.title);
        const actualPrices = productList.map(p =>
            parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0')
        );

        let expected: string[] | number[] = [];

        switch (category) {
            case 'NAME_ASC':
                expected = [...actualTitles].sort((a, b) => a.localeCompare(b));
                // Uncomment this code if need debugging
                // console.log('Actual Titles:  ', actualTitles);
                // console.log('Expected Titles:', expected);
                expect(actualTitles).toEqual(expected);
                break;

            case 'NAME_DESC':
                expected = [...actualTitles].sort((a, b) => b.localeCompare(a));
                // Uncomment this code if need debugging
                // console.log('Actual Titles:  ', actualTitles);
                // console.log('Expected Titles:', expected);
                expect(actualTitles).toEqual(expected);
                break;

            case 'PRICE_LOW_TO_HIGH':
                expected = [...actualPrices].sort((a, b) => a - b);
                // Uncomment this code if need debugging
                // console.log('Actual Prices:  ', actualPrices);
                // console.log('Expected Prices:', expected);
                expect(actualPrices).toEqual(expected);
                break;

            case 'PRICE_HIGH_TO_LOW':
                expected = [...actualPrices].sort((a, b) => b - a);
                // Uncomment this code if need debugging
                // console.log('Actual Prices:  ', actualPrices);
                // console.log('Expected Prices:', expected);
                expect(actualPrices).toEqual(expected);
                break;

            default:
                throw new Error(`Unknown sort category: ${category}`);
        }
    }
}