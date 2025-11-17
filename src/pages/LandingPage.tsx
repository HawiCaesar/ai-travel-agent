import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import logo from '/ai-travel-agent-logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleBeginClick = () => {
    navigate('/plan');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-12">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="AI Travel Agent Logo"
            className="w-[380px] h-[380px] max-w-full object-contain"
          />
        </div>

        {/* Let's Begin Button */}
        <Button
          onClick={handleBeginClick}
          ariaLabel="Begin planning your trip"
          className="w-full max-w-xs shadow-lg hover:shadow-xl"
        >
          Let's Begin
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;

