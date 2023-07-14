

import { updateSortBy } from '@/store/SortBySlice';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";




interface SortByProps {

}

function SortBy(props: SortByProps){
  const dispatch = useDispatch();

  const options = ["playercount", "date", "name", "priceAsc", "priceDesc"];
  const optionLabels: Record<string, string> = {
    playercount: "Player Count",
    date: "Release date",
    name: "Name",
    priceAsc: "Price \u2191",
    priceDesc: "Price \u2193",
  };
    const [activeSort, setActiveSort] = useState<string>("playercount");

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
  
  /*
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => {
          setIsOpen(false);
        }, 100);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    
  }, []);
*/
  const handleSortSelect = (sortOption: string) => {
    setActiveSort(sortOption);
    dispatch(
      updateSortBy(sortOption)
    );

    setIsOpen(false);
  };


  return (
    <div className="flex items-center text-gray-100">
      
      Sort by 

      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-gray-800 hover:bg-gray-600 text-gray-300 hover:text-gray-200 py-2 px-4 rounded-md w-[200px] text-left
          justify-between flex"
          onClick={handleButtonClick}
          onBlur={handleBlur}
        >              
                <span>{optionLabels[activeSort]}</span>
                <span>{'\u23F7'}</span> 
              </button>
              {isOpen && (
                <ul className="absolute mt-[-0px] bg-gray-800 text-gray-200  shadow-md mt-2 py-1 w-[200px]">
                  {options.map((option) => (
                    <li
                      key={option}
                      className={`hover:bg-gray-600 px-4 py-2 ${
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

  )
}

export default SortBy;
/*
	  <select className="w-[200px] h-[48x] p-2.5 text-gray-900 bg-gray-400 border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
	  					onChange={changeSort}>
			  	<option value="count" selected><div className="bg-gray-900">Player count</div></option>
				<option value="date">Release date</option>
                <option value="name">Name</option>
                <option value="priceLow">Lowest price</option>
                <option value="priceHigh">Highest price</option>
            </select>

*/