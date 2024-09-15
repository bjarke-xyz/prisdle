import fs from 'node:fs'
import { GameData, shuffle } from './gamedata';
const categoryUrls = JSON.parse(`[{"url":"https://www.dba.dk/biler/biler/","title":"Biler"},{"url":"https://www.dba.dk/til-boligen/andre-moebler-og-tilbehoer/","title":"Diverse møbler"},{"url":"https://www.dba.dk/cykler/cykler-og-cykelanhaengere/","title":"Cykler"},{"url":"https://www.dba.dk/til-boligen/spise-og-dagligstuemoebler/","title":"Spisestuemøbler"},{"url":"https://www.dba.dk/dyr/hunde-og-tilbehoer/","title":"Hunde og tilbehør"},{"url":"https://www.dba.dk/boliger/lejebolig/","title":"Lejebolig"},{"url":"https://www.dba.dk/sport-og-fritid/sport-og-motion/","title":"Sport og motion"},{"url":"https://www.dba.dk/baade/baade/","title":"Både"},{"url":"https://www.dba.dk/biltilbehoer/tilbehoer-og-reservedele/","title":"Bilreservedele"},{"url":"https://www.dba.dk/sport-og-fritid/jagt-og-fiskeri/","title":"Jagt og fiskeri"},{"url":"https://www.dba.dk/have-og-byg/byggematerialer/","title":"Byggematerialer"},{"url":"https://www.dba.dk/til-boligen/arkitekttegnet-moebler-og-belysning/","title":"Møbler og lamper"},{"url":"https://www.dba.dk/billede-og-lyd/hi-fi-og-tilbehoer/","title":"Hi-fi og tilbehør"},{"url":"https://www.dba.dk/biler/gulpladebiler/","title":"Gulpladebiler"},{"url":"https://www.dba.dk/have-og-byg/havemoebler-planter-fliser-og-tilbehoer/","title":"Havemøbler"},{"url":"https://www.dba.dk/til-boern/legetoej-og-spil/","title":"Legetøj og spil"},{"url":"https://www.dba.dk/til-boligen/glas-porcelaen-og-bestik/","title":"Glas og porcelæn"},{"url":"https://www.dba.dk/til-boligen/haarde-hvidevarer/","title":"Hårde hvidevarer"},{"url":"https://www.dba.dk/have-og-byg/havemaskiner-og-redskaber/","title":"Haveredskaber"},{"url":"https://www.dba.dk/til-boern/boerne-og-babyudstyr/","title":"Børneudstyr"},{"url":"https://www.dba.dk/mobil-og-telefoni/mobiltelefoner-og-tilbehoer/","title":"Mobiltelefoner"},{"url":"https://www.dba.dk/have-og-byg/vinduer-og-doere/","title":"Vinduer og døre"},{"url":"https://www.dba.dk/boliger/oevrig-bolig/","title":"Øvrig bolig"},{"url":"https://www.dba.dk/til-boligen/ovne-og-pejse/","title":"Ovne og pejse"},{"url":"https://www.dba.dk/musikinstrumenter/musikinstrumenter/","title":"Musikinstrumenter"},{"url":"https://www.dba.dk/dyr/husdyr/","title":"Husdyr"},{"url":"https://www.dba.dk/til-boligen/sengemoebler-og-udstyr/","title":"Senge"},{"url":"https://www.dba.dk/have-og-byg/vaerktoej-arbejdsredskaber-og-maskiner/","title":"Værktøj"},{"url":"https://www.dba.dk/til-boern/boernetoej/","title":"Børnetøj"},{"url":"https://www.dba.dk/til-boern/boerne-og-babymoebler/","title":"Børnemøbler"},{"url":"https://www.dba.dk/toej-og-mode/toej-til-kvinder/","title":"Tøj til kvinder"},{"url":"https://www.dba.dk/motorcykler-og-tilbehoer/motorcykler/","title":"Motorcykler"},{"url":"https://www.dba.dk/dyr/rideudstyr-og-tilbehoer-til-heste/","title":"Rideudstyr"},{"url":"https://www.dba.dk/diverse/diverse/","title":"Diverse"},{"url":"https://www.dba.dk/toej-og-mode/accessories/","title":"Modeaccessories"},{"url":"https://www.dba.dk/have-og-byg/anden-vvs/","title":"Anden VVS"}]`)

interface DbaListing {
    Image: string;
    HasImage: boolean;
    Link: string;
    Description: string;
    Price: string;
    Type: string;
    Target: string;
    ExternalId: string;
    OffersShipping: boolean;
}

