import { useTravelContext } from '../context/TravelContext';
import { formatDateToReadable } from '../utils/dateFormatters';
import Button from '../components/Button';

const ResultsPage = () => {
  const { formData } = useTravelContext();

  // Mock data as specified in INIT.md
  const mockFromDate = '2023-11-25';
  const mockToDate = '2023-12-05';
  const mockFromCity = 'Nairobi';
  const mockToCity = 'Accra';

  // Format dates to "25th Nov 23" format
  const formattedFromDate = formatDateToReadable(mockFromDate);
  const formattedToDate = formatDateToReadable(mockToDate);

  const handleBookFlight = () => {
    console.log('Booked');
  };

  const handleBookHotel = () => {
    console.log('Booked');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-brand-bg px-4 py-8">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-5xl font-bold text-black text-center mb-8">
          Your Trip
        </h1>

        {/* Date Pills */}
        <div className="flex justify-between gap-4 mb-6">
          <div className="flex-1 bg-brand-card rounded-full px-6 py-3 shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
            <p className="text-lg font-bold text-black text-center">
              → {formattedFromDate}
            </p>
          </div>
          <div className="flex-1 bg-brand-card rounded-full px-6 py-3 shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
            <p className="text-lg font-bold text-black text-center">
              {formattedToDate} ←
            </p>
          </div>
        </div>

        {/* Route Pill */}
        <div className="bg-brand-card rounded-full px-8 py-4 shadow-[0_4px_8px_rgba(0,0,0,0.25)] mb-8">
          <p className="text-2xl font-bold text-black text-center">
            {mockFromCity} → {mockToCity}
          </p>
        </div>

        {/* Weather Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black text-center mb-4">
            Weather
          </h2>
          <div className="bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
            <p className="custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed">
              You can expect the weather to be quite mild. Low will be 19° and high will be 25°
            </p>
          </div>
        </div>

        {/* Flights Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black text-center mb-4">
            Flights
          </h2>
          <div className="bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
            <p className="custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed mb-6">
              The best option for you is with Kenya Airways with no layover
            </p>
            <Button
              onClick={handleBookFlight}
              ariaLabel="Book flight"
              className="w-full"
            >
              Book
            </Button>
          </div>
        </div>

        {/* Hotel Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black text-center mb-4">
            Hotel
          </h2>
          <div className="bg-brand-card rounded-3xl px-8 py-6 shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
            <p className="custom-ai-travel-agent-font-cards text-lg text-black leading-relaxed mb-6">
              We recommend you stay at the The Pelican Hotel Cantonments Accra
            </p>
            <Button
              onClick={handleBookHotel}
              ariaLabel="Book hotel"
              className="w-full"
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

