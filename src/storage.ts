import { GuessWithDirection } from "./components/prev-guesses";

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