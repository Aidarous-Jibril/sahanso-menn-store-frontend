// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AiOutlineCamera } from 'react-icons/ai';

// Local imports (Redux slice and component)
import { updateVendorAvatar, updateVendorInformation } from '@/redux/slices/vendorSlice';
import Loader from './layout/Loader';
import ClientOnly from '../common/ClientOnly';
import Image from 'next/image';


const VendorSettings = () => {
  const { vendorInfo, isLoading } = useSelector((state) => state.vendors);
  console.log("vendorInfo", vendorInfo)
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  // Initialize local state from vendorInfo
  useEffect(() => {
    if (vendorInfo) {
      setAvatar(vendorInfo.avatar?.url || "");
      setName(vendorInfo.name || "");
      setDescription(vendorInfo.description || "");
      setAddress(vendorInfo.address || "");
      setPhoneNumber(vendorInfo.phoneNumber || "");
      setZipCode(vendorInfo.zipCode || "");
      setEmail(vendorInfo.email || "");
    }
  }, [vendorInfo]);


  if (isLoading) {
    return <Loader />;
  }


  const updateVendorHandler = async (e) => {
    e.preventDefault();
    const id = vendorInfo?._id;
  
    try {
      const result = await dispatch(updateVendorInformation({name, description, address, phoneNumber, zipCode, email, id}));
  
      if (result.type === "vendor/updateVendorInformation/fulfilled") {
        toast.success("Vendor information updated successfully!");
      } else {
        throw new Error(result.payload || "Error updating vendor information");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };
  

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }
  
    try {
        const result = await dispatch(updateVendorAvatar({ id: vendorInfo._id, avatar: file }));
    
        if (result.type === "vendor/updateVendorAvatar/fulfilled") {
          toast.success("Avatar updated successfully!");
        } else {
          throw new Error(result.payload || "Error updating avatar");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      }
  };
  
  const avatarSrc = avatar || "/images/store-backup.png";
  return (
    <ClientOnly>
      <div className="w-full h-full bg-gray-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 rounded-md flex flex-col">

      <div className="flex justify-center w-full mb-6">
        <div className="relative w-[150px] h-[150px] rounded-full border-[3px] border-[#3ad132] overflow-hidden">
          <Image
            src={avatarSrc}
            alt="Vendor Avatar"
            fill
            className="object-cover"
            sizes="150px"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTUwJyBoZWlnaHQ9JzE1MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCBmaWxsPSIjZWVlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+"
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
            <input type="file" id="image" className="hidden" onChange={handleImage} />
            <label htmlFor="image">
              <AiOutlineCamera className="text-[#3ad132]" />
            </label>
          </div>
        </div>
      </div>

        <form onSubmit={updateVendorHandler}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <label className="font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              className="border border-gray-300 rounded-md p-2"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-2">Zip Code</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col mb-6">
              <label className="font-semibold text-gray-700 mb-2">Email</label>
              <input
                  type="email"
                  className="border border-gray-300 rounded-md p-2"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
          </div>


          <button type="submit" className="w-full bg-[#3a24db] text-white py-2 rounded-md text-lg">
            Update Store Information
          </button>
        </form>

        <div className="bg-gray-100 p-4 rounded-md mt-8">
          <h3 className="font-semibold text-xl mb-4">Bank Information</h3>
          <p className="text-gray-700 mb-2">
            <strong>Account Holder:</strong> {vendorInfo?.vendorBankInfo?.accountHolderName || "N/A"}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Bank Name:</strong> {vendorInfo?.vendorBankInfo?.bankName || "N/A"}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Account Number:</strong> {vendorInfo?.vendorBankInfo?.bankAccountNumber || "N/A"}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>IBAN:</strong> {vendorInfo?.vendorBankInfo?.iban || "N/A"}
          </p>
        </div>
      </div>
    </ClientOnly>
  );
};

export default VendorSettings;
