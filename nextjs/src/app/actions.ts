"use server"
import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

const hours = 1;

export const getTop100 = async () => {

	const url = "https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/"
	const value = cacheData.get(url);

    if (value) {
		return value
	} else {
		const response = await fetch(url, {
			cache: "default"
		});
		const data = await response.json();
		const ranks = data.response.ranks;
		cacheData.put(url, ranks, hours * 1000 * 60 * 60);
		return ranks;
	}
}

export const getAppDetails = async (id: string) => {
	let url = "https://store.steampowered.com/api/appdetails?appids="+id+"&currency=1&l=english"
	const value = cacheData.get(url);

    if (value) {
		return value
	} else {
		const response = await fetch(url, {
			cache: "default"
		});
		const data = await response.json();
		cacheData.put(url, data, hours * 1000 * 60 * 60);
		return data[Object.keys(data)[0]].data;
	}
}

export const getFeatured = async () => {

	const url = "https://store.steampowered.com/api/featuredcategories/"
	const value = cacheData.get(url);

    if (value) {
		return value
	} else {
		const response = await fetch(url, {
			cache: "default"
		});
		const data = await response.json();
		cacheData.put(url, data, hours * 1000 * 60 * 60);
		return data;
	}
}