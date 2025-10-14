import React, { useEffect, useState } from "react";

const CountdownTimer = ({endDate, textColor = "text-white", bgColor = "bg-blue-600", textSize = "text-lg" }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false); 

  useEffect(() => {
    setIsHydrated(true);

    if (endDate) {
      setTimeLeft(calculateTimeLeft(endDate));
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(endDate));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [endDate]);

  function calculateTimeLeft(endDate) {
    if (!endDate) return null;
    const now = new Date().getTime();
    const difference = new Date(endDate).getTime() - now;

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  if (!isHydrated || !timeLeft) {
    return (
      <div className="countdown-timer my-2">
        <div className="grid grid-cols-4 gap-2 items-center justify-center">
          {['00', '00', '00', '00'].map((value, index) => (
            <div className="flex flex-col items-center" key={index}>
              <span className={`${textSize} font-bold ${bgColor} ${textColor} px-2 py-1 rounded-md`}>
                {value}
              </span>
              <span className={`text-xs ${textColor} mt-1`}>
                {['Days', 'Hrs', 'Min', 'Sec'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-timer my-2">
      <div className="grid grid-cols-4 gap-2 items-center justify-center">
        {Object.keys(timeLeft).map((key, index) => (
          <div className="flex flex-col items-center" key={index}>
            <span className={`${textSize} font-bold ${bgColor} ${textColor} px-2 py-1 rounded-md`}>
              {timeLeft[key].toString().padStart(2, "0")}
            </span>
            <span className={`text-xs ${textColor} mt-1`}>
              {['Days', 'Hrs', 'Min', 'Sec'][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
