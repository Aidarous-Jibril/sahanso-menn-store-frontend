// Third-party library imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsFillBagFill } from 'react-icons/bs';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { toast } from 'react-toastify';

// Local imports
import { fetchMyOrder, refundOrderRequest, getUserAllOrders } from '@/redux/slices/orderSlice';
import styles from '@/styles/styles';



const OrderDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { singleOrder, successMessage, error } = useSelector(state => state.orders);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    if (id) dispatch(fetchMyOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) toast.error(error);
    dispatch({ type: 'clearMessages' });
    dispatch({ type: 'clearErrors' });
  }, [dispatch, successMessage, error]);

  const refundHandler = async () => {
    try {
      const result = await dispatch(refundOrderRequest({ orderId: id, status: "Processing refund" }));
  
      if (result.type === "orders/refundOrderRequest/fulfilled") {
        toast.success(result.payload.message);
        // Fetch updated orders only if the refund was successful
        dispatch(getUserAllOrders(userInfo?._id));
      } else {
        throw new Error(result.payload || "Refund request failed.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className={`${styles.section} py-6 min-h-screen bg-gray-100`}> 
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow rounded-lg mb-6">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="ml-2 text-2xl font-semibold">Order Details</h1>
        </div>
        <Link href="/user/orders" className="flex items-center bg-[#fce1e6] rounded-md text-[#e94560] px-4 py-2">
          <IoIosArrowRoundBack size={30} color="crimson" />
          <span className="ml-2 font-medium">Back</span>
        </Link>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 shadow rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Order #{singleOrder?._id?.slice(0, 8)}</h2>
        <p className="text-gray-600">Order Date: {singleOrder?.createdAt?.slice(0, 10)}</p>
        <p className="text-gray-600">Status: <span className="text-green-500">{singleOrder?.status}</span></p>
        <p className="text-gray-600">Payment Method: {singleOrder?.paymentInfo?.method}</p>
        <p className="text-gray-600">Total Price: <span className="font-semibold">${singleOrder?.totalPrice}</span></p>
      </div>

      {/* Customer's Cart */}
      <div className="mt-6 bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Customer’s Cart</h2>
        {singleOrder?.items?.map((item) => (
          <div key={item._id} className="flex justify-between items-center py-3 border-b last:border-none">
            <p className="text-gray-800">{item.name}</p>
            <p className="text-gray-500">Qty: {item.quantity}</p>
            <p className="font-medium">${item.price}</p>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="mt-6 bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <p className="text-gray-600">{singleOrder?.shippingAddress?.fullName}</p>
        <p className="text-gray-600">{singleOrder?.shippingAddress?.address}, {singleOrder?.shippingAddress?.city}</p>
        <p className="text-gray-600">{singleOrder?.shippingAddress?.country}, {singleOrder?.shippingAddress?.postalCode}</p>
      </div>

      {/* Refund Button */}
      <div className="mt-6 flex justify-end">
        <button 
          onClick={refundHandler} 
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
          Request Refund
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
