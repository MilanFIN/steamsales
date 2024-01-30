import "../globals.css";

import { Suspense } from "react";
import { Game } from "@/common/interfaces";
import { getAppDetails, getFeatured, getTop100 } from "@/app/actions";
import ListingPage from "@/components/ListingPage";
import { parseGameDetails } from "@/common/utils";

export const dynamic = "force-dynamic";

const getGames = async () => {
    const featured = await getFeatured();

    let rank = 0;

    let gameIds: number[] = [];

    Object.keys(featured).forEach((category: string) => {
        let isnum = /^\d+$/.test(category);
        if (!isnum) {
            if (featured[category].hasOwnProperty("items")) {
                featured[category].items.forEach((game: any) => {
                    gameIds.push(game.id);
                });
            }
        }
    });

    let games = new Array<Game>();
    for (let id of gameIds) {
        if (id != undefined && id != null) {
            let newGame: Game = {
                name: "",
                id: id,
                rank: rank,
                viewRank: rank,
                currentPlayers: 0,
                peakPlayers: 0,
                priceFormatted: "0",
                priceCents: 0,
                discount: 0,
                visible: false,
                platforms: [],
                description: "",
                genres: [],
                releaseDate: 0,
            };
            rank++;

            try {
                if (!games.some((game) => (game.id == id))) {
                    let gameObj = await getAppDetails(id.toString());
                    newGame = await parseGameDetails(newGame, gameObj);
                    games.push(newGame);
                }
            } catch (e) {}
        }
    }

    games.sort((a, b) => b.discount - a.discount);

    return games;
};

const Featured = async () => {
    let games = await getGames();

    return (
        <div className="">
            <Suspense fallback={null}>
                <ListingPage games={games} enablePlayerCountFilter={false} />
            </Suspense>
        </div>
    );
};

export default Featured;

/*

*/
