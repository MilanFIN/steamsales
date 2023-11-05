import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

const FEATUREDURL = "https://store.steampowered.com/api/featuredcategories/";
const featured = async (req: NextApiRequest, res: NextApiResponse) => {
  const value = cacheData.get(FEATUREDURL);
  if (value) {
    res.status(200).json(value);
  } else {
    const hours = 1;
    const response = await fetch(FEATUREDURL);
    const data = await response.json();
    cacheData.put(FEATUREDURL, data, hours * 1000 * 60 * 60);
    res.status(200).json(data);
  }
};

export default featured;
