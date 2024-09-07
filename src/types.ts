
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