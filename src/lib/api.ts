import { GameData } from "./types";

export function getGames(): Promise<GameData[]> {
    return fetch("https://static.bjarke.xyz/prisdle/games.json")
        .then(resp => resp.json<GameData[]>())
        .catch(err => {
            console.error(err)
            throw err;
        })
}