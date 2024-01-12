import React, { useEffect, useState } from "react";
import DualSlider from "./DualSlider";

interface PriceFilterProps {
    updateMin: (min: number) => void;
    updateMax: (max: number) => void;
}

function PriceFilter(props: PriceFilterProps) {
    const priceChange = (min: number, max: number) => {
        props.updateMin(min);
        props.updateMax(max);
    };

    return (
        <div className="mt-2">
            <DualSlider min={0} max={80} onChange={priceChange} />
        </div>
    );
}
export default PriceFilter;
