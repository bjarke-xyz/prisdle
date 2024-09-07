import toast from "react-hot-toast";
import { BASE_URL } from "../constants";
import { GuessWithDirection, getEmoji, getEmojiColor } from "../types";

export interface ShareButtonProps {
    maxGuesses: number;
    guesses: GuessWithDirection[]
    gameNumber: number;
    gameWon: boolean;
}
export const ShareButton: React.FC<ShareButtonProps> = ({ maxGuesses, guesses, gameNumber, gameWon }) => {
    function handleShareClicked() {
        const text = guessesToText(guesses, maxGuesses, gameNumber, gameWon);
        shareOrCopy(text);
    }
    return (
        <button onClick={handleShareClicked} className={`w-full p-4 rounded ${gameWon ? 'bg-green-200' : 'bg-red-400'}`}>
            Del
        </button>
    )
}

function guessesToText(guesses: GuessWithDirection[], maxGuesses: number, gameNumber: number, gameWon: boolean): string {
    let lines: string[] = [];
    let guessesUsed = 0;
    for (const guess of guesses) {
        const emoji = getEmoji(guess.dir);
        if (emoji) {
            lines.push(`${emoji}${getEmojiColor(guess.dir) ?? ''}`)
            guessesUsed++;
        }
    }
    const guessesUsedStr = !gameWon ? 'X' : guessesUsed.toString();
    lines = [`Pris Gæt #${gameNumber} ${guessesUsedStr}/${maxGuesses}`, ...lines];
    lines.push(BASE_URL);
    return lines.join("\n");
}

async function shareOrCopy(text: string): Promise<void> {
    if (navigator.share) {
        try {
            await navigator.share({ text });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            toast("Resultater kopieret til udklipsholder")
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    } else {
        console.warn('Neither share nor clipboard API is available.');
    }
}
