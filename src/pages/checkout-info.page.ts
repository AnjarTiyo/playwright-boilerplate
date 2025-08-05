import { expect, Locator, Page } from "@playwright/test";

export type UserDetailsProps = {
    firstName: string;
    lastName: string;
    zipCode: string;
};

export class CheckoutInfoPage {
    readonly page: Page;
    readonly header: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('//span[@data-test="title"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.zipCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
    }

    async verifyOnCheckoutPage() {
        const headerText = await this.header.textContent();
        await expect(headerText).toBe("Checkout: Your Information");
    }

    async fillUserDetails(userDetails: UserDetailsProps) {
        await this.firstNameInput.fill(userDetails.firstName);
        await this.lastNameInput.fill(userDetails.lastName);
        await this.zipCodeInput.fill(userDetails.zipCode);
    }
}