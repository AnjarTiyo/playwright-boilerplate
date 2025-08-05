import { Locator, Page } from "@playwright/test";
import { BASE_URL } from "../fixtures/url.fixture";
import { LOCKED_OUT_USER, PROBLEM_USER, STANDARD_USER, UserEnum, UserType } from "../data/user-credentials.data";

export class LoginPage {
    readonly page: Page;
    readonly inputUsername: Locator
    readonly inputPassword: Locator
    readonly buttonLogin: Locator

    constructor(page: Page) {
        this.page = page;
        this.inputUsername = page.locator('input[name="user-name"]');
        this.inputPassword = page.locator('input[name="password"]');
        this.buttonLogin = page.locator('//input[@data-test="login-button"]');
    }

    async goto() {
        await this.page.goto(BASE_URL);
    }

    async login(username: string, password: string) {
        await this.inputUsername.fill(username);
        await this.inputPassword.fill(password);
        await this.buttonLogin.click();
    }

    async loginAs(userType: UserEnum) {
        switch (userType) {
            case UserEnum.STANDARD_USER:
                await this.login(STANDARD_USER.username, STANDARD_USER.password);
                break;
            case UserEnum.LOCKED_OUT_USER:
                await this.login(LOCKED_OUT_USER.username, LOCKED_OUT_USER.password);
                break;
            case UserEnum.PROBLEM_USER:
                await this.login(PROBLEM_USER.username, PROBLEM_USER.password);
                break;
            default:
                throw new Error(`Invalid user type: ${userType}`);
        }
    }
}