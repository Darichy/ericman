import { toggleTheme } from "@/store/themeSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const CustomSegmentedControl = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(1);
  const dispatch = useDispatch();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    dispatch(toggleTheme());
  };

  return (
    <div className=" border-4 rounded-full flex w-[200px] bg-gray-200 ">
      <div
        className={`segmented-control-button cursor-pointer flex px-4 space-x-2 text-black ${
          selectedOption === 1
            ? "bg-white  text-black rounded-full shadow py-2 "
            : "bg-gray-200 text-gray-700 rounded-full  py-2 "
        } transition-all duration-300`}
        onClick={() => handleOptionClick(1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${
            selectedOption == 1
              ? "transition-transform scale-95 text-indigo-800 rotate-180"
              : ""
          } w-6 h-6`}
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
        <span>Light</span>
      </div>
      <div
        className={` cursor-pointer px-4 flex space-x-2 text-black ${
          selectedOption === 2
            ? "bg-white text-black  rounded-full shadow py-2"
            : "bg-gray-200 rounded-full text-gray-700 px-3  py-2 "
        } transition-all duration-300`}
        onClick={() => handleOptionClick(2)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${
            selectedOption === 2
              ? "transition-transform scale-[0.9] text-indigo-800 "
              : ""
          } w-6 h-6`}
        >
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
            clipRule="evenodd"
          />
        </svg>
        <span>Dark</span>
      </div>
    </div>
  );
};

export default CustomSegmentedControl;
