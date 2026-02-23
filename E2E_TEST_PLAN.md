# E2E Testing Plan: BrowserBase + Stagehand v3

## Context

The travel agent AI application currently has **zero automated testing** despite having complex business logic including:
- Multi-step form validation with cascading rules (trip type affects min travelers, date dependencies)
- Real-time inline validation across 7 form fields
- API integration with Cloudflare Worker for AI-powered recommendations
- State management via React Context
- Accessibility features (ARIA labels, keyboard navigation)
- Mobile-first responsive design

**Problem**: Without automated e2e tests, regressions can slip into production. The app is deployed to Netlify with real users, but there's no safety net to catch breaking changes before deployment.

**Goal**: Implement comprehensive end-to-end tests using BrowserBase (cloud browser infrastructure) and Stagehand v3 (AI-powered browser automation) to validate critical user journeys and catch regressions early.

**Why BrowserBase + Stagehand v3**:
- BrowserBase provides cloud-hosted browsers (no local browser management)
- Stagehand v3 uses AI to simulate real user behavior (natural interactions)
- Combination allows writing tests that mimic actual users, not brittle selectors
- Session debugging via BrowserBase dashboard

---

## Approach

### File Organization Strategy

**Decision**: Create separate `E2E_TEST_PLAN.md` documentation file + reference section in `CLAUDE.md`

**Structure**:
```
travel-agent-ai/
├── E2E_TEST_PLAN.md              # NEW: Comprehensive e2e test documentation
├── CLAUDE.md                     # UPDATE: Add reference to e2e tests
├── e2e/                          # NEW: All test code
│   ├── tests/                    # Test scenarios organized by type
│   │   ├── user-flows/          # Complete user journey tests
│   │   │   ├── happy-path.spec.ts
│   │   │   ├── validation-flows.spec.ts
│   │   │   └── api-error-flows.spec.ts
│   │   ├── components/          # Component-specific tests
│   │   │   ├── form-validation.spec.ts
│   │   │   ├── trip-type-selection.spec.ts
│   │   │   ├── date-picker.spec.ts
│   │   │   └── accessibility.spec.ts
│   │   └── edge-cases/          # Edge case scenarios
│   │       ├── state-management.spec.ts
│   │       └── mobile-responsive.spec.ts
│   ├── pages/                   # Page Object Models
│   │   ├── BasePage.ts          # Base class with AI utilities
│   │   ├── LandingPage.ts       # Landing page interactions
│   │   ├── TravelFormPage.ts    # Form page interactions
│   │   └── ResultsPage.ts       # Results page interactions
│   ├── helpers/                 # Test utilities
│   │   ├── stagehand-config.ts  # Stagehand initialization
│   │   └── selectors.ts         # Shared selectors
│   └── fixtures/                # Test data
│       └── test-data.ts         # Form data scenarios
├── .env.test                    # NEW: Test environment variables
├── vitest.config.e2e.ts         # NEW: Vitest config for e2e
└── package.json                 # UPDATE: Add test dependencies & scripts
```

### Test Execution Flow

```
Developer/CI → npm run test:e2e
    ↓
Vitest loads vitest.config.e2e.ts
    ↓
Initialize Stagehand with BrowserBase
    ↓
For each test:
    1. Launch cloud browser session
    2. Navigate to app (localhost or staging)
    3. Use AI to simulate user interactions
    4. Assert expected outcomes
    5. Close session
    ↓
Generate test report
```

### API Interaction Strategy

**Decision**: Real API by default (no mocking)

**Configuration**:
- Tests will hit the actual Cloudflare Worker API
- Uses real OpenAI API calls through the worker
- More realistic but slower and consumes API credits
- Requires backend to be available during test runs

**Trade-offs**:
- ✅ Tests the full integration stack
- ✅ Catches backend regressions
- ✅ No mock data to maintain
- ❌ Slower test execution
- ❌ Costs API credits
- ❌ Requires stable backend

**Future Enhancement**: Can add optional mocking for specific error scenarios if needed.

---

## Implementation Steps

### Step 1: Install Dependencies

Add to `package.json`:
```json
{
  "devDependencies": {
    "@browserbasehq/stagehand": "^3.x.x",
    "vitest": "^2.x.x",
    "zod": "^3.x.x",
    "dotenv": "^16.x.x",
    "@types/node": "^20.x.x"
  }
}
```

