import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

//const APIURL = "http://api.steampowered.com/"
const APIURL = ".steampowered.com/";

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    "path" in req.query &&
    "subdomain" in req.query &&
    "currency" in req.query &&
    "lang" in req.query
  ) {
    var path = req.query.path;
    var currency = req.query.currency;
    var lang = req.query.lang;

    var subdomain = req.query.subdomain;

    let url = "https://" + subdomain + APIURL + path;
    if (subdomain === "store") {
      url += "&currency=" + currency + "&l=" + lang;
    }

    const value = cacheData.get(url);
    if (value) {
      res.status(200).json(value);
    } else {
      const hours = 1;
      const response = await fetch(url);
      const data = await response.json();
      cacheData.put(url, data, hours * 1000 * 60 * 60);
      res.status(200).json(data);
    }
  } else {
    return res.status(400).json("malformed request");
  }
};

export default api;
