// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';

// Local imports
import { getUserAllOrders } from '@/redux/slices/orderSlice';
import Loader from '../vendor/layout/Loader';
import ProductTable from '../common/ProductTable';


const OrdersRefund = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  console.log("orders:", orders)
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true);

    if (!userInfo || !userInfo.email) {
      Router.push("/user/login"); 
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

 if (!isClient || !userInfo || !userInfo.email) {
    return <Loader />;
  }

  const eligibleRefunds = orders.filter((order) => order.status === 'refund_approved');

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const status = params.row.status;
    
        let color = 'text-gray-800';
        if (status === 'Processing refund') color = 'text-yellow-600';
        else if (status === 'refund_approved') color = 'text-green-600';
        else if (status === 'refund_rejected') color = 'text-red-600';
    
        const label = status
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()); 
    
        return <span className={`font-semibold ${color}`}>{label}</span>;
      },
    },
    { field: 'itemsQty', headerName: 'Items Qty', type: 'number', minWidth: 130, flex: 0.7 },
    { field: 'total', headerName: 'Total', type: 'number', minWidth: 130, flex: 0.8 },
    {
      field: 'action',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => (
        <Link href={`/user/orders/track/${params.id}`} legacyBehavior>
          <a className="inline-block px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            <AiOutlineArrowRight size={20} />
          </a>
        </Link>
      ),
    },
  ];

  const rows = eligibleRefunds.map((order) => ({
    id: order._id,
    itemsQty: order.items?.length || 0,
    total: `US$ ${order.totalPrice}`,
    total: `US$ ${order.totalPrice}`,
    status: order.status,
  }));

  return (
    <div className="w-full bg-gray-100 p-4 md:p-8 rounded-md">
      <div className="flex items-center mb-6">
      <i className="fas fa-tags text-2xl text-orange-500 mr-2"></i>
      <h1 className="text-2xl font-semibold">Refunded Order List</h1>
      <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
        {eligibleRefunds?.length || 0}
      </span>
    </div>
    {/* Data Table */}
    <div className="bg-white p-6 rounded-lg shadow mb-6">
        <ProductTable rows={rows} columns={columns} getRowId={(row) => row.id} />
      </div>
    </div>
  );
};

export default OrdersRefund;
