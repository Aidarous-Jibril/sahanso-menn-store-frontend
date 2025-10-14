// Third-party library imports
import React, { useEffect, useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Local imports (Redux slices)
import { createVendorBankInfo, getVendorInfo, updateVendorBankInfo } from "@/redux/slices/vendorSlice";


const VendorBankInfo = () => {
  const dispatch = useDispatch();
  const { vendorInfo, isLoading } = useSelector((state) => state.vendors);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    bankName: "",
    bankAccountNumber: "",
    iban: "",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (vendorInfo?.vendorBankInfo) {
      setBankDetails({
        accountHolderName: vendorInfo.vendorBankInfo.accountHolderName || "",
        bankName: vendorInfo.vendorBankInfo.bankName || "",
        bankAccountNumber: vendorInfo.vendorBankInfo.bankAccountNumber || "",
        iban: vendorInfo.vendorBankInfo.iban || "",
      });
    }
    setIsDataLoaded(true);
  }, [vendorInfo]);

  const handleChange = (e) => {
    setBankDetails({
      ...bankDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (vendorInfo?.vendorBankInfo) {
      result = await dispatch(updateVendorBankInfo({ bankDetails, vendorId: vendorInfo._id }));
    } else {
      result = await dispatch(createVendorBankInfo({ bankDetails, vendorId: vendorInfo._id }));
    }
    if (result.type === "vendors/updateVendorBankInfo/fulfilled" || result.type === "vendors/createVendorBankInfo/fulfilled") {
      toast.success("Bank information updated successfully!");
    } else {
      toast.error("Failed to update bank information.");
    }
    setBankDetails({
      accountHolderName: "",
      bankName: "",
      bankAccountNumber: "",
      iban: "",
    });
    await dispatch(getVendorInfo(vendorInfo._id));  // Ensure you pass the correct vendor ID
    window.location.reload();
  };

  
  if (!isDataLoaded) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {vendorInfo?.vendorBankInfo ? "Update Bank Information" : "Create Bank Information"}
      </h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Holder Name"
              variant="outlined"
              fullWidth
              name="accountHolderName"
              value={bankDetails.accountHolderName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bank Name"
              variant="outlined"
              fullWidth
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Number"
              variant="outlined"
              fullWidth
              name="bankAccountNumber"
              value={bankDetails.bankAccountNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Iban Number"
              variant="outlined"
              fullWidth
              name="iban"
              value={bankDetails.iban}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? "Processing..." : vendorInfo?.vendorBankInfo ? "Update Bank Info" : "Create Bank Info"}
        </Button>
      </form>
    </div>
  );
};

export default VendorBankInfo;
