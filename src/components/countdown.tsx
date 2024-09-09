import React, { useEffect, useState } from 'react';

const CountdownToMidnightUTC: React.FC = () => {
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(getTimeRemaining());
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    function getTimeRemaining() {
        const now = new Date();
        const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        const midnightUTC = new Date(utcNow);
        midnightUTC.setUTCHours(23, 59, 59, 999);

        const diffInMillis = midnightUTC.getTime() - utcNow.getTime();

        const hours = Math.floor((diffInMillis / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffInMillis / (1000 * 60)) % 60);
        const seconds = Math.floor((diffInMillis / 1000) % 60);

        return { hours, minutes, seconds };
    }

    return (
        <span>
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}:
            {String(timeRemaining.seconds).padStart(2, '0')}
        </span>
    );
};

export default CountdownToMidnightUTC;
