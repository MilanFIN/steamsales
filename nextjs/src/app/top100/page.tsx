import "../globals.css";

import { Inter } from "next/font/google";

import { Suspense, useEffect, useRef, useState } from "react";
import { Game } from "@/common/interfaces";
import { getAppDetails, getTop100 } from "@/app/actions";
import ListingPage from "@/components/ListingPage";
import { parseGameDetails } from "@/common/utils";

export const dynamic = 'force-dynamic'


const getGames = async () => {
    const top100 = await getTop100();

    let games = new Array<Game>();
    for (let game of top100.slice(0, 5)) {
        //.forEach(async (game: any, index: number) => {
        let newGame: Game = {
            name: "",
            id: game.appid,
            rank: game.rank,
            viewRank: game.rank,
            currentPlayers: game.concurrent_in_game,
            peakPlayers: game.peak_in_game,
            priceFormatted: "0",
            priceCents: 0,
            discount: 0,
            visible: false,
            platforms: [],
            description: "",
            genres: [],
            releaseDate: 0,
        };
        
        let gameObj = await getAppDetails(game.appid);
        newGame = await parseGameDetails(newGame, gameObj);
        games.push(newGame);
    }

    return games;
};

const Top100 = async () => {
    let games = await getGames();

    return (
        <div className="">
            <Suspense fallback={null}>
                <ListingPage games={games} enablePlayerCountFilter={true} />
            </Suspense>
        </div>
    );
};

export default Top100;

/*

*/
