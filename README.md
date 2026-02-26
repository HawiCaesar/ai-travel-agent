# AI Travel Agent
A mobile-first AI travel planning app using React, TypeScript, and OpenAI API. Uses mock flights and hotel data (done via OpenAI API LLM text generation) — real booking API integration is out of scope for this project.

The OpenAI API usage is found here https://github.com/HawiCaesar/ai-travel-agent-worker

Core Requirements
- Build from scratch ✅. Some very simple setup given from Scrimba
- Follow the design, see screen-1, screen-2, screen-3 page ✅
- Its a simple proof of concept ✅
- Make use of OpenAI API ✅
- Use the Weather API from OpenWeatherAPP ✅
- Use a frameworks/library of your choosing - used Typescript + React + Vite + Tailwind ✅

Stretch Goals
- Make your own design - Added a back button / redo travel details. Solo travel, friends vacation, family vacation. ✅
- List activity ideas based on vacations -  3 ideas ✅
- Make trip shareable ✅ (console.log for now, hehe)
- Add AI generated images where appropriate ✅ an ai generated image depicting the weather.

# Getting Started
Install the dependencies and run the project
```
npm install
npm start
npm run dev
```

## Testing
End-to-end tests validate critical user journeys using BrowserBase and Stagehand v3 (AI-powered browser automation).

**Test Framework**: Vitest + Stagehand v3 + BrowserBase (cloud browsers)
**AI Model**: Anthropic Claude Sonnet 4

### Running Tests
```bash
# Run all e2e tests
npm run test:e2e

# Run specific test
npm run test:e2e -- e2e/tests/user-flows/happy-path.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### Test Structure
```
e2e/
  tests/user-flows/       # Complete user journey tests
    happy-path.spec.ts    # ✅ Verified working on BrowserBase
  pages/                  # Page Object Models (AI + code hybrid)
  fixtures/               # Test data and helpers
  helpers/                # Stagehand configuration
```

### Key Features
- **AI-driven interactions**: Uses natural language to simulate real user behavior
- **Self-healing tests**: Automatically adapts when UI changes
- **Cloud browsers**: No local browser setup required
- **Real API testing**: Tests against actual Cloudflare Worker backend

### Test Coverage
- ✅ **Happy Path**: Complete journey (landing → form → API → results) - verified working
  - 📹 [Video evidence](https://drive.google.com/file/d/1eDaFyyv05X36eVwXsed6bXHuoDgO5Crh/view?usp=sharing) - BrowserBase execution
- ✅ **Form Validation Flows**: Cascading validation, real-time errors - verified working locally and on BrowserBase
  - 📹 [Video evidence](https://drive.google.com/file/d/1qHURkkhwAN3rcMXyKC3zyzpgYbc_D4rw/view?usp=sharing) - BrowserBase execution
- 🚧 API error handling (network failures, retry logic)
- 🚧 State management (TravelContext persistence and reset)
- 🚧 Accessibility (keyboard navigation, ARIA labels)
- 🚧 Mobile responsive (viewport testing, touch interactions)


