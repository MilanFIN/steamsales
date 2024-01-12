import React, { useEffect, useState } from "react";
import DualSlider from "./DualSlider";

interface DiscountFilterProps {
    updateMin: (min: number) => void;
    updateMax: (max: number) => void;
}

function DiscountFilter(props: DiscountFilterProps) {
    const discountChange = (min: number, max: number) => {
        props.updateMin(min);
        props.updateMax(max);
    };

    return (
        <div className={"mt-2"}>
            <DualSlider min={0} max={100} onChange={discountChange} />
        </div>
    );
}

export default DiscountFilter;
