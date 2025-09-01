import { useAuth } from "../../hooks/use-auth";
import { toast } from 'react-toastify';
import { useState } from "react";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import InputErrorMessage from '../../features/InputErrorMessage';
import { useNavigate } from "react-router-dom"; 
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginForm() {
    const [input, setInput] = useState({
        usercode: '',
        password: ''
    });
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate(); 

    const validateInput = () => {
        const newError = {};

        if (!input.usercode) {
            newError.usercode = "กรุณาใส่ User Code";
        }
        if (!input.password) {
            newError.password = "ต้องการรหัสผ่าน";
        }
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (validateInput()) {
            setLoading(true);
            try {
                const { accessToken, user } = await login(input);
                if (user.first_add === 'YES') { 
                    navigate('/PromotionProposal/Changepass');
                } else {
                    navigate('/home');
                }
            } catch (err) {
                toast.error(err.message || 'An error occurred during login');
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    return (
        <form onSubmit={handleSubmitForm}>
            <div className="grid gap-10 items-center justify-centerw-full h-full max-w-md mx-auto p-4">
                <div className="w-full">
                    <LoginInput
                        type="text"
                        placeholder="User Code"
                        value={input.usercode}
                        onChange={e => setInput({ ...input, usercode: e.target.value })}
                        hasError={error.usercode}
                    />
                    {error.usercode && <InputErrorMessage message={error.usercode} />}
                </div>
                <div className="w-full">
                    <LoginInput
                        type="password"
                        placeholder="Password"
                        value={input.password}
                        onChange={e => setInput({ ...input, password: e.target.value })}
                        hasError={error.password}
                    />
                    {error.password && <InputErrorMessage message={error.password} />}
                </div>
                <LoginButton />
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </form>
    );
}