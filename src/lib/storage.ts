import { guessAttempts, GuessWithDirection } from "./types";

interface GameState {
    gameId: string;
    guesses: GuessWithDirection[];
    gameWon: boolean;
    gameLost: boolean;
}

export function saveGameState(gameId: string, guesses: GuessWithDirection[], gameWon: boolean, gameLost: boolean) {
    const gameState: GameState = {
        gameId, guesses, gameWon, gameLost
    }
    const gameStateJson = JSON.stringify(gameState);
    localStorage.setItem("state", gameStateJson);
}

export function getGameState(): GameState | null {
    const gameStateJson = localStorage.getItem("state");
    if (!gameStateJson) return null;
    return JSON.parse(gameStateJson);
}

export interface GameStats {
    numberOfGames: number;
    numberOfWins: number;
    winDistribution: number[]; // array size = number of allowed guess attempts
    currentStreak: number;
    bestStreak: number;
}
const defaultGameStats: GameStats = {
    numberOfGames: 0,
    numberOfWins: 0,
    winDistribution: Array.from(Array(guessAttempts)).map(() => 0),
    currentStreak: 0,
    bestStreak: 0,
}

export function updateGameStats(gameWon: boolean, guesses: number) {
    const currentStats: GameStats = JSON.parse(localStorage.getItem("stats") ?? JSON.stringify(defaultGameStats));
    currentStats.numberOfGames++;
    if (gameWon) {
        currentStats.numberOfWins++;
    }
    if (gameWon) {
        console.log(guesses)
        currentStats.winDistribution[guesses - 1]++;
        currentStats.currentStreak++;
    } else {
        currentStats.currentStreak = 0;
    }
    if (currentStats.currentStreak > currentStats.bestStreak) {
        currentStats.bestStreak = currentStats.currentStreak;
    }
    localStorage.setItem("stats", JSON.stringify(currentStats));
}

export function getGameStats(): GameStats {
    const currentStats: GameStats = JSON.parse(localStorage.getItem("stats") ?? JSON.stringify(defaultGameStats));
    return currentStats;
}