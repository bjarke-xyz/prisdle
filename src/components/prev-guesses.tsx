import { curreny } from "../types";

export interface GuessWithDirection {
    guess?: number;
    dir: string;
}
interface PrevGuessesProps {
    guesses: GuessWithDirection[]
}

export const PrevGuesses: React.FC<PrevGuessesProps> = ({ guesses }) => {
    return (
        <div className="mb-4">
            {guesses.map((guess, i) => (
                <div key={`${i}_${guess.guess}`} className="max-w-full my-2 p-2 h-8">
                    <div className="flex flex-row gap-4">
                        <div className="w-64 p-1 text-center bg-gray-400">{guess.guess ? `${guess.guess} ${curreny}` : null}&nbsp;</div>
                        <div className="w-32 bg-gray-400 text-center">{guess.dir === "up" ? "⬆️" : guess.dir === "down" ? "⬇️" : guess.dir === "ok" ? "✅" : null}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}