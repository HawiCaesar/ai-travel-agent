import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StagehandTestRunner } from '@helpers/stagehand-config';
import { TravelFormPage } from '@e2e/pages/TravelFormPage';
import { invalidFormData, validFormData, getYesterdayDate, getTomorrowDate, getDateDaysFromNow } from '@fixtures/test-data';
import { Stagehand } from '@browserbasehq/stagehand';

describe('Form Validation Flows', () => {
  let runner: StagehandTestRunner;
  let stagehand: Stagehand;
  let formPage: TravelFormPage;

  beforeEach(async () => {
    runner = new StagehandTestRunner();
    stagehand = await runner.initialize();
    formPage = new TravelFormPage(stagehand);
    await formPage.goto();
  });

  afterEach(async () => {
    await runner.cleanup();
  });

  it('should disable submit button on empty form load', async () => {
    console.log('📍 Test: Empty form — submit button should be disabled');

    const isDisabled = await formPage.isSubmitButtonDisabled();
    expect(isDisabled).toBe(true);
    console.log('✅ Submit button is disabled on empty form');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should show no errors before user interaction', async () => {
    console.log('📍 Test: No errors before user touches any field');

    const hasBudgetError = await formPage.hasValidationError('budget');
    const hasFlyingFromError = await formPage.hasValidationError('flying from');
    const hasFlyingToError = await formPage.hasValidationError('flying to');

    expect(hasBudgetError).toBe(false);
    expect(hasFlyingFromError).toBe(false);
    expect(hasFlyingToError).toBe(false);
    console.log('✅ No validation errors shown on pristine form');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should auto-set travelers to 1 and disable controls for solo trip', async () => {
    console.log('📍 Test: Solo trip — travelers locked to 1');

    await formPage.selectTripType('solo');
    console.log('✅ Selected solo trip type');

    await new Promise(r => setTimeout(r, 1000));

    const travelersValue = await formPage.getTravelersValue();
    expect(travelersValue).toBe('1');
    console.log(`✅ Travelers auto-set to: ${travelersValue}`);

    const controlsDisabled = await formPage.areTravelerControlsDisabled();
    expect(controlsDisabled).toBe(true);
    console.log('✅ Increment/decrement controls are disabled for solo');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should auto-set travelers to 2 and enable controls when switching from solo to couple', async () => {
    console.log('📍 Test: Switch solo → couple updates travelers and enables controls');

    await formPage.selectTripType('solo');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Selected solo trip type');

    await formPage.selectTripType('couple');
    await new Promise(r => setTimeout(r, 1000));
    console.log('✅ Switched to couple trip type');

    const travelersValue = await formPage.getTravelersValue();
    expect(travelersValue).toBe('2');
    console.log(`✅ Travelers auto-updated to: ${travelersValue}`);

    const controlsDisabled = await formPage.areTravelerControlsDisabled();
    expect(controlsDisabled).toBe(false);
    console.log('✅ Increment/decrement controls are enabled for couple');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should not decrement travelers below minimum for couple trip', async () => {
    console.log('📍 Test: Couple trip — cannot decrement below 2');

    await formPage.selectTripType('couple');
    await new Promise(r => setTimeout(r, 1000));

    // Attempt to decrement (should stay at 2)
    await formPage.decrementTravelers();
    await new Promise(r => setTimeout(r, 500));

    const travelersValue = await formPage.getTravelersValue();
    expect(Number(travelersValue)).toBeGreaterThanOrEqual(2);
    console.log(`✅ Travelers stayed at minimum: ${travelersValue}`);

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should show error when departure date is in the past', async () => {
    console.log('📍 Test: Past departure date triggers validation error');

    await formPage.setFromDate(invalidFormData.pastDates.fromDate);
    console.log(`✅ Set departure date to yesterday: ${invalidFormData.pastDates.fromDate}`);

    // Trigger blur to activate validation
    await formPage.act('click somewhere else on the page');
    await new Promise(r => setTimeout(r, 500));

    const hasError = await formPage.hasValidationError('departure date');
    expect(hasError).toBe(true);
    console.log('✅ Validation error displayed for past departure date');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should show error when return date is before departure date', async () => {
    console.log('📍 Test: Return date before departure triggers validation error');

    // Set departure 7 days from now
    await formPage.setFromDate(invalidFormData.returnBeforeDeparture.fromDate);
    console.log(`✅ Set departure date: ${invalidFormData.returnBeforeDeparture.fromDate}`);

    // Set return to tomorrow (before departure)
    await formPage.setToDate(invalidFormData.returnBeforeDeparture.toDate);
    console.log(`✅ Set return date to earlier: ${invalidFormData.returnBeforeDeparture.toDate}`);

    await formPage.act('click somewhere else on the page');
    await new Promise(r => setTimeout(r, 500));

    const hasError = await formPage.hasValidationError('return date');
    expect(hasError).toBe(true);
    console.log('✅ Validation error displayed for return date before departure');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should show error for negative budget and clear it when corrected', async () => {
    console.log('📍 Test: Negative budget triggers error, then clears on valid input');

    await formPage.setBudget(invalidFormData.negativeBudget.budget);
    console.log(`✅ Entered negative budget: ${invalidFormData.negativeBudget.budget}`);

    await formPage.act('click somewhere else on the page');
    await new Promise(r => setTimeout(r, 500));

    const hasNegativeError = await formPage.hasValidationError('budget');
    expect(hasNegativeError).toBe(true);
    console.log('✅ Validation error displayed for negative budget');

    // Now enter a valid budget
    await formPage.setBudget(validFormData.couple.budget);
    await new Promise(r => setTimeout(r, 500));

    const hasErrorAfterFix = await formPage.hasValidationError('budget');
    expect(hasErrorAfterFix).toBe(false);
    console.log('✅ Validation error cleared after entering valid budget');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should show error for zero budget', async () => {
    console.log('📍 Test: Zero budget triggers validation error');

    await formPage.setBudget(invalidFormData.zeroBudget.budget);
    await formPage.act('click somewhere else on the page');
    await new Promise(r => setTimeout(r, 500));

    const hasError = await formPage.hasValidationError('budget');
    expect(hasError).toBe(true);
    console.log('✅ Validation error displayed for zero budget');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);

  it('should enable submit button only when all fields are filled', async () => {
    console.log('📍 Test: Submit enabled only after all fields filled');

    const data = validFormData.solo;

    // Fill all except budget — submit should remain disabled
    await formPage.selectTripType(data.tripType);
    await formPage.setFlyingFrom(data.flyingFrom);
    await formPage.setFlyingTo(data.flyingTo);
    await formPage.setFromDate(data.fromDate);
    await formPage.setToDate(data.toDate);
    console.log('✅ Filled all fields except budget');

    await new Promise(r => setTimeout(r, 500));

    const isDisabledBeforeBudget = await formPage.isSubmitButtonDisabled();
    expect(isDisabledBeforeBudget).toBe(true);
    console.log('✅ Submit still disabled without budget');

    // Fill last field — submit should enable
    await formPage.setBudget(data.budget);
    await new Promise(r => setTimeout(r, 500));

    const isEnabledAfterAll = await formPage.isSubmitButtonEnabled();
    expect(isEnabledAfterAll).toBe(true);
    console.log('✅ Submit enabled once all fields filled');

    const sessionUrl = runner.getSessionUrl();
    if (sessionUrl) console.log(`🔍 BrowserBase Session: ${sessionUrl}`);
  }, 120000);
});
