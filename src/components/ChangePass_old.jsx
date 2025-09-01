import React, { useState } from "react";
import Modal from "../components/Modal";
import ChangePassForm from './ChangePassForm';
import { TextField, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../config/axios';
import Swal from 'sweetalert2';

export default function ChangePass() {
    const [isOpen, setIsOpen] = useState(false);
    const [forgotPassOpen, setForgotPassOpen] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [isLoading, setIsLoading] = useState(false); // เพิ่ม state สำหรับการโหลด

    const handleForgotPassword = () => {
        setIsLoading(true); // เริ่มการโหลด
        axios.post('/AssetAgreement/api/send-reset-email', { userCode })
            .then(() => {
                Swal.fire('Success', 'Email sent successfully.', 'success');
                setForgotPassOpen(false);
                setUserCode('');
            })
            .catch(error => {
                Swal.fire('Error', error.response?.data?.message || 'An error occurred.', 'error');
            })
            .finally(() => {
                setIsLoading(false); // สิ้นสุดการโหลด
            });
    };

    return (
        <>
            <div className='flex flex-col justify-center items-center mt-2 gap-3'>
                <div className="flex justify-center w-full">
                    <button className="bg-slate-400 mt-10 text-white rounded-md px-2 py-2 font-bold w-[200px] hover:bg-slate-600" onClick={() => setIsOpen(true)}>Change Password</button>
                    <Modal title="Change Password" open={isOpen} onClose={() => setIsOpen(false)}>
                        <ChangePassForm/>
                    </Modal>
                </div>
                <div>
                    {/* <button onClick={() => setForgotPassOpen(true)} className="text-sm text-blue-700 hover:text-blue-900">Forgot password</button> */}
                    <Modal title="Forgot Password" open={forgotPassOpen} onClose={() => setForgotPassOpen(false)}>
                        <div className="p-4">
                            <Typography variant="h6" component="h2" className="mb-4">
                              Forgot Password
                            </Typography>
                            <TextField
                              label="User Code"
                              fullWidth
                              value={userCode}
                              onChange={(e) => setUserCode(e.target.value)}
                              margin="normal"
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleForgotPassword}
                              className="mt-4"
                              disabled={isLoading} // ปิดการใช้งานปุ่มระหว่างโหลด
                              startIcon={isLoading && <CircularProgress size={24} />} // แสดงไอคอนโหลดเมื่อโหลด
                            >
                              {isLoading ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
}
