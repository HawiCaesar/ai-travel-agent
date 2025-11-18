import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelContext } from '../context/TravelContext';
import { ValidationErrors } from '../types';
import { isEndDateAfterStartDate, getTodayISO } from '../utils/dateFormatters';
import Button from '../components/Button';

const TravelFormPage = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useTravelContext();

  // Local state for form inputs
  const [travelers, setTravelers] = useState(formData.travelers || '');
  const [flyingFrom, setFlyingFrom] = useState(formData.flyingFrom || '');
  const [flyingTo, setFlyingTo] = useState(formData.flyingTo || '');
  const [fromDate, setFromDate] = useState(formData.fromDate || '');
  const [toDate, setToDate] = useState(formData.toDate || '');
  const [budget, setBudget] = useState(formData.budget || '');

  // Validation errors state
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation functions
  const validateTravelers = (value: string): string | undefined => {
    if (!value) return 'Number of travelers is required';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Must be a positive number';
    return undefined;
  };

  const validateFlyingFrom = (value: string): string | undefined => {
    if (!value.trim()) return 'Departure city is required';
    return undefined;
  };

  const validateFlyingTo = (value: string): string | undefined => {
    if (!value.trim()) return 'Destination city is required';
    return undefined;
  };

  const validateFromDate = (value: string): string | undefined => {
    if (!value) return 'Departure date is required';
    const today = getTodayISO();
    if (value < today) return 'Date must be today or later';
    return undefined;
  };

  const validateToDate = (
    value: string,
    startDate: string
  ): string | undefined => {
    if (!value) return 'Return date is required';
    if (!startDate) return 'Please select departure date first';
    if (!isEndDateAfterStartDate(startDate, value)) {
      return 'Return date must be after departure date';
    }
    return undefined;
  };

  const validateBudget = (value: string): string | undefined => {
    if (!value) return 'Budget is required';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Must be a positive number';
    return undefined;
  };

  // Handle input changes with inline validation
  const handleTravelersChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTravelers(value);
    setErrors((prev) => ({ ...prev, travelers: validateTravelers(value) }));
  };

  const handleFlyingFromChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFlyingFrom(value);
    setErrors((prev) => ({ ...prev, flyingFrom: validateFlyingFrom(value) }));
  };

  const handleFlyingToChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFlyingTo(value);
    setErrors((prev) => ({ ...prev, flyingTo: validateFlyingTo(value) }));
  };

  const handleFromDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromDate(value);
    setErrors((prev) => ({
      ...prev,
      fromDate: validateFromDate(value),
      toDate: toDate ? validateToDate(toDate, value) : prev.toDate
    }));
  };

  const handleToDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToDate(value);
    setErrors((prev) => ({ ...prev, toDate: validateToDate(value, fromDate) }));
  };

  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBudget(value);
    setErrors((prev) => ({ ...prev, budget: validateBudget(value) }));
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: ValidationErrors = {
      travelers: validateTravelers(travelers as string),
      flyingFrom: validateFlyingFrom(flyingFrom),
      flyingTo: validateFlyingTo(flyingTo),
      fromDate: validateFromDate(fromDate),
      toDate: validateToDate(toDate, fromDate),
      budget: validateBudget(budget as string)
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(
      (error) => error !== undefined
    );

    if (!hasErrors) {
      // Save to context
      updateFormData({
        travelers: Number(travelers),
        flyingFrom,
        flyingTo,
        fromDate,
        toDate,
        budget: Number(budget)
      });

      // get destination weather starting with coordinates
      const response = await fetch(`https://ai-travel-agent-worker.hawitrial.workers.dev/`, {
        method: 'POST',
        body: JSON.stringify({
          flyingFrom,
          destination:flyingTo,
          fromDate,
          toDate,
          budget: Number(budget),
          travelers: Number(travelers)
        })
      });
      const data = await response.json();
      console.log(data);

      // Navigate to results page
      navigate('/results');
    }
  };

  const handleDecrement = () => {
    const currentValue = Number(travelers) || 0;
    if (currentValue > 1) {
      const newValue = String(currentValue - 1);
      setTravelers(newValue);
      setErrors((prev) => ({
        ...prev,
        travelers: validateTravelers(newValue)
      }));
    }
  };

  const handleIncrement = () => {
    const currentValue = Number(travelers) || 0;
    const newValue = String(currentValue + 1);
    setTravelers(newValue);
    setErrors((prev) => ({ ...prev, travelers: validateTravelers(newValue) }));
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4 py-8'>
      <div className='w-full max-w-md'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Number of Travelers */}
          <div>
            <label
              htmlFor='travelers'
              className='block text-xl font-bold text-black text-center mb-3'
            >
              Number of travellers
            </label>
            <div className='relative'>
              <button
                type='button'
                onClick={handleDecrement}
                className='absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-button active:scale-95 transition-all duration-200 z-10'
                aria-label='Decrease number of travelers'
              >
                −
              </button>
              <input
                id='travelers'
                type='number'
                value={travelers}
                onChange={handleTravelersChange}
                className={`custom-ai-travel-agent-font-body w-full px-20 py-4 border-4 ${
                  errors.travelers ? 'border-red-500' : 'border-brand-border'
                } rounded-full focus:outline-none focus:ring-2 focus:ring-brand-button focus:ring-opacity-50 text-center text-2xl font-bold bg-white transition-all duration-200`}
                aria-label='Number of travelers'
                min='1'
              />
              <button
                type='button'
                onClick={handleIncrement}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-button active:scale-95 transition-all duration-200 z-10'
                aria-label='Increase number of travelers'
              >
                +
              </button>
            </div>
            {errors.travelers && (
              <p className='mt-2 text-sm text-red-500 text-center'>
                {errors.travelers}
              </p>
            )}
          </div>

          {/* Flying From */}
          <div>
            <label
              htmlFor='flyingFrom'
              className='block text-xl font-bold text-black text-center mb-3'
            >
              Flying from
            </label>
            <input
              id='flyingFrom'
              type='text'
              value={flyingFrom}
              onChange={handleFlyingFromChange}
              className={`custom-ai-travel-agent-font-body w-full px-8 py-4 border-4 ${
                errors.flyingFrom ? 'border-red-500' : 'border-brand-border'
              } rounded-full focus:outline-none focus:ring-2 focus:ring-brand-button focus:ring-opacity-50 text-center text-2xl font-bold bg-white transition-all duration-200`}
              placeholder='New York City'
              aria-label='Departure city'
            />
            {errors.flyingFrom && (
              <p className='mt-2 text-sm text-red-500 text-center'>
                {errors.flyingFrom}
              </p>
            )}
          </div>

          {/* Flying To */}
          <div>
            <label
              htmlFor='flyingTo'
              className='block text-xl font-bold text-black text-center mb-3'
            >
              Flying to
            </label>
            <input
              id='flyingTo'
              type='text'
              value={flyingTo}
              onChange={handleFlyingToChange}
              className={`custom-ai-travel-agent-font-body w-full px-8 py-4 border-4 ${
                errors.flyingTo ? 'border-red-500' : 'border-brand-border'
              } rounded-full focus:outline-none focus:ring-2 focus:ring-brand-button focus:ring-opacity-50 text-center text-2xl font-bold bg-white transition-all duration-200`}
              placeholder='Paris'
              aria-label='Destination city'
            />
            {errors.flyingTo && (
              <p className='mt-2 text-sm text-red-500 text-center'>
                {errors.flyingTo}
              </p>
            )}
          </div>

          {/* From Date */}
          <div>
            <label
              htmlFor='fromDate'
              className='block text-xl font-bold text-black text-center mb-3'
            >
              From Date
            </label>
            <input
              id='fromDate'
              type='date'
              value={fromDate}
              onChange={handleFromDateChange}
              min={getTodayISO()}
              className={`custom-ai-travel-agent-font-body w-full px-8 py-4 border-4 ${
                errors.fromDate ? 'border-red-500' : 'border-brand-border'
              } rounded-full focus:outline-none focus:ring-2 focus:ring-brand-button focus:ring-opacity-50 text-center text-2xl font-bold bg-white transition-all duration-200`}
              aria-label='Departure date'
            />
            {errors.fromDate && (
              <p className='mt-2 text-sm text-red-500 text-center'>
                {errors.fromDate}
              </p>
            )}
          </div>

          {/* To Date */}
          <div>
            <label
              htmlFor='toDate'
              className='block text-xl font-bold text-black text-center mb-3'
            >
              To Date
            </label>
            <input
              id='toDate'
              type='date'
              value={toDate}
              onChange={handleToDateChange}
              min={fromDate || getTodayISO()}
              className={`custom-ai-travel-agent-font-body w-full px-8 py-4 border-4 ${
                errors.toDate ? 'border-red-500' : 'border-brand-border'
              } rounded-full focus:outline-none focus:ring-2 focus:ring-brand-button focus:ring-opacity-50 text-center text-2xl font-bold bg-white transition-all duration-200`}
              aria-label='Return date'
            />
            {errors.toDate && (
              <p className='mt-2 text-sm text-red-500 text-center'>
                {errors.toDate}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor='budget'
              className='block text-xl font-bold text-black text-center mb-3'
            >
              Budget
            </label>
            <div className='relative'>
              <span className='absolute left-1/2 transform -translate-x-[60px] top-1/2 -translate-y-1/2 text-black text-2xl font-bold pointer-events-none'>
                $
              </span>
              <input
                id='budget'
                type='number'
                value={budget}
                onChange={handleBudgetChange}
                className={`custom-ai-travel-agent-font-body w-full px-8 py-4 border-4 ${
                  errors.budget ? 'border-red-500' : 'border-brand-border'
                } rounded-full focus:outline-none focus:ring-2 focus:ring-brand-button focus:ring-opacity-50 text-center text-2xl font-bold bg-white pl-12 transition-all duration-200`}
                placeholder='5000'
                aria-label='Budget in dollars'
                min='1'
              />
            </div>
            {errors.budget && (
              <p className='mt-2 text-sm text-red-500 text-center'>
                {errors.budget}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <Button type='submit' ariaLabel='Plan my trip' className='w-full'>
              Plan my Trip!
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelFormPage;
