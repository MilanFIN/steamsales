
import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";


//const APIURL = "http://api.steampowered.com/"
const APIURL = ".steampowered.com/"

export default async (req: NextApiRequest, res: NextApiResponse) => {

	//var result = cache.get("req.query")

	
	if ("path" in req.query && "subdomain" in req.query) {

		var path = req.query.path;
		var subdomain = req.query.subdomain;


		const url = "https://"+subdomain+APIURL+path;

		const value = cacheData.get(url);
		if (value) {
			
			res.status(200).json(value);
		} else {
			console.log("REQUEST")
			const hours = 1;
			const response = await fetch(url);
			const data = await response.json();
			cacheData.put(url, data, hours * 1000 * 60 * 60);
			res.status(200).json(data);
		}

	}
	else {
		return res.status(400).json("malformed request")
	}

}