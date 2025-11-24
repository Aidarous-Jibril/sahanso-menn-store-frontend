import React from "react";
import ProductCard from "@/components/product/ProductCard";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeaderPromo from "@/components/layout/HeaderPromo";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { capitalizeWords } from "@/lib/utils";

import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";


const SubSubCategoryPage = ({ categories, products, mainCategory, subCategory, subSubCategory , sort}) => {
  return (
    <>
      <Head>
        <title>{capitalizeWords(subSubCategory || "Products")} | Sahanso</title>
        <meta
          name="description"
          content={`Browse high-quality products in ${capitalizeWords(subSubCategory || "this category")}, part of ${capitalizeWords(subCategory || "")}.`}
        />
      </Head>

      <div className="min-h-screen flex flex-col">
      <HeaderPromo />
        <Header categories={categories} />
        <div className="flex-grow py-8 container mx-auto px-4 sm:pb-20 md:pb-28">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: mainCategory, href: `/category/${mainCategory}` },
              { label: subCategory, href: `/category/${mainCategory}/${subCategory}` },
              { label: subSubCategory }
            ]}
          />

          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {capitalizeWords(subSubCategory || "Unknown Sub-Subcategory")}
          </h1>
          <div className="container mx-auto px-4 flex justify-end"> <SortSelect value={sort || "newest"} /> </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products available in this category yet.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

function SortSelect({ value }) {
  const router = useRouter();

  const onChange = (e) => {
    const sort = e.target.value;

    // keep current route params and other query params, reset page to 1
    const { mainCategory, subCategory, subSubCategory, ...rest } = router.query;

    router.push(
      {
        pathname: `/category/${mainCategory}/${subCategory}/${subSubCategory}`,
        query: { ...rest, sort, page: 1 },
      },
      undefined,
      { shallow: false }
    );
  };

  return (
    <select
      value={value}
      onChange={onChange}
      className="ml-auto mb-6 block rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-600 focus:outline-none"
      aria-label="Sort products"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
}

export async function getServerSideProps(context) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { mainCategory, subCategory, subSubCategory } = context.params;
  const { sort = "newest" } = context.query || {};

  const [categoriesRes, subSubcategoriesRes, productsRes] = await Promise.all([
    axios.get(`${baseURL}/api/categories`).catch(() => null),
    axios.get(`${baseURL}/api/sub-subcategories?subCategorySlug=${subCategory}`).catch(() => null),
    axios.get(
      `${baseURL}/api/products?subCategory=${subCategory}&subSubCategory=${subSubCategory}` +
      (sort ? `&sort=${encodeURIComponent(sort)}` : "")
    ).catch(() => null),
  ]);

  return {
    props: {
      categories: categoriesRes?.data?.categories || [],
      subSubcategories: subSubcategoriesRes?.data?.subSubcategories || [],
      products: productsRes?.data?.products || [],
      mainCategory: mainCategory || null,
      subCategory: subCategory || null,
      subSubCategory: subSubCategory || null,
      sort, 
    },
  };
}

export default SubSubCategoryPage;

