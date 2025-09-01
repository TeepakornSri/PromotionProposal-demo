import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from '../pages/Loginpage';
import Homepage from '../pages/Homepage';
import PromotionPage from '../pages/PromotionPage';
import ChangePasswordPage from '../pages/Changepassword';
import MainLayout from '../pages/MainLayout';
import RedirectIfAuthenticated from '../features/RedireactIfAuthenticated';
import AuthenticatedUser from '../features/AuthenticateUser'; 
import Check from '../pages/check';
import ViewDetail from '../pages/ViewDetail'
import { useNavigate } from 'react-router-dom';
import EditDetail from '../pages/PromotionInputEdit';
import ApproveReject from '../components/Approve';
import PrintPage from '../pages/PrintPage';
import PrintViewDetail from '../pages/PrintViewDetail';
import TableComponent from '../components/TableComponent';
import AddProduct from '../pages/AddProduct';
import Adduser from '../pages/Adduser';
import ChangepassForm_New from '../components/ChangePassForm_New';


// ฟังก์ชันสำหรับ Redirect ไปที่ /PromotionProposal
function RedirectToPromotionProposal() {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/PromotionProposal/');
    }, [navigate]);

    return null;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <RedirectToPromotionProposal />
    },
    {
        path: '/PromotionProposal/healthcheck',
        element: <Check/>
    },
    {
        path: '/PromotionProposal',
        element: (
            <RedirectIfAuthenticated>
                <LoginPage />
            </RedirectIfAuthenticated>
        ),
    },
    {
        path: '/PromotionProposal/PrintPage',
        element: (
            <AuthenticatedUser>
                <PrintViewDetail />
                </AuthenticatedUser>
        ),
    },
    {
        path: '/PromotionProposal/changepassword',
        element: (
            
                <ChangepassForm_New />
        ),
    },
    {
        path: '/PromotionProposal',
        element: (
            <AuthenticatedUser>
                <MainLayout />
            </AuthenticatedUser>
        ),
        children: [
            { path: 'homepage', element: <Homepage /> },
            { path: 'PromotionPage', element: <PromotionPage /> },
            { path: 'edit/:documentNumber', element: <EditDetail /> },
            { path: 'Changepass', element: <ChangePasswordPage /> },
            { path: 'viewdetail/:documentNumber', element: <ViewDetail /> },          
            { path: 'AddProduct', element: <AddProduct /> },          
            { path: 'Adduser', element: <Adduser /> },          
        ],
    },
    {
        path: '*', 
        element: <RedirectToPromotionProposal />, 
    },
    {
        // ลบ usercode ออกจากพารามิเตอร์
        path: '/PromotionProposal/approve/:promotionId/:action', 
        element:(
            <AuthenticatedUser>
                <ApproveReject />,
                </AuthenticatedUser>
            )
        
        
    },
]);

export default function Routes() {
    return <RouterProvider router={router} />;
}
