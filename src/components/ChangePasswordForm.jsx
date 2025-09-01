import { toast } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordForm() {
    const navigate = useNavigate();
    // กำหนด initial state
    const [input, setInput] = useState({
        usercode: '',
        Contact_Email: ''
    });

    const validateInput = () => {
        if (!input.userId.trim()) {
            toast.error("กรุณากรอก User ID");
            return false;
        }
       
        if (!input.Contact_Email.trim()) {
            toast.error("กรุณากรอกอีเมล");
            return false;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.Contact_Email)) {
            toast.error("กรุณากรอกอีเมลให้ถูกต้อง");
            return false;
        }
        return true;
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        
        if (!validateInput()) {
            return;
        }

        // เพิ่ม console.log เพื่อแสดงข้อมูลที่จะส่ง
        const dataToSend = {
            usercode: input.userId,
            Contact_Email: input.Contact_Email,
            mobile:true
        };
        console.log('Data to be sent:', dataToSend);

        try {
            const response = await axios.post(
                '/PromotionProposal/api/auth/sendmailchangepassword/',
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: false, // ปิดการส่ง credentials
                    timeout: 10000, // timeout 10 วินาที
                }
            );
            if (response.status === 200) {
                console.log('API Response:', response.data); // เพิ่ม log response
                toast.success("ส่งคำขอรีเซ็ตรหัสผ่านสำเร็จ");
                navigate('/PromotionProposal/');
            }
        } catch (err) {
            console.error('API Error:', err.response || err); // เพิ่ม log error
            const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการส่งคำขอรีเซ็ตรหัสผ่าน";
            toast.error(errorMessage);
        }
    };

    // แสดงค่าที่กำลังพิมพ์เพื่อดีบัก
    const handleInputChange = (e, field) => {
        setInput(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <form onSubmit={handleSubmitForm} className="max-w-md mx-auto p-4">
            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="User ID"
                        value={input.userId}
                        onChange={(e) => handleInputChange(e, 'userId')}
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
    
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={input.Contact_Email}
                        onChange={(e) => handleInputChange(e, 'Contact_Email')}
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    รีเซ็ตรหัสผ่าน
                </button>
            </div>
        </form>
    );
}