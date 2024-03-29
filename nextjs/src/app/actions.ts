"use server";
import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

const hours = 1;

export const getTop100 = async () => {
    const url =
        "https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/";

    const response = await fetch(url, {
        next: {
            revalidate: 3600,
        },
    });
    const data = await response.json();
    const ranks = data.response.ranks;
    return ranks;
};

export const getAppDetails = async (id: string) => {
    let url =
        "https://store.steampowered.com/api/appdetails?appids="+id+"&currency=1&lang=english"
    const response = await fetch(url, {
        next: {
            revalidate: 3600,
        },
    });
    const data = await response.json();
    return data[Object.keys(data)[0]].data;
};

export const getAppsDetails = async (ids: string[]) => {
    let results = [];
    for (let i = 0; i < ids.length; i++) {
        let url =
            "https://store.steampowered.com/api/appdetails?appids=" +
            ids[i]+"&currency=1&lang=english"
        const response = await fetch(url, {
            next: {
                revalidate: 3600,
            },
        });
        const data = await response.json();
        const res = data[Object.keys(data)[0]].data;
        results.push(res)
    }
    return results;
};

export const getFeatured = async () => {
    const url = "https://store.steampowered.com/api/featuredcategories/";
    const response = await fetch(url, {
        next: {
            revalidate: 3600,
        },
    });
    const data = await response.json();
    return data;
};
