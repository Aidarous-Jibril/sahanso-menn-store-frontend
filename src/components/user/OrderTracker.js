// Third-party library imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import { MdTrackChanges } from 'react-icons/md';
import Button from '@mui/material/Button';

// Local imports
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import ProductTable from '../common/ProductTable';
import { Tooltip } from '@mui/material';


const OrderTracker = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);


  const columns = [
    {
      field: 'id',
      headerName: 'ORDER ID',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <span>{`...${params.value.slice(-6)}`}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'STATUS',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;
        const statusTextColor = {
          processing: 'text-yellow-600',
          shipped: 'text-blue-600',
          delivered: 'text-green-600',
          cancelled: 'text-gray-600',
          refunded: 'text-green-600',
          'Processing refund': 'text-yellow-800',
          refund_approved: 'text-green-800',
          refund_rejected: 'text-red-600',
        };
        const textColor = statusTextColor[status] || 'text-gray-700';
  
        return (
          <span className={`capitalize font-medium ${textColor}`}>
            {status}
          </span>
        );
      },
    },
    {
      field: 'itemsQty',
      headerName: 'ITEMS QTY',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <span>{params.value}</span>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <span>${params.value}</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
          <Tooltip title="Track Order">
            <Link href={`/user/orders/track/${params.id}`} passHref>
              <Button
                variant="contained"
                color="info"
                size="small"
                style={{
                  padding: "6px 12px",
                  minWidth: "auto",
                  fontSize: "14px",
                }}
              >
                <MdTrackChanges size={16} />
              </Button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];
  const rows = orders.map((order) => ({
    id: order._id,
    itemsQty: order.cart?.length,
    total: `${order.totalPrice}$`,
    status: order.status,
  }));

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8 rounded-md">
           <div className="flex items-center mb-6">
              <h1 className="text-2xl font-semibold">Track an Order </h1>
           </div>
      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <ProductTable rows={rows} columns={columns} getRowId={(row) => row.id} />
      </div>
    </div>
  );
};

export default OrderTracker;
