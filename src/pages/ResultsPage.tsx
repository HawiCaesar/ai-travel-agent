import { useNavigate } from 'react-router-dom';
import { useTravelContext } from '../context/TravelContext';
import { formatDateToReadable } from '../utils/dateFormatters';
import Button from '../components/Button';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { formData, resetFormData } = useTravelContext();

  // Use actual form data from context
  const formattedFromDate = formatDateToReadable(formData.fromDate);
  const formattedToDate = formatDateToReadable(formData.toDate);

  const handleGoBack = () => {
    resetFormData();
    navigate('/plan');
  };

  const handleBookFlight = () => {
    console.log('Booked');
  };

  const handleBookHotel = () => {
    console.log('Booked');
  };

  // TODO: Implement share functionality later on but for now just log the share text
  const handleShare = async (platform: 'general' | 'x') => {
    const shareText = `I'm planning a trip from ${formData.flyingFrom} to ${formData.flyingTo} from ${formattedFromDate} to ${formattedToDate}! ✈️`;
    
    console.log(shareText);
    if (platform === 'x') {
      console.log('Sharing on X');
    } else {
      console.log('Sharing on general');
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center bg-brand-bg px-4 py-8'>
      <div className='w-full max-w-md'>
        {/* Go Back Button - Top */}
        <div className='mb-6'>
          <Button
            onClick={handleGoBack}
            ariaLabel='Go back to form'
            variant='outlined'
            className='w-full'
          >
            Go Back
          </Button>
        </div>

        {/* Heading */}
        <h1 className='text-5xl font-bold text-black text-center mb-8'>
          Your Trip
        </h1>

        {/* Date Pills */}
        <div className='flex justify-between gap-4 mb-6'>
          <div className='flex-1 bg-brand-card rounded-full px-6 py-3 shadow-[0_4px_8px_rgba(0,0,0,0.25)]'>
            <p className='text-lg font-bold text-black text-center'>
              → {formattedFromDate}
            </p>
          </div>
          <div className='flex-1 bg-brand-card rounded-full px-6 py-3 shadow-[0_4px_8px_rgba(0,0,0,0.25)]'>
            <p className='text-lg font-bold text-black text-center'>
              {formattedToDate} ←
            </p>
          </div>
        </div>

        {/* Route Pill */}
        <div className='bg-brand-card rounded-full px-8 py-4 shadow-[0_4px_8px_rgba(0,0,0,0.25)] mb-8'>
          <p className='text-2xl font-bold text-black text-center'>
            {formData.flyingFrom} → {formData.flyingTo}
          </p>
        </div>

        {/* Weather Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-black text-center mb-4'>
            Weather in {formData.flyingTo}
          </h2>
          {formData.currentWeatherImageUrl && (
            <img
              src={formData.currentWeatherImageUrl}
              alt={`Current weather at ${formData.flyingTo}`}
              className='w-full h-auto mb-4 rounded-3xl'
            />
          )}
          <div className='bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]'>
            <p className='custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed'>
              {formData.currentWeather}
            </p>
          </div>
        </div>

        {/* Flights Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-black text-center mb-4'>
            Flights
          </h2>
          <div className='bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]'>
            <p className='custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed mb-6'>
              {formData.flightRecommendation}
            </p>
            <Button
              onClick={handleBookFlight}
              ariaLabel='Book flight'
              className='w-full'
            >
              Book
            </Button>
          </div>
        </div>

        {/* Hotel Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-black text-center mb-4'>
            Hotel
          </h2>
          <div className='bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]'>
            <p className='custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed mb-6'>
              {formData.hotelRecommendation}
            </p>
            <Button
              onClick={handleBookHotel}
              ariaLabel='Book hotel'
              className='w-full'
            >
              Book
            </Button>
          </div>
        </div>

        {/* Activities Section */}
        {formData.activitiesToDo && formData.activitiesToDo.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-black text-center mb-4'>
              Activities to do at {formData.flyingTo}
            </h2>
            <div className='bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]'>
              <ul className='space-y-4'>
                {formData.activitiesToDo.map((activity, index) => (
                  <li
                    key={index}
                    className='custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed flex items-start'
                  >
                    <span className='mr-3 font-bold'>•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-black text-center mb-4'>
            Share Your Trip
          </h2>
          <div className='flex gap-4'>
            <Button
              onClick={() => handleShare('x')}
              ariaLabel='Share on X (Twitter)'
              className='flex-1'
            >
              Share on X
            </Button>
            <Button
              onClick={() => handleShare('general')}
              ariaLabel='Share your trip'
              className='flex-1'
            >
              Share
            </Button>
          </div>
        </div>

        {/* Go Back Button - Bottom */}
        <div className='mt-6'>
          <Button
            onClick={handleGoBack}
            ariaLabel='Go back to form'
            variant='outlined'
            className='w-full'
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
