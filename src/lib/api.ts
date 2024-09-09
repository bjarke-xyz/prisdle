import { GameData } from "./types";

export function getGames(random: boolean): Promise<GameData[]> {
    let url = "https://static.bjarke.xyz/prisdle/games.json";
    if (random) {
        url = "https://static.bjarke.xyz/prisdle/random-games.json";
    }
    return fetch(url)
        .then(resp => resp.json<GameData[]>())
        .catch(err => {
            console.error(err)
            throw err;
        })
}