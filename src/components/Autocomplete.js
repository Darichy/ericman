import { API_SERVER } from "@/utils/constants";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const Autocomplete = ({
  config,
  value,
  setValue,
  label,
  setSelected,
  required,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  function handleSearch(value) {
    setLoading(true);
    if (value?.length === 0) {
      setLoading(false);
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (config.method === "POST") {
      axios
        .post(`${config.url}=${value}`, { ...config.payload })
        .then((response) => {
          if (response.data.length > 0) {
            setLoading(false);
            setResults(response.data);
            setShowDropdown(true);
          } else {
            setLoading(false);
            setResults([]);
            setShowDropdown(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      axios
        .get(`${config.url}=${value}`)
        .then((response) => {
          if (response.data.length > 0) {
            setLoading(false);
            setResults(response.data);
            setShowDropdown(true);
          } else {
            setLoading(false);
            setResults([]);
            setShowDropdown(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }
  // useEffect(() => {
  //   handleSearch(value);
  // }, [value]);

  const handleSelect = (item) => {
    setSelected(item);
    setValue(item.name);
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative flex flex-col">
      <div className=" flex ">
        <label>{label}</label>{" "}
        {required && <span className="text-red-600">*</span>}
      </div>
      <input
        type="text"
        className="focus:ring-[1px] focus:ring-[#017bf5] text-gray-500 text-sm border  focus:outline-none rounded py-1 pl-4 border-gray-300"
        placeholder="Type to search..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {loading && (
        <Loader
          className="absolute top-[55%] right-[10px]"
          color="cyan"
          size="xs"
        />
      )}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg"
        >
          {results.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.name}
              {/* Replace 'name' with the key containing your data */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
