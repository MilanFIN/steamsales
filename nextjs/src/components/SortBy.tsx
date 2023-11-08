import { updateSortBy } from "@/store/SortBySlice";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface SortByProps {
  filterByPlayerCount: boolean;
}

function SortBy(props: SortByProps) {
  const dispatch = useDispatch();

  let options = ["discount", "date", "name", "priceAsc", "priceDesc"];

  if (props.filterByPlayerCount) {
    options.unshift("playercount");
  }

  const optionLabels: Record<string, string> = {
    playercount: "Player Count",
    date: "Release date",
    name: "Name",
    priceAsc: "Price \u2191",
    priceDesc: "Price \u2193",
    discount: "Discount %",
  };
  const [activeSort, setActiveSort] = useState<string>(
    props.filterByPlayerCount ? "playercount" : "discount"
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleSortSelect = (sortOption: string) => {
    setActiveSort(sortOption);
    dispatch(updateSortBy(sortOption));

    setIsOpen(false);
  };

  return (
    <div className="flex items-center text-gray-100 mt-4 ml-3">
      Sort by
      <div className="relative" ref={dropdownRef}>
        <button
          className=" 
                    bg-gradient-to-r from-gray-700 to-gray-700
                    hover:bg-gray-600 text-gray-300 
                      hover:text-gray-200 ml-2 px-2 rounded-md w-[200px] text-left
                      justify-between flex   text-sm
                      h-6"
          onClick={handleButtonClick}
          onBlur={handleBlur}
        >
          <span className="my-auto">{optionLabels[activeSort]}</span>
          <span className="my-auto">{"\u23F7"}</span>
        </button>
        {isOpen && (
          <ul className="absolute mt-[-0px] bg-gray-800 text-gray-200  shadow-md mt-2 py-1 w-[200px] ml-2">
            {options.map((option) => (
              <li
                key={option}
                className={`h-6 hover:bg-gray-600 px-2 my-auto ${
                  activeSort === option ? "bg-gray-600" : ""
                }`}
                onClick={() => handleSortSelect(option)}
              >
                {optionLabels[option]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SortBy;
/*

*/
