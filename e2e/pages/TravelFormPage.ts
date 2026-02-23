import { BasePage } from './BasePage';
import { Stagehand } from "@browserbasehq/stagehand";

export interface TravelFormData {
  tripType: string;
  travelers: number;
  flyingFrom: string;
  flyingTo: string;
  fromDate: string;
  toDate: string;
  budget: number;
}

export class TravelFormPage extends BasePage {
  constructor(stagehand: Stagehand) {
    super(stagehand);
  }

  async goto(): Promise<void> {
    const url = `${process.env.APP_URL_LOCAL || 'http://localhost:5173'}/plan`;
    await this.navigateTo(url);
    await this.waitForPageLoad();
  }

  async selectTripType(type: string): Promise<void> {
    await this.act(`click on the ${type} trip type button`);
  }

  async setTravelers(count: number): Promise<void> {
    await this.act(`set the number of travelers to ${count}`);
  }

  async incrementTravelers(): Promise<void> {
    await this.act("click the increment travelers button");
  }

  async decrementTravelers(): Promise<void> {
    await this.act("click the decrement travelers button");
  }

  async setFlyingFrom(city: string): Promise<void> {
    await this.act(`type ${city} in the flying from field`);
  }

  async setFlyingTo(city: string): Promise<void> {
    await this.act(`type ${city} in the flying to field`);
  }

  // date inputs use a native calendar popup — locator.fill() doesn't trigger React's onChange,
  // so we use the native HTMLInputElement setter to bypass React's internal value tracking
  async setFromDate(date: string): Promise<void> {
    await this.page.evaluate(([selector, val]: string[]) => {
      const el = document.querySelector(selector) as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, ['#fromDate', date]);
  }

  async setToDate(date: string): Promise<void> {
    await this.page.evaluate(([selector, val]: string[]) => {
      const el = document.querySelector(selector) as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, ['#toDate', date]);
  }

  async setBudget(amount: number): Promise<void> {
    await this.act(`type ${amount} in the budget field`);
  }

  async fillValidForm(data: TravelFormData): Promise<void> {
    await this.selectTripType(data.tripType);
    await this.setFlyingFrom(data.flyingFrom);
    await this.setFlyingTo(data.flyingTo);
    await this.setFromDate(data.fromDate);
    await this.setToDate(data.toDate);
    await this.setBudget(data.budget);
  }

  async submitForm(): Promise<void> {
    await this.act('click the Plan my Trip button');
  }

  async getTravelersValue(): Promise<string> {
    return await this.getInputValue('input[type="number"]#travelers');
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.observe("the Plan my Trip button is enabled");
  }

  async isSubmitButtonDisabled(): Promise<boolean> {
    return await this.observe("the Plan my Trip button is disabled");
  }

  async hasValidationError(fieldName: string): Promise<boolean> {
    return await this.observe(`there is a validation error message for the ${fieldName} field`);
  }

  async getValidationErrorMessage(fieldName: string): Promise<string> {
    const result = await this.extract(
      `get the validation error message for the ${fieldName} field`
    ) as { errorMessage: string };
    return result.errorMessage || '';
  }

  async areTravelerControlsDisabled(): Promise<boolean> {
    return await this.observe("the increment and decrement buttons for travelers are disabled");
  }

  async dismissError(): Promise<void> {
    await this.act("click the Dismiss button");
  }

  async hasError(): Promise<boolean> {
    return await this.exists('.bg-red-100');
  }
}
