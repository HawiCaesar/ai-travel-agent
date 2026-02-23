import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StagehandTestRunner } from '@helpers/stagehand-config';
import { LandingPage } from '@e2e/pages/LandingPage';
import { TravelFormPage } from '@e2e/pages/TravelFormPage';
import { ResultsPage } from '@e2e/pages/ResultsPage';
import { validFormData } from '@fixtures/test-data';
import { Stagehand } from '@browserbasehq/stagehand';

describe('Happy Path: Complete Trip Planning Journey', () => {
  let runner: StagehandTestRunner;
  let stagehand: Stagehand;

  beforeEach(async () => {
    runner = new StagehandTestRunner();
    stagehand = await runner.initialize();
  });

  afterEach(async () => {
    await runner.cleanup();
  });

  it('should complete full journey from landing to results', async () => {
    // STEP 1: Landing Page
    console.log('📍 Step 1: Navigating to Landing Page...');
    const landingPage = new LandingPage(stagehand);
    await landingPage.goto();

    // Verify landing page loaded
    const isLogoVisible = await landingPage.isLogoVisible();
    console.log(`✅ Logo visibility: ${isLogoVisible}`);
    expect(isLogoVisible).toBe(true);
    console.log('✅ Landing page loaded successfully');

    // Click "Let's Begin" button
    await landingPage.clickBegin();
    console.log('✅ Clicked "Let\'s Begin" button');

    // Verify navigation to /plan
    await landingPage.waitFor('input[type="number"]', 10000);
    const currentUrl = landingPage.getCurrentUrl();
    expect(currentUrl).toContain('/plan');
    console.log('✅ Navigated to form page');

    // STEP 2: Travel Form Page - Fill Complete Valid Form
    console.log('\n📍 Step 2: Filling travel form...');
    const formPage = new TravelFormPage(stagehand);
    const formData = validFormData.couple;

    // Select trip type
    await formPage.selectTripType(formData.tripType);
    console.log(`✅ Selected trip type: ${formData.tripType}`);

    // Verify travelers auto-set to 2 for couple
    await new Promise(r => setTimeout(r, 1000)); // Wait for auto-update
    const travelersValue = await formPage.getTravelersValue();
    expect(travelersValue).toBe('2');
    console.log('✅ Travelers auto-set to 2');

    // Fill flying from
    await formPage.setFlyingFrom(formData.flyingFrom);
    console.log(`✅ Set flying from: ${formData.flyingFrom}`);

    // Fill flying to
    await formPage.setFlyingTo(formData.flyingTo);
    console.log(`✅ Set flying to: ${formData.flyingTo}`);

    // Set departure date
    await formPage.setFromDate(formData.fromDate);
    console.log(`✅ Set departure date: ${formData.fromDate}`);

    // Set return date
    await formPage.setToDate(formData.toDate);
    console.log(`✅ Set return date: ${formData.toDate}`);

    // Enter budget
    await formPage.setBudget(formData.budget);
    console.log(`✅ Set budget: $${formData.budget}`);

    // Verify submit button is enabled
    const isSubmitEnabled = await formPage.isSubmitButtonEnabled();
    expect(isSubmitEnabled).toBe(true);
    console.log('✅ Submit button is enabled');

    // Submit form
    console.log('\n📍 Step 3: Submitting form and waiting for API...');
    await formPage.submitForm();
    console.log('✅ Form submitted');

    // Wait for navigation to results (API call may take time)
    await formPage.waitFor('.bg-brand-card', 60000);
    console.log('✅ Navigated to results page');

    // STEP 3: Results Page - Verify Results Display
    console.log('\n📍 Step 4: Verifying results...');
    const resultsPage = new ResultsPage(stagehand);

    // Verify we're on results page
    const resultsUrl = resultsPage.getCurrentUrl();
    expect(resultsUrl).toContain('/results');

    // Verify trip summary is displayed
    const hasTripSummary = await resultsPage.hasTripSummary();
    expect(hasTripSummary).toBe(true);
    console.log('✅ Trip summary displayed');

    // Verify route is displayed
    const route = await resultsPage.getRoute();
    expect(route).toBeTruthy();
    expect(route.toLowerCase()).toContain(formData.flyingFrom.toLowerCase().split(' ')[0]);
    console.log(`✅ Route displayed: ${route}`);

    // Verify weather section exists
    const hasWeather = await resultsPage.hasWeather();
    expect(hasWeather).toBe(true);
    console.log('✅ Weather information displayed');

    // Verify flight recommendations
    const hasFlights = await resultsPage.hasFlightRecommendations();
    expect(hasFlights).toBe(true);
    console.log('✅ Flight recommendations displayed');

    // Verify hotel recommendations
    const hasHotel = await resultsPage.hasHotelRecommendations();
    expect(hasHotel).toBe(true);
    console.log('✅ Hotel recommendations displayed');

    // Verify activities section
    const hasActivities = await resultsPage.hasActivities();
    expect(hasActivities).toBe(true);
    console.log('✅ Activities list displayed');

    console.log('\n🎉 Happy path test completed successfully!');

    // Print BrowserBase session URL for debugging
    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) {
      console.log(`\n🔍 BrowserBase Session: ${sessionUrl}`);
    }
  }, 180000); // 3 minute timeout — API call + BrowserBase session can take 2+ minutes
});
