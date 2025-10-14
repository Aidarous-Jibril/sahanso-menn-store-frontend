// Third-party imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { Box, Typography, Button, TextField, IconButton, Card, CardContent, Grid, Collapse} from "@mui/material";
import { toast } from "react-toastify";
import Image from "next/image";

// Local imports
import { addPaymentMethod, deletePaymentMethod } from "@/redux/slices/userSlice";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [isClient, setIsClient] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({ cardHolderName: "", cardNumber: "", expiryDate: "", cvv: "", });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleAddPaymentMethod = async () => {
    try {
      const result = await dispatch(addPaymentMethod(cardDetails));

      if (result.type === "user/addPaymentMethod/fulfilled") {
        toast.success(result.payload.message);
        setCardDetails({
          cardHolderName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        });
        setShowForm(false);
      } else {
        toast.error(result.payload);
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method. Please try again.");
    }
  };

  const handleDeletePaymentMethod = async () => {
    try {
      const result = await dispatch(deletePaymentMethod());

      if (result.type === "user/deletePaymentMethod/fulfilled") {
        toast.success(result.payload.message);
      } else {
        toast.error(result.payload);
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method. Please try again.");
    }
  };

  return (
    <Box className="bg-gray-100 p-4 md:p-8 rounded-md">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Payment Methods
        </Typography>
        <Button variant="contained" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New"}
        </Button>
      </Box>

      {/* Form for New Card */}
      <Collapse in={showForm}>
        <Box component="form" noValidate autoComplete="off" mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Card Holder Name"
                name="cardHolderName"
                value={cardDetails.cardHolderName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Card Number"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Expiry Date"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleAddPaymentMethod}>
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Saved Card */}
        {isClient && userInfo?.paymentMethod?.cardNumber && (
        <Card elevation={2}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
            }}
          >
            {/* Left: Card brand + holder name */}
            <Box display="flex" alignItems="center">
            <Image
                src="/images/visa.png"   
                alt="Visa"
                width={40}
                height={40}
                priority={false}        
                style={{ display: "block" }}
              />
              <Typography variant="body1" fontWeight="medium" ml={2}>
                {userInfo.paymentMethod.cardHolderName}
              </Typography>
            </Box>

            {/* Center: Card masked number and expiry */}
            <Box display="flex" alignItems="center" gap={4}>
              <Typography>
                **** **** **** {userInfo.paymentMethod.cardNumber.slice(-4)}
              </Typography>
              <Typography>{userInfo.paymentMethod.expiryDate}</Typography>
            </Box>

            {/* Right: Delete button */}
            <IconButton onClick={handleDeletePaymentMethod}>
              <AiOutlineDelete color="red" size={20} />
            </IconButton>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PaymentMethod;
