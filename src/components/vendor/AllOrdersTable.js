import React, { useEffect, useState } from "react";

// Third-party library imports
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem, Select, FormControl, Modal, Box, Typography, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

// Local imports
import { updateOrderStatus, fetchVendorOrders, fetchSingleOrder, deleteOrder } from "../../redux/slices/orderSlice";
import Loader from "./layout/Loader";
import SearchProducts from "../common/SearchProducts";
import ProductTable from "../common/ProductTable";

//for order details modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AllOrdersTable = () => {
  const dispatch = useDispatch();

  const { orders, isLoading, singleOrder } = useSelector(
    (state) => state.orders
  );
  const { vendorInfo } = useSelector((state) => state.vendors);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleStatusChange = async (orderId, status) => {
    try {
      const result = await dispatch(
        updateOrderStatus({ orderId, status, vendorId: vendorInfo?._id })
      );

      if (result.type === "orders/updateOrderStatus/fulfilled") {
        toast.success(result.payload?.message);
        dispatch(fetchVendorOrders(vendorInfo._id));
      } else {
        toast.error(result.payload?.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status.");
    }
  };

  const handleDeleteConfirmation = (orderId) => {
    setSelectedUser(orderId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const result = await dispatch(
        deleteOrder({ orderId: selectedUser, vendorId: vendorInfo?._id })
      );
      if (result.type === "orders/deleteOrder/fulfilled") {
        toast.success("Order deleted!");
      } else {
        toast.error("Failed to delete order.");
      }
      setOpenDeleteDialog(false); 
    } catch (error) {
      toast.error("An error occurred while deleting the order.");
    }
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      filtered = filtered.filter((order) => {
        const customerName = order?.shippingAddress?.fullName?.toLowerCase();
        const orderId = order?._id?.toLowerCase();
        const status = order?.status?.toLowerCase();

        return (
          customerName?.includes(lowerCaseQuery) ||
          orderId?.includes(lowerCaseQuery) ||
          status?.includes(lowerCaseQuery)
        );
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(fetchVendorOrders(vendorInfo._id));
    }
  }, [dispatch, vendorInfo]);

  const handlePreviewClick = (orderId) => {
    dispatch(fetchSingleOrder(orderId));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close modal
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 1 },
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => `$${params.row.totalAmount}`,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => (
        <FormControl fullWidth>
          {/* <InputLabel>Status</InputLabel> */}
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
          >
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="Processing refund">Processing refund</MenuItem>
            <MenuItem value="refund_approved">Refund Approved</MenuItem>
            <MenuItem value="refund_rejected">Refund Rejected</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "preview",
      headerName: "Preview",
      minWidth: 150,
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePreviewClick(params.row.id)}
        >
          <AiOutlineEye size={16} />
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 150,
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteConfirmation(params.row.id)}
        >
          <AiOutlineDelete size={16} />
        </Button>
      ),
    },
  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress.fullName,
    totalAmount: order.totalPrice,
    status: order.status,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-gray-100 p-4 md:p-8 rounded-md">
          <div className="flex items-center mb-6">
            <i className="fas fa-box-open text-2xl text-orange-500 mr-2"></i>
            <h1 className="text-2xl font-semibold">Orders List</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {orders?.length || 0}
            </span>
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
          </div>

          {/* Table */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} />
          </div>
        </div>
      )}
      {/* Order detals modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="order-modal-title"
        maxWidth="lg"
        fullWidth
      >
        {/* Order Details Modal */}
        <Box sx={style}>
          {/* Modal Header */}
          <Typography
            id="order-modal-title"
            variant="h5"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            mb={3}
          >
            Order Details
          </Typography>
          <Divider />

          {/* Order Details */}
          <Box mt={3}>
            <Grid container spacing={3}>
              {/* General Information */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    General Information
                  </Typography>
                  <Typography>
                    <strong>Order ID:</strong> {singleOrder?._id}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {singleOrder?.status}
                  </Typography>
                  <Typography>
                    <strong>Total Price:</strong> ${singleOrder?.totalPrice}
                  </Typography>
                  <Typography>
                    <strong>Created At:</strong>{" "}
                    {new Date(singleOrder?.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>

              {/* Shipping Address */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Shipping Address
                  </Typography>
                  <Typography>
                    <strong>Name:</strong>{" "}
                    {singleOrder?.shippingAddress.fullName}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong>{" "}
                    {singleOrder?.shippingAddress.address}
                  </Typography>
                  <Typography>
                    <strong>City:</strong> {singleOrder?.shippingAddress.city}
                  </Typography>
                  <Typography>
                    <strong>Postal Code:</strong>{" "}
                    {singleOrder?.shippingAddress.postalCode}
                  </Typography>
                  <Typography>
                    <strong>Country:</strong>{" "}
                    {singleOrder?.shippingAddress.country}
                  </Typography>
                </Box>
              </Grid>

              {/* Order Items */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Order Items
                  </Typography>
                  {singleOrder?.items.map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                      sx={{
                        borderBottom: "1px solid #eee",
                        pb: 1,
                        "&:last-child": {
                          borderBottom: "none",
                          mb: 0,
                          pb: 0,
                        },
                      }}
                    >
                      <Typography>
                        <strong>{item.name}</strong> (x{item.quantity})
                      </Typography>
                      <Typography>${item.price}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Payment Information */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Payment Information
                  </Typography>
                  <Typography>
                    <strong>Transaction ID:</strong>{" "}
                    {singleOrder?.paymentInfo.transactionId}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {singleOrder?.paymentInfo.status}
                  </Typography>
                  <Typography>
                    <strong>Method:</strong> {singleOrder?.paymentInfo.method}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Modal Footer */}
          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this order?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllOrdersTable;
