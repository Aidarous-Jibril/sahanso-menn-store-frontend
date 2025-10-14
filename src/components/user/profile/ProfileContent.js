// Third-party library imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-toastify";
import { Box, Button, Grid, TextField, Avatar, IconButton } from "@mui/material";
import { updateUserAvatar, updateUserInformation } from "@/redux/slices/userSlice";

const ProfileContent = () => {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber);
  const [password, setPassword] = useState("");

    useEffect(() => {
      setMounted(true);
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = userInfo._id;

    try {
      const result = await dispatch(
        updateUserInformation({
          name,
          email,
          phoneNumber: String(phoneNumber),
          password,
          id,
        })
      );

      if (result.type === "user/updateUserInformation/fulfilled") {
        toast.success("User information updated successfully!");
      } else {
        throw new Error(result.payload || "Error updating user information");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected.");

    const id = userInfo._id;
    try {
      const result = await dispatch(updateUserAvatar({ id, avatar: file }));
      if (result.type === "user/updateUserAvatar/fulfilled") {
        toast.success("Avatar updated successfully!");
      } else {
        throw new Error(result.payload || "Error updating avatar");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  if (!mounted) return null;

  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Box position="relative">
          <Avatar
            src={userInfo?.avatar?.url || ""}
            alt="Profile"
            sx={{ width: 150, height: 150, border: "3px solid #3ad132" }}
          />
          <label htmlFor="user-image">
            <input
              type="file"
              id="user-image"
              hidden
              onChange={handleImage}
            />
            <IconButton
              component="span"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "#E3E9EE",
              }}
            >
              <AiOutlineCamera style={{ color: "#3ad132" }} />
            </IconButton>
          </label>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              placeholder="Leave blank to keep the same password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProfileContent;