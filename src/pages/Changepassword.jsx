import Logo from '../assets/Logo.png';
import ChangepassForm from '../components/ChangePasswordForm';

export default function ChangePasswordPage() {
    return (
        <div className="flex flex-col justify-center items-center gap-2 h-screen w-full bg-gray-100 p-2">
            <div className="h-full flex flex-col gap-0 p-2">
                <div className="flex justify-center items-center">
                    <img src={Logo} alt="Logo" className="w-120 h-60 object-cover rounded-full" />
                </div>
                <div className="flex-col h-[500px] min-w-[400px] px-6 pt-8 bg-white rounded-lg shadow-[0_0_15px_rgb(0_0_0_/0.2)] border">
                    <h1 className="text-center font-bold text-4xl mb-9">เปลี่ยนรหัสผ่าน</h1>
                    <ChangepassForm />
                </div>
            </div>
        </div>
    );
}
