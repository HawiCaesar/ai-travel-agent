// Type definitions for Travel Agent AI

export interface TravelFormData {
  tripType: 'solo' | 'couple' | 'friends' | 'family' | 'business' | '';
  travelers: number;
  flyingFrom: string;
  flyingTo: string;
  fromDate: string; // dd/MM/YYYY format
  toDate: string; // dd/MM/YYYY format
  budget: number;
  currentWeather: string;
  currentWeatherImageUrl: string;
  flightRecommendation?: string | null;
  hotelRecommendation?: string | null;
  activitiesToDo?: string[];
}

export interface ValidationErrors {
  tripType?: string;
  travelers?: string;
  flyingFrom?: string;
  flyingTo?: string;
  fromDate?: string;
  toDate?: string;
  budget?: string;
}

export interface TravelContextType {
  formData: TravelFormData;
  updateFormData: (data: Partial<TravelFormData>) => void;
  resetFormData: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  variant?: 'primary' | 'outlined';
}

