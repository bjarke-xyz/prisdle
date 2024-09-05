import fs from 'node:fs'

interface GameData {
    itemId: string;
    name: string;
    price: number;
    image: string;
}

interface GameMetadata {
    currency: string;
}

interface RawDataHit {
    id: number;
    name: string;
    underline: string;
    pricing: {
        normal_price: number;
    }
    // TODO: tjek på min_age, der skal stå null
    min_age: number | null;
    images: {
        small: string;
        medium: string;
        large: string;
    }[]
}

interface RawDataContainer {
    results: {
        hits: RawDataHit[]
    }[]
}

async function getDataJson(): Promise<RawDataContainer> {
    const rawDataJsonFile = "./scripts/raw-data_2024-09-05.json";
    if (fs.existsSync(rawDataJsonFile)) {
        console.log('getting data from file')
        const jsonStr = fs.readFileSync(rawDataJsonFile, 'utf-8');
        const parsedJson = JSON.parse(jsonStr);
        return parsedJson;
    }
    console.log('getting data from source')
    const hitsPerPage = 100
    const resp = await fetch(`https://flwdn2189e-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.21.1&x-algolia-application-id=FLWDN2189E&x-algolia-api-key=fa20981a63df668e871a87a8fbd0caed`, {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/x-www-form-urlencoded",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "Sec-GPC": "1"
        },
        "body": `{"requests":[{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A10%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A20%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A160%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A30%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A40%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A70%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A50%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A60%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A80%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A90%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A100%22%5D&filters="},{"indexName":"aws-prod-products","params":"query=&hitsPerPage=${hitsPerPage}&facets=%5B%22labels%22%5D&facetFilters=%5B%22department_id%3A130%22%5D&filters="}]}`,
        "method": "POST",
        "mode": "cors"
    });
    const parsedJson = await resp.json();
    const jsonStr = JSON.stringify(parsedJson, undefined, 4)
    fs.writeFileSync(rawDataJsonFile, jsonStr)
    return parsedJson;
}

function makeGames(rawDataContainer: RawDataContainer): GameData[] {
    const games: GameData[] = [];
    shuffle(rawDataContainer.results);
    for (const rawDataResult of rawDataContainer.results) {
        shuffle(rawDataResult.hits)
        for (const hit of rawDataResult.hits) {
            const noAgeLimit = hit.min_age === null;
            const hitOk = noAgeLimit;
            if (!hitOk) continue;
            const game = makeGame(hit);
            games.push(game);
        }
    }
    return games;
}

function makeGame(rawDataHit: RawDataHit): GameData {
    const itemId = rawDataHit.id.toString()
    const name = `${rawDataHit.name}, ${rawDataHit.underline}`
    const price = rawDataHit.pricing.normal_price;
    const image = rawDataHit.images[0].small;
    return {
        itemId, name, price, image
    }
}

function saveGames(games: GameData[]) {
    const gamesFile = "./games.json";
    fs.writeFileSync(gamesFile, JSON.stringify(games));
}

async function main() {
    const rawDataContainer = await getDataJson();
    const games = makeGames(rawDataContainer);
    saveGames(games);
    console.log(games)
}
main();








function shuffle(array: unknown[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}