Run: `npm install`

### Step 2: Configure Environment

Create `.env.test`:
```bash
# BrowserBase Configuration
BROWSERBASE_API_KEY=your_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here

# LLM Provider (Anthropic Claude Sonnet 4)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
MODEL_NAME=anthropic/claude-sonnet-4-20250514

# Application URLs
APP_URL_LOCAL=http://localhost:5173
APP_URL_STAGING=https://hawiz-ai-travel-agent.netlify.app

# Backend API (Real API - no mocking)
API_URL=https://ai-travel-agent-worker.hawitrial.workers.dev/

# Test Configuration
HEADLESS=true
TIMEOUT_MS=30000
SLOW_MO=0
```

### Step 3: Create Vitest Configuration

File: `vitest.config.e2e.ts`
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    name: 'e2e',
    testMatch: ['e2e/tests/**/*.spec.ts'],
    globals: true,
    environment: 'node',
    timeout: 30000,
    hookTimeout: 30000,
    retry: 2, // Retry flaky tests twice
    reporters: ['verbose'],
  },
  resolve: {
    alias: {
      '@e2e': path.resolve(__dirname, './e2e'),
      '@fixtures': path.resolve(__dirname, './e2e/fixtures'),
      '@helpers': path.resolve(__dirname, './e2e/helpers')
    }
  }
});
```

### Step 4: Add NPM Scripts

Update `package.json` scripts:
```json
{
  "scripts": {
    "test:e2e": "vitest run --config vitest.config.e2e.ts",
    "test:e2e:watch": "vitest --config vitest.config.e2e.ts",
    "test:e2e:headed": "HEADLESS=false vitest run --config vitest.config.e2e.ts",
    "test:e2e:local": "APP_URL_LOCAL=http://localhost:5173 vitest run --config vitest.config.e2e.ts"
  }
}
```

### Step 5: Implement Core Infrastructure

#### 5.1 Stagehand Configuration Helper
File: `e2e/helpers/stagehand-config.ts`

Responsibilities:
- Initialize Stagehand with BrowserBase
- Configure Anthropic Claude Sonnet 4 model
- Manage browser session lifecycle
- Provide session URL for debugging

Key methods:
- `initialize()`: Set up Stagehand + BrowserBase connection
- `cleanup()`: Close browser session
- `getSessionUrl()`: Get BrowserBase debug URL

#### 5.2 Base Page Object Model
File: `e2e/pages/BasePage.ts`

Responsibilities:
- Abstract common page interactions
- Combine AI-driven actions with code-based selectors
- Provide utilities for navigation, assertions, screenshots

Key methods:
- `act(instruction)`: AI-driven user action (e.g., "click the submit button")
- `observe(condition)`: AI-driven state check (e.g., "error message is displayed")
- `getText(selector)`: Get element text content
- `exists(selector)`: Check if element exists
- `waitFor(selector)`: Wait for element to appear

#### 5.3 Page Object Models
Files: `e2e/pages/LandingPage.ts`, `TravelFormPage.ts`, `ResultsPage.ts`

Each model:
- Extends BasePage
- Defines page-specific navigation (`goto()`)
- Provides high-level interaction methods
- Encapsulates page selectors

Example - TravelFormPage:
```typescript
class TravelFormPage extends BasePage {
  async goto() {
    await this.page.goto(`${process.env.APP_URL_LOCAL}/plan`);
  }

  async selectTripType(type: string) {
    await this.act(`select ${type} trip type`);
  }

  async fillValidForm(data: FormData) {
    await this.selectTripType(data.tripType);
    await this.act(`type ${data.flyingFrom} in the flying from field`);
    // ... etc
  }

  async submitForm() {
    await this.act('click the Plan my Trip button');
  }

