export const guessAttempts = 6;

export type GameSource = 'rema1000' | 'dba';
export const GameSources: GameSource[] = ['dba', 'rema1000'];

export function getGameSourceFromLocation(location: Location): GameSource {
    const searchParams = new URLSearchParams(location.search);
    const gameSourceParam = searchParams.get('gs');
    if (gameSourceParam === 'dba') return 'dba';
    return 'rema1000';
}

export function getStartDate(gameSource: GameSource): Date {
    switch (gameSource) {
        case "dba": return new Date("2024-09-15T00:00:00.000Z");
    }
    return new Date("2024-09-09T00:00:00.000Z");
}

export interface GameData {
    itemId: string;
    name: string;
    price: number;
    image: string;
}

export function dateDifferenceInDays(date1: Date, date2: Date) {
    const date1Ms = new Date(date1).getTime();
    const date2Ms = new Date(date2).getTime();
    const differenceMs = Math.abs(date2Ms - date1Ms);
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays;
}

export const currency = "kr.";

export function getEmoji(dir: GuessDirection): string | null {
    if (dir?.includes("up")) {
        return "⬆️"
    } else if (dir?.includes('down')) {
        return "⬇️"
    } else if (dir === "ok") {
        return "✅"
    }
    return null;
}

export function getEmojiColor(dir: GuessDirection): string | null {
    if (dir === 'up' || dir === 'down') {
        return '🟥'
    } else if (dir?.includes('almost')) {
        return '🟨'
    }
    return null;
}
export interface GuessWithDirection {
    guess?: number;
    dir: GuessDirection;
}
export type GuessDirection = "up" | "down" | "up-almost" | "down-almost" | "ok" | null;

export function calculatePercentageDifference(num1: number, num2: number, base = num1) {
    const difference = Math.abs(num1 - num2);
    return (difference / base) * 100;
}

export function getNumberOfGuesses(guesses: GuessWithDirection[]): number {
    let numberOfGuesses = 0;
    for (const g of guesses) {
        if (g.guess) {
            numberOfGuesses++;
        }
    }
    return numberOfGuesses;
}

export function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}