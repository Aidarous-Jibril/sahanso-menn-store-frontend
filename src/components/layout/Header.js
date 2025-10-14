import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";

import HeaderBottom from "./HeaderBottom";
import HeaderUpper from "./HeaderUpper";

const Header = ({ products, categories }) => {
  const [searchData, setSearchData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState(false);
  const [sidebar, setSidebar] = useState(false)

  useEffect(() => {
    const handler = debounce(() => {
      const filteredProducts = products?.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchData(filteredProducts);
    }, 300);

    if (searchTerm) handler();

    return () => handler.cancel();
  }, [products, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      setSearchData(null); 
    }
  };

  return (
    <div className="w-full sticky top-0 z-50">
      <div
        className={ active === true ? "w-full shadow-sm fixed top-0 left-0 z-10" : null}
      >
        <HeaderUpper
          categories={categories}
          handleSearchChange={handleSearchChange}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      </div>
      {sidebar && (
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: -500, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 right-0 w-[350px] h-full z-50  bg-[#131921] bg-opacity-50 text-white"
        ></motion.div>
      )}

      <HeaderBottom
        categories={categories}
        setActive={setActive}
        handleSearchChange={handleSearchChange}
        searchData={searchData}
        setSearchData={setSearchData}
      />
    </div>
  );
};

export default Header;
