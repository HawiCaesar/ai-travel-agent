import { BasePage } from './BasePage';
import { Stagehand } from "@browserbasehq/stagehand";

export class LandingPage extends BasePage {
  constructor(stagehand: Stagehand) {
    super(stagehand);
  }

  async goto(): Promise<void> {
    const url = process.env.APP_URL_LOCAL || 'http://localhost:5173';
    await this.navigateTo(url);
    await this.waitForPageLoad();
  }

  async clickBegin(): Promise<void> {
    await this.act("click on the Let's Begin button");
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.exists('img[alt="AI Travel Agent Logo"]');
  }
}
