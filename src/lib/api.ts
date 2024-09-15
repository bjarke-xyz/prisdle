import { GameData, GameSource } from "./types";

function getGameUrlSuffix(source: GameSource): string {
    switch (source) {
        case "dba": return "-dba";
    }
    return "";
}

export function getGames(source: GameSource, random: boolean): Promise<GameData[]> {
    const gameUrlSuffix = getGameUrlSuffix(source);
    let url = `https://static.bjarke.xyz/prisdle/games${gameUrlSuffix}.json`;
    if (random) {
        url = `https://static.bjarke.xyz/prisdle/random-games${gameUrlSuffix}.json`;
    }
    return fetch(url)
        .then(resp => resp.json<GameData[]>())
        .catch(err => {
            console.error(err)
            throw err;
        })
}