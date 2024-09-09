import React, { useEffect, useRef, useState } from 'react';

interface GuessFormProps {
    onGuess: (guess: string) => void;
}

const GuessForm: React.FC<GuessFormProps> = ({ onGuess }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onGuess(inputValue.trim());
            setInputValue('');
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // If the user is not on a mobile device, autofocus the input field
        if (!isMobileDevice() && inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="flex flex-row items-center gap-4">
            <input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Indtast en pris"
                min="0"
                step=".01"
                className="input"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-32">
                Gæt!
            </button>
        </form>
    );
};

export default GuessForm;


// Utility function to detect if the device is mobile
const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};