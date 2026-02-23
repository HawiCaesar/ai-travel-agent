import { BasePage } from './BasePage';
import { Stagehand } from "@browserbasehq/stagehand";

export class ResultsPage extends BasePage {
  constructor(stagehand: Stagehand) {
    super(stagehand);
  }

  async goto(): Promise<void> {
    const url = `${process.env.APP_URL_LOCAL || 'http://localhost:5173'}/results`;
    await this.navigateTo(url);
    await this.waitForPageLoad();
  }

  async getRoute(): Promise<string> {
    return await this.getText('#route');
  }

  async hasWeather(): Promise<boolean> {
    return await this.observe("weather information is displayed");
  }

  async hasFlightRecommendations(): Promise<boolean> {
    return await this.observe("flight recommendations are displayed with a Book button");
  }

  async hasHotelRecommendations(): Promise<boolean> {
    return await this.observe("hotel recommendations are displayed with a Book button");
  }

  async hasActivities(): Promise<boolean> {
    return await this.observe("activities to do are listed");
  }

  async getActivitiesList(): Promise<string[]> {
    const result = await this.extract(
      "get the list of activities to do"
    ) as { activities: string[] };
    return result.activities || [];
  }

  async clickGoBack(): Promise<void> {
    await this.act("click the Go Back button");
  }

  async hasTripSummary(): Promise<boolean> {
    return await this.observe("the trip summary with dates and route is displayed");
  }

  async clickShareOnX(): Promise<void> {
    await this.act("click the Share on X button");
  }

  async clickShare(): Promise<void> {
    await this.act("click the Share button");
  }

  async clickBookFlight(): Promise<void> {
    await this.act("click the Book button in the Flights section");
  }

  async clickBookHotel(): Promise<void> {
    await this.act("click the Book button in the Hotel section");
  }
}
