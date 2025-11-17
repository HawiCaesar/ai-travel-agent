import { ButtonProps } from '../types';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
}: ButtonProps) => {
  const baseStyles = 'custom-ai-travel-agent-font-body px-8 py-4 rounded-full font-bold text-[25px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const defaultStyles = 'bg-brand-button text-black border-4 border-brand-border hover:bg-opacity-90 hover:shadow-lg focus:ring-brand-button focus:ring-opacity-50 active:scale-95 active:shadow-sm';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${defaultStyles} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      tabIndex={0}
    >
      {children}
    </button>
  );
};

export default Button;

