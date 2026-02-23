import { Stagehand } from "@browserbasehq/stagehand";

export abstract class BasePage {
  constructor(protected stagehand: Stagehand) {}

  /**
   * Navigate to the page
   */
  abstract goto(): Promise<void>;

  /**
   * Get the current page
   */
  get page() {
    return this.stagehand.context.activePage()!;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  /**
   * Act - AI-driven interaction
   */
  async act(instruction: string): Promise<void> {
    await this.stagehand.act(instruction);
  }

  /**
   * Extract - Get structured data using AI
   */
  async extract<T>(instruction: string, schema?: any): Promise<T> {
    if (schema) {
      return await this.stagehand.extract(instruction, schema);
    }
    return await this.stagehand.extract(instruction);
  }

  /**
   * Observe - Check page state
   * Returns true if the instruction finds matching elements
   */
  async observe(instruction: string): Promise<boolean> {
    const actions = await this.stagehand.observe(instruction);
    return actions && actions.length > 0;
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).first().textContent() || '';
  }

  /**
   * Get value of an input element
   */
  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).first().inputValue();
  }

  /**
   * Check if element exists
   */
  async exists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Wait for element
   */
  async waitFor(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Take screenshot for debugging
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `e2e/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}