  async getTravelersValue(): Promise<string> {
    return await this.getText('input[type="number"][id*="travelers"]');
  }
}
```

---

## All 6 Test Priorities

### Priority 1: Happy Path - Complete User Journey

**File**: `e2e/tests/user-flows/happy-path.spec.ts`

**Test Scenario**: User successfully completes trip planning from landing to results

**Steps**:
1. Navigate to landing page
2. Click "Let's Begin"
3. Verify navigation to `/plan`
4. Fill complete valid form:
   - Trip type: couple
   - Travelers: 2 (auto-set)
   - Flying from: New York City
   - Flying to: Paris
   - From date: tomorrow
   - To date: 7 days from tomorrow
   - Budget: $5000
5. Submit form
6. Wait for API response (real Cloudflare Worker call)
7. Verify navigation to `/results`
8. Assert results display:
   - Trip summary (route, dates)
   - Weather section
   - Flight recommendations with Book button
   - Hotel recommendations with Book button
   - Activities list

**Why Critical**: Validates the entire business flow end-to-end with real API.

### Priority 2: Form Validation Flows

**File**: `e2e/tests/user-flows/validation-flows.spec.ts`

**Test Scenarios**:

1. **Empty form submission attempt**
   - Leave all fields empty
   - Verify submit button is disabled
   - No error messages shown until user interacts

2. **Trip type cascading validation**
   - Select solo → verify travelers = 1, increment/decrement disabled
   - Change to couple → verify travelers auto-updates to 2, controls enabled
   - Try to decrement below 2 → verify stays at 2

3. **Date validation - Past dates**
   - Select yesterday's date for departure
   - Verify error: "Departure date must be today or later"

4. **Date validation - Return before departure**
   - Select valid departure (tomorrow)
   - Select return date before departure
   - Verify error: "Return date must be after departure date"

5. **Budget validation**
   - Enter negative number → error displayed
   - Enter zero → error displayed
   - Enter valid positive number → error cleared

6. **Real-time validation**
   - Fill field with invalid data → error appears immediately
   - Correct the field → error disappears immediately

7. **All fields required**
   - Fill all except one field
   - Verify submit button disabled
   - Fill last field → submit button enabled

**Why Critical**: Form validation is the most complex logic in the app with cascading dependencies.

### Priority 3: API Error Handling

**File**: `e2e/tests/user-flows/api-error-flows.spec.ts`

**Test Scenarios**:

1. **Network timeout**
   - Fill valid form
   - Simulate slow network (if possible with request interception)
   - Verify error message: "Network error. Please check your connection and try again."

2. **API returns error response**
   - Test against edge case destinations/dates that might fail
   - Verify error message displayed
   - Verify error is user-friendly

3. **Error message dismissal**
   - Trigger API error
   - Click "Dismiss" button
   - Verify error message disappears
   - Verify form data is preserved (not cleared)

4. **Retry after error**
   - Get API error
   - Dismiss error
   - Adjust form data
   - Resubmit successfully

**Why Critical**: Users must be able to recover from errors gracefully.

**Note**: With real API, errors might be rare. May need to test with intentionally invalid data (e.g., flying from/to same city).

### Priority 4: Navigation and State Management

**File**: `e2e/tests/edge-cases/state-management.spec.ts`

**Test Scenarios**:

1. **Form data persists after submission**
   - Submit form successfully
   - Verify TravelContext contains form data
   - Verify results page displays correct data from context

2. **"Go Back" resets state**
   - From results page, click "Go Back"
   - Verify navigation to `/plan`
   - Verify all form fields are cleared (reset to defaults)

3. **Direct navigation to /results without data**
   - Navigate directly to `/results` URL
   - Verify page handles missing data gracefully (doesn't crash)

4. **Browser back button from results**
   - Complete journey to results
   - Click browser back button
   - Verify behavior (should go back to form)
   - Verify form state

**Why Critical**: State management via TravelContext is core to the app architecture.

### Priority 5: Accessibility Testing

**File**: `e2e/tests/components/accessibility.spec.ts`

**Test Scenarios**:

1. **Keyboard navigation through form**
   - Use Tab key to navigate through all fields
   - Verify focus moves in logical order
   - Verify focus visible (ring styles applied)
   - Verify all interactive elements are reachable

2. **Enter key form submission**
   - Fill valid form
   - Focus on submit button
   - Press Enter key
   - Verify form submits

3. **ARIA labels present**
   - Verify all buttons have aria-label or descriptive text
   - Verify all form inputs have associated labels
   - Verify trip type buttons have proper labels

4. **Error messages accessible**
   - Trigger validation error
   - Verify error message is associated with input
   - Check for aria-describedby linking

5. **Touch target sizes**
   - Measure button dimensions
   - Verify all interactive elements meet 44x44px minimum
   - Test on mobile viewport (375px width)

**Why Critical**: Accessibility is explicitly documented in CLAUDE.md as a requirement.

### Priority 6: Mobile Responsive Behavior

**File**: `e2e/tests/edge-cases/mobile-responsive.spec.ts`

**Test Scenarios**:

1. **Mobile viewport (375px)**
   - Set viewport to 375x667 (iPhone SE)
   - Complete full journey
   - Verify layout doesn't break
   - Verify trip type pills wrap correctly

2. **Tablet viewport (768px)**
   - Set viewport to 768x1024 (iPad)
   - Verify form layout adjusts appropriately
   - Verify results cards display correctly

3. **Date picker on mobile**
   - On mobile viewport, interact with date inputs
   - Verify native date picker appears
   - Verify dates can be selected

4. **Results cards stacking**
   - On mobile viewport, navigate to results
   - Verify cards stack vertically
   - Verify no horizontal overflow

5. **Touch interactions**
   - Simulate touch events on buttons
   - Verify increment/decrement work with touch
   - Verify trip type selection works with touch

**Why Critical**: App is explicitly mobile-first per CLAUDE.md design principles.

---

## Critical Files to Create

### 1. `e2e/helpers/stagehand-config.ts`
**Purpose**: Core Stagehand v3 initialization with BrowserBase
**Why Critical**: Single source of truth for all test setup. Every test depends on this.

**Key Implementation Details**:
- Initialize Stagehand with `env: "BROWSERBASE"`
- Configure Anthropic Claude Sonnet 4 model (anthropic/claude-sonnet-4-20250514)
- Set headless/slowMo from environment variables
- Export `StagehandTestRunner` class with `initialize()` and `cleanup()` methods

### 2. `e2e/pages/BasePage.ts`
**Purpose**: Base Page Object Model class
**Why Critical**: Defines abstraction combining AI actions with code selectors. All page models inherit this.

**Key Implementation Details**:
- Abstract `goto()` method
- `act(instruction)` wrapper around `stagehand.act()`
- `observe(condition)` wrapper around `stagehand.observe()`
- Helper methods: `getText()`, `exists()`, `waitFor()`, `screenshot()`

### 3. `e2e/pages/TravelFormPage.ts`
**Purpose**: Travel form page interactions
**Why Critical**: Most complex page with all form validation logic. Used in majority of tests.

**Key Implementation Details**:
- `fillValidForm(data)`: Fill complete form with test data
- `selectTripType(type)`: Select trip type via AI
- `getTravelersValue()`: Get current travelers input value
- `submitForm()`: Click submit button
- `getErrorMessage(fieldName)`: Get validation error for field

### 4. `e2e/pages/LandingPage.ts`
**Purpose**: Landing page interactions
**Why Critical**: Entry point for all user journeys.

**Key Implementation Details**:
- `goto()`: Navigate to `/`
- `clickBegin()`: Click "Let's Begin" button via AI

### 5. `e2e/pages/ResultsPage.ts`
**Purpose**: Results page interactions and assertions
**Why Critical**: Final step of user journey, validates API response display.

**Key Implementation Details**:
- `goto()`: Navigate to `/results`
- `getRoute()`: Extract displayed route (NYC → Paris)
- `hasWeather()`: Check if weather section exists
- `hasFlightRecommendations()`: Check flight section
- `hasHotelRecommendations()`: Check hotel section
- `getActivitiesList()`: Get all activities
- `clickGoBack()`: Navigate back to form

### 6. `e2e/tests/user-flows/happy-path.spec.ts`
**Purpose**: Complete journey test
**Why Critical**: Most important test. Validates core business value.

**Key Implementation Details**:
- Full flow: Landing → Form → Submit → Results
- Uses all three page object models
- Calls real API
- Comprehensive assertions at each step
- Serves as template for other tests

### 7. `vitest.config.e2e.ts`
**Purpose**: Vitest configuration for e2e tests
**Why Critical**: Required for any tests to run. Defines test discovery, timeouts, aliases.

**Key Implementation Details**:
- `testMatch: ['e2e/tests/**/*.spec.ts']`
- `timeout: 30000` (30s for API calls)
- `retry: 2` (retry flaky tests)
- Path aliases: `@e2e`, `@fixtures`, `@helpers`

### 8. `e2e/fixtures/test-data.ts`
**Purpose**: Shared test data constants
**Why Critical**: Single source of truth for test data. Prevents duplication.

**Key Implementation Details**:
```typescript
export const validFormData = {
  solo: { tripType: 'solo', travelers: 1, ... },
  couple: { tripType: 'couple', travelers: 2, ... },
  family: { tripType: 'family', travelers: 4, ... }
};
```

### 9. `.env.test`
**Purpose**: Test environment configuration
**Why Critical**: Contains API keys and environment-specific URLs.

**Security Note**: Add to `.gitignore`, never commit API keys.

### 10. `E2E_TEST_PLAN.md`
**Purpose**: Comprehensive documentation of e2e testing strategy
**Why Critical**: Reference for all developers. Documents decisions, setup, and scenarios.

### 11. `CLAUDE.md` (update)
**Purpose**: Add reference section pointing to e2e tests
**Why Critical**: Makes e2e tests discoverable from main project documentation.

**Section to Add**:
```markdown
## Testing
- E2E Tests: See E2E_TEST_PLAN.md for comprehensive end-to-end testing strategy using BrowserBase and Stagehand v3
- Test execution: `npm run test:e2e`
- Test files located in `e2e/` directory
```

---

## Verification Steps

### 1. Setup Verification
```bash
# Install dependencies
npm install

