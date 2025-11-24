import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MdArrowDropDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getExchangeRates, setCurrency, } from "../../redux/slices/currencySlice";

const HeaderPromo = () => {
  const dispatch = useDispatch();
  const { label } = useSelector((state) => state.currency);

  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [language, setLanguage] = useState({ label: "English", code: "us" });

  const currencyMap = useMemo(() => ({
    USD: { symbol: "$", label: "USD $", flag: "/flags/us.svg" },
    SEK: { symbol: "kr", label: "SEK kr", flag: "/flags/se.svg" }, 
    ETB: { symbol: "Br", label: "ETB Br", flag: "/flags/et.svg" },
    EUR: { symbol: "€", label: "EUR €", flag: "/flags/eu.svg" },
  }), []);
  
  const handleCurrencyChange = (code) => {
    const currencyData = currencyMap[code];

    if (!currencyData) return;

    const { symbol, label } = currencyData;
    dispatch(setCurrency({ code, symbol, label }));
    setShowCurrencyDropdown(false);
  };

  useEffect(() => {
    dispatch(getExchangeRates());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = (label, code) => {
    setLanguage({ label, code });
    setShowLanguageDropdown(false);
  };

  return (
    <div className="flex flex-wrap justify-between items-center px-4 sm:px-16 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center mb-2 sm:mb-0">
        <i className="fas fa-phone-alt"></i>
        <span className="ml-2">+46 720 040 449</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Currency Dropdown */}
        <div className="relative inline-block text-left">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowCurrencyDropdown(!showCurrencyDropdown);
              setShowLanguageDropdown(false);
            }}
          >
            <span>{label}</span>
            <MdArrowDropDown className="ml-1" />
          </div>
          {showCurrencyDropdown && (
            <div className="absolute top-full mt-2 right-0 w-44 bg-white shadow-lg rounded-md py-2 z-[9999] border border-gray-200">
              {Object.keys(currencyMap).map((code) => (
                <button
                  key={code}
                  onClick={() => handleCurrencyChange(code)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-sm"
                >
                  <Image
                    src={currencyMap[code].flag}
                    alt={code}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {currencyMap[code].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Dropdown (Display Only) */}
        <div className="relative inline-block text-left">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setShowLanguageDropdown(!showLanguageDropdown);
              setShowCurrencyDropdown(false);
            }}
          >
            <Image
              src={`/flags/${language.code}.svg`}
              alt={language.label}
              width={20}
              height={20}
            />
            <MdArrowDropDown className="ml-1" />
          </div>
          {showLanguageDropdown && (
            <div className="absolute top-full mt-2 right-0 w-28 bg-white shadow-lg rounded-md py-1 z-[9999] border border-gray-200">
              {[
                { label: "English", code: "us" },
                { label: "Français", code: "fr" },
                { label: "Svenska", code: "se" },
              ].map(({ label, code }) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(label, code)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <Image
                    src={`/flags/${code}.svg`}
                    alt={label}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderPromo;
