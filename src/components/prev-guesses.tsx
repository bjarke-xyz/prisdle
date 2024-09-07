import { currency, getEmoji, GuessWithDirection } from "../lib/types";


interface PrevGuessesProps {
    guesses: GuessWithDirection[]
}

export const PrevGuesses: React.FC<PrevGuessesProps> = ({ guesses }) => {
    return (
        <div className="mb-8 flex flex-col gap-2">
            {guesses.map((guess, i) => (
                <div key={`${i}_${guess.guess}`} className="max-w-full">
                    <div className="flex flex-row gap-4">
                        <div className="input">{guess.guess ? `${guess.guess} ${currency}` : null}&nbsp;</div>
                        <div className={`${(guess.dir === 'ok' ? 'bg-green-200' : (guess.dir === 'up' || guess.dir === 'down') ? 'bg-red-400' : guess.dir?.includes("-almost") ? 'bg-yellow-200' : null)} w-32 rounded border-2 border-gray-300 bg-gray-400 text-center flex items-center`}>
                            <span className="w-full">
                                {getEmoji(guess.dir)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
