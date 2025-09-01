import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ChangepassForm_New() {
    const [input, setInput] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState({});
    const [valid, setValid] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const usercode = searchParams.get('usercode');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`/PromotionProposal/api/auth/verify-reset-token?token=${token}&usercode=${usercode}`);
                if (response.status === 200) {
                    setValid(true);
                }
            } catch (error) {
                alert('Invalid or expired link');
                navigate('/PromotionProposal/');
            }
        };

        if (token && usercode) {
            verifyToken();
        } else {
            navigate('/PromotionProposal/');
        }
    }, [token, usercode, navigate]);

    const validateInput = () => {
        const newError = {};

        if (!input.password) {
            newError.password = "ต้องการรหัสผ่าน";
        } else if (input.password.length < 8) {
            newError.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+{}[\]<>?\\|,./])[A-Za-z\d!@#$%^&*()\-_+{}[\]<>?\\|,./]{8,}$/;
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

    // const handleSubmitForm = e => {
    //     e.preventDefault();
    //     if (validateInput()) {
    //         // เพิ่ม console.log เพื่อตรวจสอบข้อมูลก่อนส่ง
    //         console.log("🔍 Data to be sent:", {
    //             password: input.password,
    //             usercode: usercode,
    //             token: token
    //         });
    
    //         axios.patch(`/PromotionProposal/api/auth/changepassword`, { 
    //             password: input.password, 
    //             usercode: usercode 
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`  // ส่ง token ผ่าน Header
    //             }
    //         })
    //         .then(() => {
    //             toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
    //             navigate('/PromotionProposal/homepage');
    //         })
    //         .catch(err => {
    //             console.error("❌ Error Response:", err.response);  // ดู error response
    //             const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน";
    //             toast.error(errorMessage);
    //         });
    //     } else {
    //         toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    //     }
    // };
    
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (validateInput()) {
            // ตรวจสอบข้อมูลก่อนส่ง
            console.log("🔍 Data to be sent to external API:", {
                userId: usercode,
                password: input.password,
                passwordRepeat: input.password,
                userIdSession: usercode
            });
    
            try {
                // ส่งข้อมูลไปที่ระบบ SSO ก่อน
                const externalResponse = await axios.patch(
                    `https://fnulogincontrolint.fngroup.com.sg/api/password/update`,
                    {
                        userId: usercode,
                        password: input.password,
                        passwordRepeat: input.password,
                        userIdSession: usercode,
                        appId:8
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                // ถ้าสำเร็จ (status 200) ทำการส่ง patch ต่อไป
                if (externalResponse.status === 200) {
                    console.log("✅ External API Response:", externalResponse.data);
    
                    // ส่ง patch ไปที่ระบบ PromotionProposal ต่อ
                    const internalResponse = await axios.patch(`/PromotionProposal/api/auth/changepassword`, {
                        password: input.password,
                        usercode: usercode
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`  // ส่ง token ผ่าน Header
                        }
                    });
    
                    if (internalResponse.status === 200) {
                        toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
                        navigate('/PromotionProposal/homepage');
                    } else {
                        toast.error("เกิดข้อผิดพลาดในการอัปเดตรหัสผ่านในระบบ PromotionProposal");
                    }
                } else {
                    toast.error("เกิดข้อผิดพลาดในการอัปเดตรหัสผ่านกับระบบ SSO");
                }
            } catch (err) {
                console.error("❌ Error Response from External API:", err.response);
                const errorMessage = err.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่านกับระบบ SSO";
                toast.error(errorMessage);
            }
        } else {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };
    

    return valid ? (
        <form onSubmit={handleSubmitForm} className="w-full h-screen p-4 flex justify-center items-center bg-yellow-100 flex-col">
            <h1 className='font-extrabold text-6xl p-4'>เปลี่ยนรหัสผ่าน</h1>
            <div className="space-y-4 h-1/2 flex justify-center flex-col w-2/3 border rounded-lg p-4 bg-slate-100 shadow-xl">
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
    ) : (
        <div className="w-full h-screen flex justify-center items-center">
            <p>กำลังตรวจสอบลิงก์...</p>
        </div>
    );
}