async function getDataJson(): Promise<DbaListing[]> {
    const rawDataJsonFile = "./scripts/raw-data-2024-09-15_dba.json";
    if (fs.existsSync(rawDataJsonFile)) {
        console.log('getting data from file')
        const jsonStr = fs.readFileSync(rawDataJsonFile, 'utf-8');
        const parsedJson = JSON.parse(jsonStr);
        return parsedJson;
    }
    console.log('getting data from source');

    const listingsUrls = [
        'https://www.dba.dk/ajax/frontpage/newestlistings/getnewestlistingsasync/',
        'https://www.dba.dk/ajax/frontpage/frontpagelistings/frontpagefeaturedlistingsasync/'
    ]

    const categories = await getCategoryIds();
    for (const category of categories) {
        const listingsUrl = `https://www.dba.dk/ajax/gallery/topfeaturegallery/data/?classification=${category.id}`;
        listingsUrls.push(listingsUrl);
    }

    const allListings: DbaListing[] = [];

    for (const listingsUrl of listingsUrls) {
        console.log(`getting ${listingsUrl}...`);
        try {
            const listingsResp = await fetch(listingsUrl);
            const listings = await listingsResp.json() as DbaListing[];
            console.log(`found ${listings.length}\n`)
            allListings.push(...listings);
        } catch (error) {
            console.log('error getting listings', error)
        }
    }

    // remove potential duplicates
    const listingsById: Record<string, DbaListing> = {}
    for (const listing of allListings) {
        listingsById[listing.ExternalId] = listing;
    }

    const dedupedListings = Object.values(listingsById);
    const listingsJson = JSON.stringify(dedupedListings)
    fs.writeFileSync(rawDataJsonFile, listingsJson);
    return dedupedListings;
}

function parsePrice(priceStr: string): { price: number, currency: string } | null {
    const pricePattern = /(\d{1,3}(?:\.\d{3})*(?:,\d+)?)[ ]?(kr)\.?/;
    const priceMatch = priceStr.match(pricePattern);
    if (!priceMatch) {
        return null;
    }
    const number = priceMatch[1];
    const currency = priceMatch[2];
    const cleanNumber = number.replace(/\./g, '').replace(',', '.');
    return {
        price: Number(cleanNumber),
        currency
    }
}

function makeGame(dbaListing: DbaListing): GameData | null {
    const itemId = `DBA:${dbaListing.ExternalId}`;
    const name = dbaListing.Description;
    const image = dbaListing.Image;
    const parsedPrice = parsePrice(dbaListing.Price);
    if (!parsedPrice) {
        return null;
    }
    const { price, currency } = parsedPrice;
    return {
        itemId, name, price, currency, image,
    }
}

function makeGames(dbaListings: DbaListing[]): GameData[] {
    const games: GameData[] = [];
    shuffle(dbaListings);
    for (const listing of dbaListings) {
        const hasImage = listing.HasImage;
        const listingOk = hasImage;
        if (!listingOk) continue;
        const game = makeGame(listing);
        const gameOk = game && game.price > 1
        if (!gameOk) continue;
        games.push(game);
    }
    return games;
}

function saveGames(allGames: GameData[]) {
    const dailyGamesFile = "./games-dba.json";
    const randomGamesFile = "./random-games-dba.json"
    const randomGamesLength = allGames.length / 3;
    const randomGames: GameData[] = [];
    const dailyGames: GameData[] = [];
    for (let i = 0; i < allGames.length; i++) {
        if (i < randomGamesLength) {
            randomGames.push(allGames[i]);
        } else {
            dailyGames.push(allGames[i])
        }
    }
    fs.writeFileSync(randomGamesFile, JSON.stringify(randomGames))
    fs.writeFileSync(dailyGamesFile, JSON.stringify(dailyGames));
}

async function main() {
    const dbaListings = await getDataJson();
    const games = makeGames(dbaListings);
    shuffle(games);
    saveGames(games);
    console.log(games);
}
main();






interface DbaCategory {
    id: string;
    title: string;
}

async function getCategoryIds(): Promise<DbaCategory[]> {
    const file = "./scripts/raw-data_dba-categories-2024-09-15.json"
    if (fs.existsSync(file)) {
        console.log('getting category ids from file')
        const jsonStr = fs.readFileSync(file, 'utf-8')
        return JSON.parse(jsonStr) as DbaCategory[]
    }
    console.log('getting cateogry ids from source')
    const categories: DbaCategory[] = []
    const regex = /classification:\s*'(\d+)'/;
    for (const url of categoryUrls) {
        const categoryResp = await fetch(url.url);
        const categoryHtml = await categoryResp.text();
        const match = categoryHtml.match(regex);
        if (match) {
            const id = match[1];
            const category: DbaCategory = {
                id: id,
                title: url.title,
            };
            categories.push(category);
        }
    }
    fs.writeFileSync(file, JSON.stringify(categories));
    return categories;
}

