import test, { expect } from "@playwright/test";
import { UserEnum } from "../data/user-credentials.data";
import { LoginPage } from "../pages/login.page";
import { ProductsPage, Product } from "../pages/products.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutInfoPage, UserDetailsProps } from "../pages/checkout-info.page";
import { CheckoutOverviewPage } from "../pages/checkout-overview.page";
import { SortOptionKey } from "../fixtures/filter.fixture";
import { ProductEnum } from "../fixtures/products.fixture";

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(UserEnum.STANDARD_USER);
});

test('Add to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const selectedProduct = ProductEnum.SAUCE_LABS_BACKPACK;
    // We will use this as expected cart count
    let expectedCartCount: number = 0;

    await test.step(`Add ${selectedProduct} to cart`, async () => {
        await productsPage.addToCart(selectedProduct);
        expectedCartCount++;
    });

    await test.step('Verify cart count', async () => {
        const cartCount = await productsPage.getCartCount();
        expect(cartCount).toBe(expectedCartCount);
    });
});

test('Remove from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const selectedProduct = ProductEnum.SAUCE_LABS_BACKPACK;
    let productCount: number = 0;

    await test.step(`Add ${selectedProduct} to cart`, async () => {
        await productsPage.addToCart(selectedProduct);
        productCount++;
    })

    await test.step(`Cart count should be ${productCount}`, async () => {
        const cartCount = await productsPage.getCartCount();
        expect(cartCount).toBe(productCount);
    });

    await test.step(`Remove ${selectedProduct} from cart`, async () => {
        await productsPage.removeFromCart(selectedProduct);
        productCount--;
    });

    await test.step(`Cart count should be ${productCount}`, async () => {
        const cartCount = await productsPage.getCartCount();
        expect(cartCount).toBe(productCount);
    });
});

test('Select multiple products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productToBeSelected = [
        ProductEnum.SAUCE_LABS_BACKPACK,
        ProductEnum.SAUCE_LABS_BIKE_LIGHT,
        ProductEnum.TEST_ALL_THE_THINGS_T_SHIRT_RED
    ];
    let productCount: number = 0;

    await test.step(`Add following products to cart: ${productToBeSelected.join(', ')}`, async () => {
        for (const product of productToBeSelected) {
            await productsPage.addToCart(product);
            productCount++;
        }
    })

    await test.step(`Cart count should be ${productCount}`, async () => {
        const cartCount = await productsPage.getCartCount();
        expect(cartCount).toBe(productCount);
    });

    await test.step(`Verify if following products: ${productToBeSelected.join(', ')} are selected`, async () => {
        for (const product of productToBeSelected) {
            const isSelected = await productsPage.isProductSelected(product);
            expect(isSelected).toBe(true);
        }
    });
})

test('Verify selected products in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const productToBeSelected = [
        ProductEnum.SAUCE_LABS_BACKPACK,
        ProductEnum.SAUCE_LABS_BIKE_LIGHT,
        ProductEnum.TEST_ALL_THE_THINGS_T_SHIRT_RED
    ];

    const selectedProducts: Product[] = [];

    await test.step(`Add following products to cart: ${productToBeSelected.join(', ')} and make sure every product is selected`, async () => {
        for (const product of productToBeSelected) {
            const productDetails = await productsPage.getProductDetails(product);
            await productsPage.addToCart(product);
            selectedProducts.push(productDetails!);

            const isSelected = await productsPage.isProductSelected(product);
            expect(isSelected).toBe(true);
        }
    })

    await test.step(`Cart count should be ${productToBeSelected.length}`, async () => {
        const cartCount = await productsPage.getCartCount();
        expect(cartCount).toBe(productToBeSelected.length);
    });

    await test.step(`Go to cart page by clicking cart button`, async () => {
        await productsPage.cartButton.click();
    });

    await test.step('Make sure to be on cart page', async () => {
        await cartPage.verifyOnCartPage();
    });

    await test.step(`Verify if following products: ${productToBeSelected.join(', ')} are on the cart page`, async () => {
        for (const product of selectedProducts) {
            await cartPage.verifyCartItem(product);
        }
    });
})