# Verify Stagehand installed
npm list @browserbasehq/stagehand

# Verify .env.test exists and has keys
cat .env.test | grep BROWSERBASE_API_KEY
```

### 2. Run First Test (Happy Path)
```bash
# Start dev server in one terminal
npm run dev

# Run happy path test in another terminal
npm run test:e2e -- e2e/tests/user-flows/happy-path.spec.ts
```

**Expected Output**:
- ✓ Test passes (completes journey from landing to results)
- BrowserBase session URL printed in output (for debugging)
- Test duration ~30-60 seconds (due to real API call)

### 3. Run All Tests
```bash
npm run test:e2e
```

**Expected Output**:
- All test suites pass
- Total tests: ~15-20 scenarios across all priorities
- Some tests may take longer due to real API calls

### 4. Debug Failed Tests
```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Or check BrowserBase session URL from test output
# Visit URL to replay session in BrowserBase dashboard
```

### 5. Verify All 6 Priorities Covered
```bash
# Check test files exist
ls e2e/tests/user-flows/happy-path.spec.ts
ls e2e/tests/user-flows/validation-flows.spec.ts
ls e2e/tests/user-flows/api-error-flows.spec.ts
ls e2e/tests/edge-cases/state-management.spec.ts
ls e2e/tests/components/accessibility.spec.ts
ls e2e/tests/edge-cases/mobile-responsive.spec.ts
```

### 6. Test Against Staging
```bash
# Run tests against deployed Netlify app
npm run test:e2e:staging
```

**Expected**: All tests pass against live production environment.

---

## Success Criteria

1. ✅ All dependencies installed and configured
2. ✅ Vitest runs and discovers e2e tests
3. ✅ Happy path test passes (landing → form → results)
4. ✅ All 6 test priorities implemented with passing tests
5. ✅ Tests can run against both local dev server and staging
6. ✅ BrowserBase sessions recorded and accessible for debugging
7. ✅ Real API integration working (Cloudflare Worker responds)
8. ✅ E2E_TEST_PLAN.md documentation complete
9. ✅ CLAUDE.md updated with testing section
10. ✅ No test flakiness (tests consistently pass on reruns)

---

## Future Enhancements (Post-Implementation)

1. **CI/CD Integration**: Add GitHub Actions workflow for automated test runs on PRs
2. **API Mocking Option**: Implement optional mocking for faster local development
3. **Visual Regression Testing**: Add screenshot comparison for UI changes
4. **Performance Testing**: Measure and assert page load times
5. **Cross-Browser Testing**: Test in different browsers via BrowserBase
6. **Test Parallelization**: Run test shards in parallel for faster execution
7. **Flaky Test Detection**: Automatic retry and reporting of flaky tests
