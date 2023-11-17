import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePriceLimits } from "../store/priceLimitSlice";

import DualSlider from "./DualSlider";

interface PriceFilterProps {}

function PriceFilter(props: PriceFilterProps) {
  const dispatch = useDispatch();

  const [maxPrice, setMaxPrice] = useState<number>(0);

  const priceChange = (min: number, max: number) => {
    dispatch(updatePriceLimits({ maxPrice: max, minPrice: min }));
  };

  return (
    <div className="mt-2">
      <DualSlider min={0} max={80} onChange={priceChange} />
    </div>
  );
}
//    <input type="range" min={0.0} max={30.0}  className="w-full h-8 " id="maxPriceRange" step={0.5}
//onChange={onChangeMaxPrice} value={maxPrice}></input> {maxPrice}e

export default PriceFilter;
