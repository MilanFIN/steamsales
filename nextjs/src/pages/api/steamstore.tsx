import { NextApiRequest, NextApiResponse } from "next";


const STOREURL = "https://store.steampowered.com/"

export default async (req: NextApiRequest, res: NextApiResponse) => {

	//var result = cache.get("req.query")

	if ("path" in req.query) {

		var path = req.query.path;
		console.log(STOREURL + path)
		const response = await fetch(STOREURL + path, {
			next: { revalidate: 3600 },
			})
		const data = await response.json()
		res.status(200).json(data);


	}
	else {
		return res.status(400).json("malformed request")
	}
}