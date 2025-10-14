// Third-party library imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCrosshair1 } from "react-icons/rx";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";

// Local imports (Redux slices and styles)
import { addUserAddress, deleteUserAddress } from "@/redux/slices/userSlice";
import { Table, Box, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, IconButton, DialogActions } from "@mui/material";


const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [addressType, setAddressType] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if we are on the client-side
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const addressTypeData = [{ name: "Home" }, { name: "Office" }];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || state === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      const addressData = {
        country,
        state,
        city,
        street,
        zipCode,
        addressType,
      };
      const result = await dispatch(addUserAddress(addressData));

      if (result.type === "user/addUserAddress/fulfilled") {
        toast.success(result.payload.message);
      } else if (result.type === "user/addUserAddress/rejected") {
        toast.error(result.payload);
      }
      setOpen(false);
      setCountry("");
      setState("");
      setCity("");
      setStreet("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = async (addressId) => {
    const result = await dispatch(deleteUserAddress(addressId));

    if (result.type === "user/deleteUserAddress/fulfilled") {
      toast.success(result.payload.message);
    } else if (result.type === "user/deleteUserAddress/rejected") {
      toast.error(result.payload);
    }
  };

  if (!isClient) {
    return (
      <div> <CircularProgress color="primary" /> </div>
    );
  }

  return (
    <Box className="w-full bg-gray-100 p-4 md:p-8 rounded-md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">My Addresses</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add New</Button>
      </Box>

      {/* Modal for Adding Address */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Add New Address
          <IconButton onClick={() => setOpen(false)} sx={{ float: "right" }}>
            <RxCrosshair1 />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              margin="normal"
            >
              {Country.getAllCountries().map((item) => (
                <MenuItem key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="State/Region"
              value={state}
              onChange={(e) => setState(e.target.value)}
              fullWidth
              margin="normal"
              disabled={!country}
            >
              {State.getStatesOfCountry(country).map((item) => (
                <MenuItem key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              margin="normal"
              disabled={!state}
            >
              {City.getCitiesOfState(country, state).map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Zip Code"
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              select
              label="Address Type"
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              fullWidth
              margin="normal"
            >
              {addressTypeData.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained">Add Address</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Address Table */}
      {userInfo?.addresses?.length > 0 ? (
        <Box mt={4}>
<TableContainer component={Paper}>
  <Table>
    <TableHead>
    <TableRow>
      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>Zip Code</TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
    </TableRow>
  </TableHead>

    <TableBody>
      {userInfo.addresses.map((item) => (
        <TableRow key={item._id}>
          <TableCell>
            <Typography fontWeight="bold">{item.addressType}</Typography>
            <Typography variant="body2">{item.street}</Typography>
            <Typography variant="body2">{item.city}, {item.country}</Typography>
          </TableCell>
          <TableCell>{item.zipCode}</TableCell>
          <TableCell>
            <IconButton onClick={() => handleDelete(item._id)}>
              <AiOutlineDelete color="red" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

        </Box>
      ) : (
        <Typography textAlign="center" mt={4}>
          You do not have any saved address!
        </Typography>
      )}
    </Box>
  );
};

export default Address;
