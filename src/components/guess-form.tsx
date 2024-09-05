import React, { useState } from 'react';

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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Indtast en pris"
                className="border-2 border-gray-300 p-2 rounded mb-4 text-center w-64"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-32">
                Gæt!
            </button>
        </form>
    );
};

export default GuessForm;
