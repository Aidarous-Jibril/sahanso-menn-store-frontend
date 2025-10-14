// Third-party library imports
import "quill/dist/quill.snow.css";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { AiOutlinePlus } from "react-icons/ai";

// Local imports (Redux slices)
import { createProduct } from "@/redux/slices/productSlice";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchAllBrands } from "@/redux/slices/brandSlice";
import RichTextEditor from "../common/RichTextEditor";

// Category-specific attributes
const categoryAttributes = {
  clothing: ["size", "color", "material", "gender"],
  vehicles: ["model", "make", "year", "mileage", "fuelType"],
  electronics: ["model", "warranty", "condition", "processor", "memory", "storage", "display"],
  shoes: ["size", "color", "material", "gender"],
  property: ["propertyType", "location", "bedrooms", "bathrooms", "area"],
  content: ["author", "publisher", "genre", "format", "language"],
  home: ["material", "dimensions", "roomType"],
  wellness: ["type", "expiryDate", "ingredients", "gender"],
  jobs: ["jobType", "location", "salary", "experienceLevel", "industry"],
};

const CreateProduct = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  const [images, setImages] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    brand: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    isFeatured: false,
    attributes: {},
  });

  // bootstrap data
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  // derived subcategories
  const subcategories = useMemo(() => {
    if (!productData.mainCategory) return [];
    const main = categories?.find((c) => c.slug === productData.mainCategory);
    return main?.subcategories || [];
  }, [categories, productData.mainCategory]);

  // derived sub-subcategories
  const subSubcategories = useMemo(() => {
    if (!productData.subCategory) return [];
    const sub = subcategories.find((s) => s.slug === productData.subCategory);
    return sub?.subsubcategories || [];
  }, [subcategories, productData.subCategory]);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setProductData((prev) => ({
      ...prev,
      mainCategory: value,
      subCategory: "",
      subSubCategory: "",
      attributes: {},
    }));
  };

  const handleDescriptionChange = (text) => {
    // text is already plain; sanitize on submit if you like
    setProductData((prev) => ({ ...prev, description: text }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]); // data URL
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleIsFeaturedChange = (e) => {
    setProductData((prev) => ({ ...prev, isFeatured: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.mainCategory || !productData.subCategory || !productData.brand) {
      toast.error("Please select all required fields.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const form = new FormData();
    Object.entries(productData).forEach(([key, val]) => {
      if (key !== "attributes") form.append(key, val);
    });
    form.append("vendorId", vendorInfo._id);
    Object.entries(productData.attributes).forEach(([k, v]) => {
      form.append(`attributes[${k}]`, v);
    });
    images.forEach((dataUrl) => form.append("images", dataUrl)); // if API expects File, switch to File objects

    try {
      const result = await dispatch(createProduct(form));
      if (result.type === "products/createProduct/fulfilled") {
        toast.success("Product created successfully!");
        router.push("/vendor/dashboard");
      } else {
        const msg = result.payload?.message || "An error occurred while creating the product.";
        toast.error(msg);
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full p-4 md:p-8 min-h-screen">
      {/* Page Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <h5 className="text-[24px] font-[500]">Create Product</h5>
      </div>

      {/* Form Fields */}
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Product Information */}
        <div className="w-full mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Product Information</h2>

          <div className="flex items-center mb-4">
            <label className="w-[180px] text-[16px] font-medium">Product Name:</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New product"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[16px] font-medium mb-2">Description:</label>
            <RichTextEditor as="text" value={productData.description} onChange={handleDescriptionChange} />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Selection */}
          <div>
            <label className="block mb-2 text-[16px]">Main Category:</label>
            <select
              value={productData.mainCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a category</option>
              {categories?.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection */}
          <div>
            <label className="block mb-2 text-[16px]">Subcategory:</label>
            <select
              value={productData.subCategory}
              onChange={(e) => setProductData((prev) => ({ ...prev, subCategory: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.slug} value={subcategory.slug}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Subcategory Selection */}
          <div>
            <label className="block mb-2 text-[16px]">Sub-Subcategory:</label>
            <select
              value={productData.subSubCategory}
              onChange={(e) =>
                setProductData((prev) => ({ ...prev, subSubCategory: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a sub-subcategory</option>
              {subSubcategories.map((ssc) => (
                <option key={ssc.slug} value={ssc.slug}>
                  {ssc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Selection */}
          <div>
            <label className="block mb-2 text-[16px]">Brand:</label>
            <select
              value={productData.brand}
              onChange={(e) => setProductData((prev) => ({ ...prev, brand: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a Brand</option>
              {brands?.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price and Stock */}
        <div className="mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Price & Stock</h2>

          <div className="flex items-center mb-4">
            <label className="w-[180px] text-[16px] font-medium">Original Price:</label>
            <input
              type="number"
              name="originalPrice"
              value={productData.originalPrice}
              onChange={handleInputChange}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[180px] text-[16px] font-medium">Discount Price:</label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleInputChange}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[180px] text-[16px] font-medium">Stock:</label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Attribute Fields */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryAttributes[productData.mainCategory]?.map((attribute) => (
            <div className="flex items-center mb-4" key={attribute}>
              <label className="w-[180px] text-[16px]">
                {attribute.charAt(0).toUpperCase() + attribute.slice(1)}:
              </label>
              <input
                type="text"
                name={attribute}
                value={productData.attributes[attribute] || ""}
                onChange={handleAttributeChange}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Images Upload */}
        <div className="mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2">
            {images.map((src, index) => (
              <div key={index} className="relative">
                <Image
                  src={src}           // data URL
                  alt={`preview ${index}`}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Featured Product Checkbox */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={productData.isFeatured}
              onChange={handleIsFeaturedChange}
              className="mr-2"
            />
            <span className="text-[16px] font-medium">Featured Product</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <AiOutlinePlus size={22} className="mr-1" />
          <span className="font-semibold tracking-wide">Create Product</span>
        </button>
      </form>
    </div>
  );
};


export default CreateProduct;