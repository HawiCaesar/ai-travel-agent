import { Stagehand } from "@browserbasehq/stagehand";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export interface StagehandTestConfig {
  headless?: boolean;
  slowMo?: number;
  timeout?: number;
  enableLogging?: boolean;
}

export class StagehandTestRunner {
  private stagehand: Stagehand | null = null;

  async initialize(config: StagehandTestConfig = {}) {
    const {
      headless = process.env.HEADLESS === 'true',
      slowMo = Number(process.env.SLOW_MO) || 0,
      timeout = Number(process.env.TIMEOUT_MS) || 30000,
      enableLogging = false
    } = config;

    this.stagehand = new Stagehand({
      env: "BROWSERBASE", // Use BrowserBase cloud infrastructure
      apiKey: process.env.BROWSERBASE_API_KEY!,
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      model: {
        modelName: "anthropic/claude-sonnet-4-20250514",
        apiKey: process.env.ANTHROPIC_API_KEY!,
      },
      domSettleTimeout: 3000,
      verbose: enableLogging ? 1 : 0,
    });

    await this.stagehand.init();

    return this.stagehand;
  }

  async cleanup() {
    if (this.stagehand) {
      try {
        await this.stagehand.close();
      } catch {
        // Session may already be closed by BrowserBase — ignore
      } finally {
        this.stagehand = null;
      }
    }
  }

  getSessionUrl(): string | null {
    // BrowserBase provides session URLs for debugging
    // Format: https://browserbase.com/sessions/{session_id}
    return this.stagehand?.browserbaseSessionID
      ? `https://browserbase.com/sessions/${this.stagehand.browserbaseSessionID}`
      : null;
  }

  getStagehand(): Stagehand | null {
    return this.stagehand;
  }
}
