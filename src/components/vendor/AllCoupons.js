import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Switch,
  Tooltip,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Loader from "../vendor/layout/Loader";
import { fetchAllCoupons, createCoupon, deleteCoupon, updateCoupon } from "@/redux/slices/couponSlice";
import { vendorGetAllProducts } from "@/redux/slices/productSlice";
import { fetchCategories, fetchSubcategories, fetchSubSubcategories } from "@/redux/slices/categorySlice";
import ProductTable from "../common/ProductTable";
import SearchProducts from "../common/SearchProducts";

const AllCoupons = () => {
  const dispatch = useDispatch();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { coupons, loading } = useSelector((state) => state.coupons);
  const { vendorProducts } = useSelector((state) => state.products);
  const { categories, subcategories, subSubcategories } = useSelector((state) => state.categories);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("Purchase");
  const [status, setStatus] = useState("active");
  const [validityStart, setValidityStart] = useState(new Date());
  const [validityEnd, setValidityEnd] = useState(new Date());

  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(fetchAllCoupons(vendorInfo._id));
      dispatch(vendorGetAllProducts(vendorInfo._id));
    }
    dispatch(fetchCategories());
  }, [dispatch, vendorInfo]);

  useEffect(() => {
    if (mainCategory) {
      dispatch(fetchSubcategories(mainCategory));
      setSubCategory("");
      setSubSubCategory("");
    }
  }, [dispatch, mainCategory]);

  useEffect(() => {
    if (subCategory) {
      dispatch(fetchSubSubcategories(subCategory));
      setSubSubCategory("");
    }
  }, [dispatch, subCategory]);

  useEffect(() => {
    if (subSubCategory) {
      const filtered = vendorProducts.filter(
        (product) => product.subSubCategory === subSubCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [subSubCategory, vendorProducts]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredCoupons(
      coupons.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) || c._id?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, coupons]);

  const resetForm = () => {
    setName("");
    setValue("");
    setType("Purchase");
    setStatus("active");
    setValidityStart(new Date());
    setValidityEnd(new Date());
    setMainCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSelectedProducts([]);
    setEditMode(false);
    setEditCouponId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      name,
      value,
      type,
      validityStart,
      validityEnd,
      status,
      selectedProducts,
      vendorId: vendorInfo._id,
      mainCategory,
      subCategory,
      subSubCategory,
    };

    const action = editMode
      ? updateCoupon({ couponId: editCouponId, couponData })
      : createCoupon(couponData);

    const result = await dispatch(action);
    if (
      result.type ===
      (editMode
        ? "coupons/updateCoupon/fulfilled"
        : "coupons/createCoupon/fulfilled")
    ) {
      toast.success(editMode ? "Coupon updated!" : "Coupon created!");
      dispatch(fetchAllCoupons(vendorInfo._id));
      setOpenDialog(false);
      resetForm();
    } else {
      toast.error("Operation failed.");
    }
  };

  const handleEdit = (coupon) => {
    setEditMode(true);
    setEditCouponId(coupon.id);
    setName(coupon.name);
    setValue(coupon.value ?? "");
    setType(coupon.type);
    setStatus(coupon.status);
    setValidityStart(new Date(coupon.validity?.start || coupon.validityStart));
    setValidityEnd(new Date(coupon.validity?.end || coupon.validityEnd));
    setSelectedProducts(coupon.selectedProducts);
    setMainCategory(coupon.mainCategory || "");
    setSubCategory(coupon.subCategory || "");
    setSubSubCategory(coupon.subSubCategory || "");
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteCoupon(deleteTargetId));
    if (result.type === "coupons/deleteCoupon/fulfilled") {
      toast.success("Deleted.");
      dispatch(fetchAllCoupons(vendorInfo._id));
    } else {
      toast.error("Delete failed.");
    }
    setDeleteDialog(false);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const currentCoupon = coupons.find((c) => c._id === id);
    const updated = { ...currentCoupon, status: newStatus };

    const result = await dispatch(
      updateCoupon({ couponId: id, couponData: updated })
    );
    if (result.type === "coupons/updateCoupon/fulfilled") {
      toast.success("Status updated.");
      dispatch(fetchAllCoupons(vendorInfo._id));
    } else {
      toast.error("Status update failed.");
    }
  };

  const handleProductSelection = (e) => {
    const { options } = e.target;
    const selected = [];
    for (const option of options) {
      if (option.selected) selected.push(option.value);
    }
    setSelectedProducts(selected);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "valueDisplay", headerName: "Value", flex: 0.7 },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      renderCell: (params) => (
        <span style={{ color: params.row.type === "Purchase" ? "green" : "blue" }}>
          {params.row.type}
        </span>
      ),
    },
    {
      field: "validity",
      headerName: "Validity",
      flex: 1.2,
      renderCell: ({ row }) => {
        const start = row.validity.start
          ? new Date(row.validity.start).toLocaleDateString()
          : "N/A";
        const end = row.validity.end
          ? new Date(row.validity.end).toLocaleDateString()
          : "N/A";
        return `${start} - ${end}`;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: ({ row }) => (
        <Switch
          checked={row.status === "active"}
          onChange={() => handleStatusToggle(row.id, row.status)}
        />
      ),
    },
        
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <div style={{ paddingTop: "13px", display: "flex", justifyContent: "flex-start", gap: "10px", flexWrap: "wrap" }}>
          <Tooltip title="Edit">
            <Button color="primary" onClick={() => handleEdit(row)} size="small" variant="contained"  style={{ minWidth: "auto", padding: "6px 12px" }}>
              <AiOutlineEdit size={16}/>
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              color="error"
              onClick={() => {
                setDeleteTargetId(row.id);
                setDeleteDialog(true);
              }}
              style={{ minWidth: "auto", padding: "6px 12px" }}
              size="small"
              variant="contained"
            >
              <AiOutlineDelete size={16}/>
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = filteredCoupons.map((coupon, index) => ({
    id: coupon._id ?? index,
    name: coupon.name ?? "N/A",
    valueDisplay: coupon.value ? `${coupon.value}%` : "0%",
    value: coupon.value || "0",
    type: coupon.type === "Purchase" ? "Purchase" : "Delivery",
    validity: {
      start: coupon.validityStart,
      end: coupon.validityEnd,
    },
    status: coupon.status ?? "active",
    selectedProducts: coupon.selectedProducts ?? [],
    mainCategory: coupon.mainCategory,
    subCategory: coupon.subCategory,
    subSubCategory: coupon.subSubCategory,
  }));

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full p-4 md:p-8 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Coupons</h2>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Create Coupon
        </Button>
      </div>

      {/* Search Section */}
      <div className="mb-4">
        <SearchProducts
          searchQuery={searchQuery}
          handleSearchChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <ProductTable
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Update Coupon" : "Create Coupon"}</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
          <TextField
            label="Discount (%)"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Purchase">Purchase</MenuItem>
            <MenuItem value="Delivery">Delivery</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          {/* Dates */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm">Start Date</label>
              <DatePicker selected={validityStart} onChange={setValidityStart} className="w-full p-2 border rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm">End Date</label>
              <DatePicker selected={validityEnd} onChange={setValidityEnd} className="w-full p-2 border rounded" />
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-4">
            <label>Main Category</label>
            <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label>Sub Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!mainCategory}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              {subcategories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label>Sub-Sub Category</label>
            <select
              value={subSubCategory}
              onChange={(e) => setSubSubCategory(e.target.value)}
              disabled={!subCategory}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              {subSubcategories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label>Products</label>
            <select
              multiple
              value={selectedProducts}
              onChange={handleProductSelection}
              className="w-full p-2 border rounded"
            >
              {filteredProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </DialogContent>     
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this coupon?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllCoupons;
