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
        <form onSubmit={handleSubmit} className="flex flex-row items-center gap-4">
            <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Indtast en pris"
                min="0"
                className="input"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-32">
                Gæt!
            </button>
        </form>
    );
};

export default GuessForm;
