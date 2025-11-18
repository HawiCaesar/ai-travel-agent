import { createContext, useContext, useState, ReactNode } from 'react';
import { TravelFormData, TravelContextType } from '../types';

// Default form data
const defaultFormData: TravelFormData = {
  travelers: 0,
  flyingFrom: '',
  flyingTo: '',
  fromDate: '',
  toDate: '',
  budget: 0,
  currentWeather: '',
  flightRecommendation: null,
  hotelRecommendation: null,
};

// Create context
const TravelContext = createContext<TravelContextType | undefined>(undefined);

// Provider component
interface TravelProviderProps {
  children: ReactNode;
}

export const TravelProvider = ({ children }: TravelProviderProps) => {
  const [formData, setFormData] = useState<TravelFormData>(defaultFormData);

  const updateFormData = (data: Partial<TravelFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  return (
    <TravelContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </TravelContext.Provider>
  );
};

// Custom hook to use the travel context
export const useTravelContext = () => {
  const context = useContext(TravelContext);
  
  if (context === undefined) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  
  return context;
};