test('[E2E] Make a purchase', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    const productToBeSelected = [
        ProductEnum.SAUCE_LABS_BACKPACK,
        ProductEnum.SAUCE_LABS_BIKE_LIGHT,
        ProductEnum.TEST_ALL_THE_THINGS_T_SHIRT_RED
    ];

    const selectedProducts: Product[] = [];

    await test.step(`Add following products to cart: ${productToBeSelected.join(', ')} and make sure every product is selected`, async () => {
        for (const product of productToBeSelected) {
            const productDetails = await productsPage.getProductDetails(product);
            await productsPage.addToCart(product);
            selectedProducts.push(productDetails!);

            const isSelected = await productsPage.isProductSelected(product);
            expect(isSelected).toBe(true);
        }
    })

    await test.step(`Cart count should be ${productToBeSelected.length}`, async () => {
        const cartCount = await productsPage.getCartCount();
        expect(cartCount).toBe(productToBeSelected.length);
    });

    await test.step(`Go to cart page by clicking cart button`, async () => {
        await productsPage.cartButton.click();
    });

    await test.step('Make sure to be on cart page', async () => {
        await cartPage.verifyOnCartPage();
    });

    await test.step(`Verify if following products: ${productToBeSelected.join(', ')} are on the cart page`, async () => {
        for (const product of selectedProducts) {
            await cartPage.verifyCartItem(product);
        }
    });

    await test.step('Go to checkout page by clicking checkout button', async () => {
        await cartPage.checkoutButton.click();
    });

    await test.step('Make sure to be on checkout page', async () => {
        await checkoutPage.verifyOnCheckoutPage();
    });

    // Fill in user details
    const userDetails: UserDetailsProps = {
        firstName: "John",
        lastName: "Doe",
        zipCode: "12345"
    };

    await test.step(`Fill in user details as follow: 
    First Name: ${userDetails.firstName}
    Last Name: ${userDetails.lastName}
    Zip Code: ${userDetails.zipCode}`, async () => {
        await checkoutPage.fillUserDetails(userDetails);
    });

    await test.step('Continue to checkout overview page by clicking continue button', async () => {
        await checkoutPage.continueButton.click();
    });


    await test.step('Make sure to be on checkout overview page', async () => {
        // await checkoutOverviewPage.verifyOnCheckoutOverviewPage();

    })

    await test.step(`Verify if following products: ${productToBeSelected.join(', ')} are on the checkout overview page`, async () => {
        for (const product of selectedProducts) {
            // Verify each product in the overview page
            await checkoutOverviewPage.verifyProduct(product);
        }
    })

    const expectedSubtotal = selectedProducts.reduce((sum, product) => {
        const price = parseFloat(product.price.replace('$', '').replace(',', ''));
        return sum + (isNaN(price) ? 0 : price * product.qty!);
    }, 0);


    await test.step(`Make sure total price is $ ${expectedSubtotal.toFixed(2)}`, async () => {
        await checkoutOverviewPage.verifyTotalPrice(selectedProducts);
    })

    // await test.step('Click finish button', async () => {
    //     await checkoutOverviewPage.finishButton.click();
    // });
})

test("filter functionality", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const sortOptions: SortOptionKey = "PRICE_HIGH_TO_LOW";

    let baseProductList: Product[];

    await test.step("Get product list and store initial order", async () => {
        baseProductList = await productsPage.getProductList();
    });

    await test.step("Sort products by price", async () => {
        await productsPage.filterByCategory(sortOptions);
    });

    await test.step("Verify current order is not same as base measurement", async () => {
        const filteredProductList = await productsPage.getProductList();
        expect(filteredProductList).not.toEqual(baseProductList);
    });

    await test.step("Verify filtered products are in the correct order", async () => {
        await productsPage.verifyFilteredProductsOrder(sortOptions);
    })
})
