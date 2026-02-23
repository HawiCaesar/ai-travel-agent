import { TravelFormData } from '../pages/TravelFormPage';

/**
 * Helper function to get tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Helper function to get a date N days from now in YYYY-MM-DD format
 */
export function getDateDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Helper function to get yesterday's date in YYYY-MM-DD format
 */
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Valid form data for different trip types
 */
export const validFormData: Record<string, TravelFormData> = {
  solo: {
    tripType: 'solo',
    travelers: 1,
    flyingFrom: 'San Francisco',
    flyingTo: 'Tokyo',
    fromDate: getTomorrowDate(),
    toDate: getDateDaysFromNow(7),
    budget: 3000
  },
  couple: {
    tripType: 'couple',
    travelers: 2,
    flyingFrom: 'New York City',
    flyingTo: 'Paris',
    fromDate: getTomorrowDate(),
    toDate: getDateDaysFromNow(7),
    budget: 5000
  },
  friends: {
    tripType: 'friends',
    travelers: 4,
    flyingFrom: 'Los Angeles',
    flyingTo: 'Barcelona',
    fromDate: getTomorrowDate(),
    toDate: getDateDaysFromNow(10),
    budget: 6000
  },
  family: {
    tripType: 'family',
    travelers: 4,
    flyingFrom: 'Chicago',
    flyingTo: 'Orlando',
    fromDate: getTomorrowDate(),
    toDate: getDateDaysFromNow(7),
    budget: 8000
  },
  business: {
    tripType: 'business',
    travelers: 2,
    flyingFrom: 'Seattle',
    flyingTo: 'London',
    fromDate: getTomorrowDate(),
    toDate: getDateDaysFromNow(5),
    budget: 4000
  }
};

/**
 * Invalid form data scenarios for testing validation
 */
export const invalidFormData = {
  pastDates: {
    fromDate: getYesterdayDate(),
    toDate: getDateDaysFromNow(7)
  },
  returnBeforeDeparture: {
    fromDate: getDateDaysFromNow(7),
    toDate: getTomorrowDate()
  },
  negativeBudget: {
    budget: -1000
  },
  zeroBudget: {
    budget: 0
  },
  invalidTravelers: {
    couple: 1,  // Should be minimum 2
    friends: 1,  // Should be minimum 2
    family: 1,   // Should be minimum 2
    business: 1  // Should be minimum 2
  }
};

/**
 * Edge case destinations for testing API error handling
 */
export const edgeCaseFormData: TravelFormData = {
  tripType: 'couple',
  travelers: 2,
  flyingFrom: 'InvalidCity',
  flyingTo: 'InvalidDestination',
  fromDate: getTomorrowDate(),
  toDate: getDateDaysFromNow(7),
  budget: 5000
};
