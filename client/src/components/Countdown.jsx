import React, { useState, useEffect } from 'react';

function Countdown({ expiryTimestamp }) {
  // 🧩 Prevent crash if expiryTimestamp is missing or invalid
  if (!expiryTimestamp) {
    return <span className="text-gray-500">N/A</span>;
  }

  const calculateTimeLeft = () => {
    const now = new Date();
    const expiry = new Date(expiryTimestamp);
    const difference = expiry - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTimestamp]);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <span className="font-semibold text-yellow-600">
      {hours.toString().padStart(2, '0')}:
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </span>
  );
}

export default Countdown;
