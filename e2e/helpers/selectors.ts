/**
 * Shared CSS selectors for the application
 * Note: With Stagehand's AI-driven approach, we minimize selector usage
 * These are kept for simple element checks where AI isn't needed
 */

export const selectors = {
  // Form elements
  form: {
    travelersInput: 'input[type="number"]',
    flyingFromInput: 'input[placeholder*="flying from" i]',
    flyingToInput: 'input[placeholder*="flying to" i]',
    fromDateInput: 'input[type="date"]:first-of-type',
    toDateInput: 'input[type="date"]:last-of-type',
    budgetInput: 'input[type="number"][placeholder*="budget" i]',
    submitButton: 'button[type="submit"]',
  },

  // Error messages
  errors: {
    errorContainer: '.bg-red-100',
    dismissButton: 'button:has-text("Dismiss")',
    validationError: '.text-red-600',
  },

  // Results page
  results: {
    weatherSection: '[class*="weather"]',
    flightSection: '[class*="flight"]',
    hotelSection: '[class*="hotel"]',
    activitiesList: 'ul, ol',
    goBackButton: 'button:has-text("Go Back")',
    shareButtons: 'button:has-text("Share")',
  },

  // Trip type buttons
  tripType: {
    solo: 'button:has-text("solo")',
    couple: 'button:has-text("couple")',
    friends: 'button:has-text("friends")',
    family: 'button:has-text("family")',
    business: 'button:has-text("business")',
  },

  // Common
  common: {
    body: 'body',
    logo: 'img, svg',
  }
};

/**
 * ARIA selectors for accessibility testing
 */
export const ariaSelectors = {
  buttons: '[role="button"], button',
  inputs: 'input, textarea, select',
  labels: 'label',
  errorMessages: '[role="alert"], [aria-live="polite"]',
};

/**
 * Helper to build custom selectors
 */
export const buildSelector = {
  byText: (text: string) => `text=${text}`,
  byPlaceholder: (placeholder: string) => `[placeholder*="${placeholder}" i]`,
  byAriaLabel: (label: string) => `[aria-label="${label}"]`,
  byTestId: (testId: string) => `[data-testid="${testId}"]`,
};
