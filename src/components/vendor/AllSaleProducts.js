import React, { useEffect, useState, useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEdit,
} from "react-icons/ai";
import {
  Button,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";

import { vendorDeleteSale, vendorGetAllSales, fetchSingleSaleByVendor, vendorUpdateSale } from "@/redux/slices/saleSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/slices/categorySlice";
import { fetchAllBrands } from "@/redux/slices/brandSlice";

import Loader from "./layout/Loader";
import ProductTable from "../common/ProductTable";
import EditProductModal from "../common/ProductEditModal";
import FilterProducts from "../common/FilterProducts";
import SearchProducts from "../common/SearchProducts";
import ConfirmationModal from "../common/ConfirmationModal";
import Image from "next/image";

const AllSaleProducts = () => {
  const dispatch = useDispatch();

  const { vendorInfo } = useSelector((state) => state.vendors);
  const { sales, singleSale, isLoading } = useSelector((state) => state.sales);
  const { brands } = useSelector((state) => state.brands);
  const { categories, subcategories, subSubcategories } = useSelector((state) => state.categories);

  const [searchQuery, setSearchQuery] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const [updatedSale, setUpdatedSale] = useState({
    name: "",
    description: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    subSubCategory: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
  });

// ✅ stabilize dep by extracting primitive
  const vendorId = vendorInfo?._id;

  useEffect(() => {
    if (vendorId) {
      dispatch(vendorGetAllSales(vendorId));
    }
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch, vendorId]);

  useEffect(() => {
    if (mainCategory) dispatch(fetchSubcategories(mainCategory));
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) dispatch(fetchSubSubcategories(subCategory));
  }, [dispatch, subCategory]);

  // ✅ derive filtered sales instead of storing them
  const filteredSales = useMemo(() => {
    let list = Array.isArray(sales) ? [...sales] : [];

    if (mainCategory)   list = list.filter(s => s.mainCategory === mainCategory);
    if (subCategory)    list = list.filter(s => s.subCategory === subCategory);
    if (subSubCategory) list = list.filter(s => s.subSubCategory === subSubCategory);
    if (selectedBrand)  list = list.filter(s => s.brand === selectedBrand);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        (s.name || "").toLowerCase().includes(q) ||
        (s._id  || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [sales, mainCategory, subCategory, subSubCategory, selectedBrand, searchQuery]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterReset = () => {
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  };

  const handleSaleEdit = (sale) => {
    setSelectedSale(sale);
    setUpdatedSale({
      id: sale._id,
      name: sale.name,
      description: sale.description || "",
      brand: sale.brand || "",
      mainCategory: sale.mainCategory,
      subCategory: sale.subCategory,
      subSubCategory: sale.subSubCategory,
      originalPrice: sale.originalPrice || "",
      discountPrice: sale.discountPrice,
      stock: sale.stock,
    });
    setOpenEditModal(true);
  };

  const closeEditModal = () => setOpenEditModal(false);
  const handleInputChange = (e) =>
    setUpdatedSale({ ...updatedSale, [e.target.name]: e.target.value });

  const handleUpdateSale = async () => {
    const result = await dispatch(vendorUpdateSale({
      id: updatedSale.id,
      updatedData: updatedSale,
    }));
  
    if (result.type.includes("fulfilled")) {
      toast.success("Sale product updated!");
      setOpenEditModal(false);
    } else {
      toast.error("Failed to update sale product");
    }
  };


  const openDeleteModalHandler = (id) => {
    setSaleToDelete(id);
    setOpenDeleteModal(true);
  };
  
  const handleDeleteSale = async () => {
    const result = await dispatch(vendorDeleteSale(saleToDelete));
  
    if (result.type.includes("fulfilled")) {
      toast.success("Sale product deleted!");
    } else {
      toast.error("Failed to delete.");
    }
  
    setOpenDeleteModal(false);
  };
  
  const handleViewSale = async (id) => {
    await dispatch(fetchSingleSaleByVendor(id));
    setOpenViewModal(true);
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row: { id } }) => `...${id.slice(-4)}`,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    { field: "brand", headerName: "Brand", minWidth: 130, flex: 0.6 },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      minWidth: 100,
      flex: 0.6,
      renderCell: ({ row: { discountPrice } }) => `US$ ${discountPrice}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row: { mainCategory } }) => capitalize(mainCategory),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            paddingTop: "13px",
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Edit">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSaleEdit(params.row)}
              style={{
                padding: "6px 12px",
                minWidth: "auto",
                fontSize: "14px",
              }}
            >
              <AiOutlineEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => openDeleteModalHandler(params.row.id)}
              style={{
                padding: "6px 12px",
                minWidth: "auto",
                fontSize: "14px",
              }}
            >
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="View">
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => handleViewSale(params.row.id)}
              style={{
                padding: "6px 12px",
                minWidth: "auto",
                fontSize: "14px",
              }}
            >
              <AiOutlineEye size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const rows = filteredSales.map((s) => ({
    ...s,
    id: s._id,
  }));

  return (
    <div className="w-full p-4 md:p-8 rounded-md">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Top */}
          <div className="flex items-center mb-6">
            <i className="fas fa-percent text-2xl text-green-600 mr-2"></i>
            <h1 className="text-2xl font-semibold">Sale Products</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {sales?.length || 0}
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
              handleCategoryChange={(e) => setMainCategory(e.target.value)}
              handleSubCategoryChange={(e) => setSubCategory(e.target.value)}
              handleSubSubCategoryChange={(e) => setSubSubCategory(e.target.value)}
              handleBrandChange={(e) => setSelectedBrand(e.target.value)}
            />
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
          </div>

          {/* Table */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} />
          </div>

          {/* Modals */}
          <EditProductModal
            open={openEditModal}
            onClose={closeEditModal}
            data={updatedSale}
            onInputChange={handleInputChange}
            onSave={handleUpdateSale}
            selectedBrand={selectedBrand}
            mainCategory={mainCategory}
            subCategory={subCategory}
            subSubCategory={subSubCategory}
            handleBrandChange={(e) => setSelectedBrand(e.target.value)}
            handleCategoryChange={(e) => setMainCategory(e.target.value)}
            handleSubCategoryChange={(e) => setSubCategory(e.target.value)}
            handleSubSubCategoryChange={(e) => setSubSubCategory(e.target.value)}
            brands={brands}
            categories={categories}
            subcategories={subcategories}
            subSubcategories={subSubcategories}
          />

          {/* View Sale Modal */}
          <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)} maxWidth="md" fullWidth>
            <DialogTitle style={{ fontWeight: "bold" }}>Sale Details</DialogTitle>
            <DialogContent>
              {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <CircularProgress />
                </div>
              ) : singleSale ? (
                <div>
                  {/* Sale Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Sale Name: {singleSale.name}</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2" color="textSecondary">
                        <strong>Brand:</strong> {singleSale.brand}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Main Category:</strong> {singleSale.mainCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Category:</strong> {singleSale.subCategory}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Sub Sub Category:</strong> {singleSale.subSubCategory}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Vendor Information */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Vendor Information</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Vendor Name:</strong> {singleSale.vendor?.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Vendor Address:</strong> {singleSale.vendor?.address}
                      </Typography>

                      {singleSale?.vendor?.avatar?.url ? (
                        <Image
                          src={singleSale.vendor.avatar.url}
                          alt={`${singleSale.vendor?.name ?? "Vendor"} Avatar`}
                          width={50}
                          height={50}
                          className="rounded-full"
                          sizes="50px"
                        />
                      ) : null}
                    </CardContent>
                  </Card>

                  {/* Pricing and Stock */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Pricing & Stock</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <Typography variant="body2">
                        <strong>Original Price:</strong> ${singleSale.originalPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Discount Price:</strong> ${singleSale.discountPrice}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Stock:</strong> {singleSale.stock}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Sale Images */}
                  <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                      <Typography variant="h6">Sale Images</Typography>
                      <Divider style={{ margin: "10px 0" }} />
                      <div style={{ display: "flex", gap: "10px" }}>
                        {Array.isArray(singleSale.images) &&
                          singleSale.images.map((img, index) => (
                            <Image
                              key={img?._id ?? index}
                              src={img?.url || "/images/placeholder.png"}
                              alt={`Sale Image ${index + 1}`}
                              width={100}
                              height={100}
                              className="rounded-md"
                              sizes="100px"
                            />
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sale details are not available.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewModal(false)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <ConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleDeleteSale}
            title="Delete Sale"
            message="Are you sure you want to delete this sale product?"
          />
        </>
      )}
    </div>
  );
};

export default AllSaleProducts;
