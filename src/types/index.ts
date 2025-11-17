// Type definitions for Travel Agent AI

export interface TravelFormData {
  travelers: number;
  flyingFrom: string;
  flyingTo: string;
  fromDate: string; // dd/MM/YYYY format
  toDate: string; // dd/MM/YYYY format
  budget: number;
}

export interface ValidationErrors {
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
}

