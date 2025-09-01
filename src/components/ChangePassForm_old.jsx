import { toast } from 'react-toastify';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function ChangepassForm() {
    const [input, setInput] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const validateInput = () => {
        const newError = {};

        if (!input.password) {
            newError.password = "ต้องการรหัสผ่าน";
        } else if (input.password.length < 8) {
            newError.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]<>?\\|,./])[A-Za-z\d!@#$%^&*()_+{}\[\]<>?\\|,./]{8,}$/;
            if (!passwordRegex.test(input.password)) {
                newError.password = "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษอย่างน้อยหนึ่งตัว";
            }
        }

        if (input.password !== input.confirmPassword) {
            newError.confirmPassword = "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน";
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleSubmitForm = e => {
        e.preventDefault();
        if (validateInput()) {
            axios.patch('/PromotionProposal/api/auth/changepassword', { password: input.password })
                .then(() => {
                    toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
                    navigate('/PromotionProposal/homepage');
                })
                .catch(err => {
                    const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";
                    toast.error(errorMessage);
                });
        } else {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    return (
        <form onSubmit={handleSubmitForm} className="max-w-md mx-auto p-4">
            <div className="space-y-4">
                <div>
                    <input
                        type="password"
                        placeholder="รหัสผ่านใหม่"
                        value={input.password}
                        onChange={e => setInput({ ...input, password: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md ${error.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        value={input.confirmPassword}
                        onChange={e => setInput({ ...input, confirmPassword: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md ${error.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    เปลี่ยนรหัสผ่าน
                </button>
            </div>
        </form>
    );
}