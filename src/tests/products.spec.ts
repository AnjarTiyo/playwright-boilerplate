import test, { expect } from "@playwright/test";
import { UserEnum } from "../data/user-credentials.data";
import { LoginPage } from "../pages/login.page";
import { ProductsPage, SelectedProduct } from "../pages/products.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutInfoPage, UserDetailsProps } from "../pages/checkout-info.page";
import { CheckoutOverviewPage } from "../pages/checkout-overview.page";
import { SortOptionKey } from "../fixtures/filter.fixture";

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(UserEnum.STANDARD_USER);
});

test('Add to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCart('Sauce Labs Backpack');

    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe(1);
});

test('Remove from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCart('Sauce Labs Backpack');
    await productsPage.removeFromCart('Sauce Labs Backpack');

    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe(0);
});

test('Select multiple products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productToBeSelected = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Onesie'
    ];

    for (const product of productToBeSelected) {
        await productsPage.addToCart(product);
    }

    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe(productToBeSelected.length);

    // Verify that all products are selected
    for (const product of productToBeSelected) {
        const isSelected = await productsPage.isProductSelected(product);
        expect(isSelected).toBe(true);
    }
})

test('Verify selected products in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productToBeSelected = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Test.allTheThings() T-Shirt (Red)'
    ];

    const selectedProducts: SelectedProduct[] = [];

    for (const product of productToBeSelected) {
        const productDetails = await productsPage.getProductDetails(product);
        await productsPage.addToCart(product);
        selectedProducts.push(productDetails!);

        const isSelected = await productsPage.isProductSelected(product);
        expect(isSelected).toBe(true);
    }

    expect(selectedProducts.length).toBe(productToBeSelected.length);

    await productsPage.cartButton.click();

    // verify on cart page
    const cartPage = new CartPage(page);
    await cartPage.verifyOnCartPage();

    for (const product of selectedProducts) {
        await cartPage.verifyCartItem(product);
    }
})

test('Make a purchase', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productToBeSelected = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Test.allTheThings() T-Shirt (Red)'
    ];

    const selectedProducts: SelectedProduct[] = [];

    for (const product of productToBeSelected) {
        const productDetails = await productsPage.getProductDetails(product);
        await productsPage.addToCart(product);
        selectedProducts.push(productDetails!);

        const isSelected = await productsPage.isProductSelected(product);
        expect(isSelected).toBe(true);
    }

    expect(selectedProducts.length).toBe(productToBeSelected.length);

    await productsPage.cartButton.click();

    // verify on cart page
    const cartPage = new CartPage(page);
    await cartPage.verifyOnCartPage();

    for (const product of selectedProducts) {
        await cartPage.verifyCartItem(product);
    }

    await cartPage.checkoutButton.click();

    // verify on checkout page
    const checkoutPage = new CheckoutInfoPage(page);
    await checkoutPage.verifyOnCheckoutPage();

    // Fill in user details
    const userDetails: UserDetailsProps = {
        firstName: "John",
        lastName: "Doe",
        zipCode: "12345"
    };

    await checkoutPage.fillUserDetails(userDetails);

    await checkoutPage.continueButton.click();

    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    // await checkoutOverviewPage.verifyOnCheckoutOverviewPage();

    for(const product of selectedProducts){
        // Verify each product in the overview page
        await checkoutOverviewPage.verifyProduct(product);
    }

    await checkoutOverviewPage.verifyTotalPrice(selectedProducts);
})

test("filter functionality", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const sortOptions: SortOptionKey = "PRICE_HIGH_TO_LOW";

    // 1. Get Current List Product as base measurement
    const baseProductList = await productsPage.getProductList();
    // 2. Select Options as per requested
    await productsPage.filterByCategory(sortOptions);

    // 3. Verify current order is not same as base measurement
    const filteredProductList = await productsPage.getProductList();
    expect(filteredProductList).not.toEqual(baseProductList);

    // 4. Verify filtered products are in the correct order
    await productsPage.verifyFilteredProductsOrder(sortOptions);
})
