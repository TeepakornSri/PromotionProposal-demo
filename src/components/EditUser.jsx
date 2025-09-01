import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Backdrop,
} from '@mui/material';

export default function Edituser({ user, onClose }) {
  const [formData, setFormData] = useState({
    usercode: user.usercode || '',
    nameEng: user.nameEng || '',
    nameThai: user.nameThai || '',
    Contact_Email: user.Contact_Email || '',
    role_code: user.role_code || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      // Log the data to be sent
      console.log("Data to be sent:", formData);

      const response = await axios.patch('/PromotionProposal/api/auth/edituser', formData);
      Swal.fire({
        icon: 'success',
        title: 'User Updated',
        text: response.data.message,
      }).then(() => {
        window.location.href = '/PromotionProposal/adduser';
      });
      setFormData({
        usercode: user.usercode || '',
        nameEng: user.nameEng || '',
        nameThai: user.nameThai || '',
        Contact_Email: user.Contact_Email || '',
        role_code: user.role_code || '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full h-screen flex flex-col pt-16 gap-12">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="justify-center items-center flex h-full">
        <div className="w-full h-full p-2">
          <CardHeader
            title="Edit User"
            titleTypographyProps={{ variant: 'h5', align: 'center' }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="User Code"
                name="usercode"
                value={formData.usercode}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Name (English)"
                name="nameEng"
                value={formData.nameEng}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Name (Thai)"
                name="nameThai"
                value={formData.nameThai}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Contact Email"
                name="Contact_Email"
                type="email"
                value={formData.Contact_Email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role Code</InputLabel>
                <Select
                  name="role_code"
                  value={formData.role_code}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="Approved_Step1">Approved_Step1</MenuItem>
                  <MenuItem value="Approved_Step2">Approved_Step2</MenuItem>
                  <MenuItem value="Approved_Step3">Approved_Step3</MenuItem>
                  <MenuItem value="Approved_Step4">Approved_Step4</MenuItem>
                  <MenuItem value="GM">GM</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Updating...' : 'Update User'}
              </Button>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
