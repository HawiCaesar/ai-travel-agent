import { ButtonProps } from '../types';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
  variant = 'primary',
}: ButtonProps) => {
  const baseStyles = 'custom-ai-travel-agent-font-body px-8 py-4 rounded-full font-bold text-[25px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed';
  
  const primaryStyles = 'bg-brand-button text-black border-4 border-brand-border hover:bg-opacity-90 hover:shadow-lg focus:ring-brand-button focus:ring-opacity-50 active:scale-95 active:shadow-sm disabled:bg-[#CCCCCC] disabled:hover:bg-[#CCCCCC] disabled:hover:shadow-none disabled:active:scale-100';
  
  const outlinedStyles = 'bg-white text-black border-4 border-brand-border hover:bg-gray-50 hover:shadow-md focus:ring-brand-border focus:ring-opacity-50 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100 disabled:hover:shadow-none disabled:active:scale-100';
  
  const variantStyles = variant === 'outlined' ? outlinedStyles : primaryStyles;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      tabIndex={0}
    >
      {children}
    </button>
  );
};

export default Button;

