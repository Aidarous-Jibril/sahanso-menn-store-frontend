import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleOrder, fetchVendorRefundedOrders } from "@/redux/slices/orderSlice";
import Loader from "./layout/Loader";
import SearchProducts from "../common/SearchProducts";
import ProductTable from "../common/ProductTable";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";

const AllRefundsPage = () => {
  const dispatch = useDispatch();
  const { vendorInfo } = useSelector((state) => state.vendors);
  const { orders, singleOrder, isLoading } = useSelector((state) => state.orders);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);


  useEffect(() => {
    if (vendorInfo?._id) {
      dispatch(fetchVendorRefundedOrders(vendorInfo._id));
    }
  }, [dispatch, vendorInfo]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = orders.filter((order) =>
        order._id.toLowerCase().includes(lower) ||
        order.shippingAddress?.fullName?.toLowerCase().includes(lower)
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchQuery]);

  const columns = [
    { field: "id", headerName: "Order ID", flex: 1 },
    {
      field: "customerName",
      headerName: "Customer",
      flex: 1.5,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => `$${params.row.total}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => {
        const status = row.status;
    
        let color = "default";
        if (status === "refund_approved") color = "success";
        else if (status === "refund_rejected") color = "error";
    
        const label = status
          .replace(/_/g, " ") // convert snake_case to sentence
          .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize each word
    
        return <Chip label={label} color={color} variant="outlined" />;
      },
    },    
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Tooltip title="View Refund">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              dispatch(fetchSingleOrder(row.id));
              setOpenModal(true);
            }}
            style={{ minWidth: "auto", padding: "6px 12px" }}
          >
            <AiOutlineEye size={18} />
          </Button>
        </Tooltip>
      ),
    }
  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress.fullName,
    total: order.totalPrice,
    status: order.status,
  }));

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full p-4 md:p-8">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Refunded Orders
      </Typography>

      <div className="bg-white p-4 rounded shadow mb-6">
        <SearchProducts
          searchQuery={searchQuery}
          handleSearchChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <ProductTable rows={rows} columns={columns} />
      </div>

    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
      <DialogTitle>Refund Order Details</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Typography><strong>Order ID:</strong> {singleOrder?._id}</Typography>
            <Box display="flex" gap={1} mt={1}>
              <Typography><strong>Status:</strong></Typography>
              <Typography
                fontWeight="bold"
                color={
                  singleOrder?.status === "refund_approved"
                    ? "green"
                    : singleOrder?.status === "refund_rejected"
                    ? "red"
                    : "textPrimary"
                }
              >
                {singleOrder?.status
                  ?.replace(/_/g, " ")
                  ?.replace(/\b\w/g, (char) => char.toUpperCase())}
              </Typography>
            </Box>
            <Typography><strong>Total Price:</strong> ${singleOrder?.totalPrice}</Typography>
            <Typography><strong>Created At:</strong> {new Date(singleOrder?.createdAt).toLocaleString()}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <Typography>{singleOrder?.shippingAddress?.fullName}</Typography>
            <Typography>{singleOrder?.shippingAddress?.address}</Typography>
            <Typography>{singleOrder?.shippingAddress?.city}, {singleOrder?.shippingAddress?.postalCode}</Typography>
            <Typography>{singleOrder?.shippingAddress?.country}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Order Items</Typography>
            {singleOrder?.items.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between">
                <Typography>{item.name} (x{item.quantity})</Typography>
                <Typography>${item.price}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Payment Info</Typography>
            <Typography><strong>Transaction ID:</strong> {singleOrder?.paymentInfo?.transactionId}</Typography>
            <Typography><strong>Status:</strong> {singleOrder?.paymentInfo?.status}</Typography>
            <Typography><strong>Method:</strong> {singleOrder?.paymentInfo?.method}</Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default AllRefundsPage;
