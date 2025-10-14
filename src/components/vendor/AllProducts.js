// Third-Party Imports
import React, { useEffect, useState } from "react"; 
import { toast } from "react-toastify"; 
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux"; 
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai"; 
import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip, Typography } from "@mui/material"; 
//Local Imports
import { fetchVendorSingleProduct, vendorDeleteProduct, vendorGetAllProducts, vendorUpdateProduct } from "../../redux/slices/productSlice"; 
import { fetchAllBrands } from "@/redux/slices/brandSlice"; 
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/slices/categorySlice"; 
import Loader from "./layout/Loader"; 
import ProductTable from "../common/ProductTable"; 
import EditProductModal from "../common/ProductEditModal"; 
import FilterProducts from "../common/FilterProducts"; 
import SearchProducts from "../common/SearchProducts"; 
import ConfirmationModal from "../common/ConfirmationModal"; 


const AllProducts = () => {
  const dispatch = useDispatch();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { vendorProducts, product, isLoading } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories } = useSelector((state) => state.categories);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [openViewModal, setOpenViewModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); 

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
  });

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleFilterReset = () => {
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  };

  const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
      id: product.id,
      name: product.name,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      brand: product.brand,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      subSubCategory: product.subSubCategory,
    });
    setMainCategory(product.mainCategory);
    setSubCategory(product.subCategory);
    setSubSubCategory(product.subSubCategory);
    setSelectedBrand(product.brand);
    setOpenEditModal(true);
  };

  const closeEditModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const handleBrandChange = (e) => setSelectedBrand(e.target.value);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setMainCategory(selectedCategory);
    setSubCategory("");
    setSubSubCategory("");
    dispatch(fetchSubcategories(selectedCategory));
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setSubCategory(selectedSubCategory);
    setSubSubCategory("");
    dispatch(fetchSubSubcategories(selectedSubCategory));
  };

  const handleSubSubCategoryChange = (e) => setSubSubCategory(e.target.value);

  const handleUpdateProduct = async () => {
    if (!subCategory || !subSubCategory) {
      return toast.error(`Please select ${!subCategory ? "Sub-Category" : "Sub-Sub Category"} before updating.`);
    }

    const payload = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      originalPrice: updatedProduct.originalPrice,
      discountPrice: updatedProduct.discountPrice,
      stock: updatedProduct.stock,
      brand: selectedBrand,
      mainCategory,
      subCategory,
      subSubCategory,
    };

    try {
      const result = await dispatch(vendorUpdateProduct(payload));
      if (result.type === "products/vendorUpdateProduct/fulfilled") {
        toast.success("Product updated successfully!");
        dispatch(vendorGetAllProducts(vendorInfo._id));
        window.location.reload();
        setOpenEditModal(false);
      } else {
        toast.error("Failed to update the product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(vendorDeleteProduct(id));
      if (result.type === "products/vendorDeleteProduct/fulfilled") {
        toast.success("Product deleted successfully!");
      } else {
        toast.error(result.payload || "Product deletion failed");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    }
    setOpenDeleteModal(false);
  };

  const openDeleteModalHandler = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteModal(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(vendorGetAllProducts(vendorInfo._id));
    }
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch, vendorInfo]);

  useEffect(() => {
    if (mainCategory) {
      dispatch(fetchSubcategories(mainCategory));
    }
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
    }
  }, [dispatch, subCategory]);

  useEffect(() => {
    let filtered = [...vendorProducts];

    if (mainCategory) {
      filtered = filtered.filter((product) => product.mainCategory === mainCategory);
    }
    if (subCategory) {
      filtered = filtered.filter((product) => product.subCategory === subCategory);
    }
    if (subSubCategory) {
      filtered = filtered.filter((product) => product.subSubCategory === subSubCategory);
    }
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (!openEditModal) {
      setFilteredProducts(filtered);
    }
  }, [mainCategory, subCategory, subSubCategory, selectedBrand, vendorProducts, searchQuery, openEditModal]);

  /* ======= Handlers – Viewing Product Detailsn ======== */    
  const handleViewProduct = async (productId) => {
    console.log("ID", productId)
      await dispatch(fetchVendorSingleProduct(productId));
      setOpenViewModal(true);
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 1, renderCell: ({ row: { id } }) => `...${id.slice(-4)}` },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4, renderCell: ({ row: { name } }) => `${name.slice(0, 8)}...` },
    { field: "brand", headerName: "Brand", minWidth: 130, flex: 0.6 },
    { 
      field: "price", 
      headerName: "U-Price", 
      minWidth: 100, 
      flex: 0.6,
      renderCell: ({ row: { originalPrice, discountPrice } }) => {
        return discountPrice ? `US$ ${discountPrice}` : `US$ ${originalPrice}`;
      },
    },
    { field: "stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "category", headerName: "Category", minWidth: 180, flex: 1.4, renderCell: ({ row: { mainCategory } }) => `${mainCategory.slice(0, 8)}...` },
    { field: "subcat", headerName: "Subcat", minWidth: 180, flex: 1.4, renderCell: ({ row: { subCategory } }) => `${subCategory.slice(0, 8)}...` },
    { field: "subSubcat", headerName: "SubSubcat", minWidth: 180, flex: 1.4, renderCell: ({ row: { subSubCategory } }) => `${subSubCategory.slice(0, 8)}...` },
    { field: "actions", headerName: "Actions", minWidth: 200, flex: 1, renderCell: (params) => (
        <div style={{ paddingTop: "13px", display: "flex", justifyContent: "flex-start", gap: "10px", flexWrap: "wrap" }}>
          <Tooltip title="Edit">
            <Button variant="contained" color="primary" size="small" onClick={() => handleProductEdit(params.row)} style={{ padding: "6px 12px", minWidth: "auto", fontSize: "14px" }}>
              <AiOutlineEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button variant="contained" color="error" size="small" onClick={() => openDeleteModalHandler(params.row.id)} style={{ padding: "6px 12px", minWidth: "auto", fontSize: "14px" }}>
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="View">
            <Button variant="contained" color="info" size="small" onClick={() => handleViewProduct(params.row.id)} style={{ padding: "6px 12px", minWidth: "auto", fontSize: "14px" }}>
              <AiOutlineEye size={16} />
            </Button>
          </Tooltip>
        </div>
    ) },
  ];
  const rows = filteredProducts.map((item) => ({
    id: item._id,
    name: item.name,
    brand: item.brand,
    originalPrice: item.originalPrice,
    discountPrice: item.discountPrice,
    stock: item.stock,
    mainCategory: item.mainCategory,
    subCategory: item.subCategory,
    subSubCategory: item.subSubCategory,
  }));

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-8 rounded-md">
          {/* Top */}
          <div className="flex items-center mb-6">
            <i className="fas fa-percent text-2xl text-green-600 mr-2"></i>
            <h1 className="text-2xl font-semibold">Products</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {vendorProducts?.length || 0}
            </span>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <FilterProducts
              mainCategory={mainCategory}
              subCategory={subCategory}
              subSubCategory={subSubCategory}
              selectedBrand={selectedBrand}
              categories={categories}
              subcategories={subcategories}
              subSubcategories={subSubcategories}
              brands={brands}
              handleFilterReset={handleFilterReset}
              handleCategoryChange={handleCategoryChange}
              handleSubCategoryChange={handleSubCategoryChange}
              handleSubSubCategoryChange={handleSubSubCategoryChange}
              handleBrandChange={handleBrandChange}
            />
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
          </div>

          {/* Data Table */}
           <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable
              rows={rows}
              columns={columns}
            />
          </div>

          {/* Edit Product Modal */}
          <EditProductModal
            open={openEditModal}
            onClose={closeEditModal}
            data={updatedProduct}
            onInputChange={handleInputChange}
            onSave={handleUpdateProduct}
            selectedBrand={selectedBrand}
            mainCategory={mainCategory}
            subCategory={subCategory}
            subSubCategory={subSubCategory}
            handleBrandChange={handleBrandChange}
            handleCategoryChange={handleCategoryChange}
            handleSubCategoryChange={handleSubCategoryChange}
            handleSubSubCategoryChange={handleSubSubCategoryChange}
            brands={brands}
            categories={categories}
            subcategories={subcategories}
            subSubcategories={subSubcategories}
          />
        {/* View Product Modal */}
          <Dialog
            open={openViewModal}
            onClose={()=>  setOpenViewModal(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle style={{ fontWeight: 'bold' }}>Product Details</DialogTitle>
            <DialogContent>
              {isLoading ? ( 
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <CircularProgress />
                </div>
              ) : product ? (
                <div>
                  {/* Product Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Product Name: {product.name}</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2" color="textSecondary">
                        <strong>Brand:</strong> {product.brand}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Main Category:</strong> {product.mainCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Category:</strong> {product.subCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Sub Category:</strong> {product.subSubCategory}
                      </Typography>
                    </CardContent>
                  </Card>

                {/* Vendor Information */}
                <Card style={{ marginBottom: "20px" }}>
                  <CardContent>
                    <Typography variant="h6">Vendor Information</Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <Typography variant="body2">
                      <strong>Vendor Name:</strong> {product?.vendor?.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Vendor Address:</strong> {product?.vendor?.address}
                    </Typography>

                    {product?.vendor?.avatar?.url && (
                      <Image
                        src={product.vendor.avatar.url}
                        alt={`${product?.vendor?.name || "Vendor"} Avatar`}
                        width={50}
                        height={50}
                        className="rounded-full"
                        sizes="50px"
                      />
                    )}
                  </CardContent>
                </Card>

                  {/* Product Pricing and Stock */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Pricing & Stock</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Original Price:</strong> ${product.originalPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Discount Price:</strong> ${product.discountPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Stock:</strong> {product.stock}
                      </Typography>
                    </CardContent>
                  </Card>
                  {/* Product Images */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Product Images</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <div style={{ display: "flex", gap: 10 }}>
                        {Array.isArray(product?.images) &&
                          product.images.map((img, index) =>
                            img?.url ? (
                              <Image
                                key={img._id ?? index}
                                src={img.url}
                                alt={`Product Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="rounded"
                                sizes="100px"
                              />
                            ) : null
                          )}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Product Reviews */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Product Reviews</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      {product.reviews.length > 0 ? (
                        <ul>
                          {product.reviews.map((review) => (
                            <li key={review._id}>
                              <Typography variant="body2">
                                <strong>{review.user.name} ({review.rating} stars)</strong>
                              </Typography>
                              <Typography variant="body2">{review.comment}</Typography>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2" color="textSecondary">No reviews yet.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">Product details are not available.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>  setOpenViewModal(false)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Confirmation Delete Modal */}
          <ConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleDelete}
            title="Confirm Deletion"
            message="Are you sure you want to delete this product?"
          />
        </div>
      )}
    </div>
  );
};

export default AllProducts;
