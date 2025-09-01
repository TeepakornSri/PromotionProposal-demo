import { useAuth } from "../hooks/use-auth";
import { Navigate } from 'react-router-dom';

export default function RedirectIfAuthenticated({ children }) {
    const { authUser } = useAuth();

    if (authUser) {
        if (authUser.first_add === 'YES') {
            return <Navigate to='/PromotionProposal/Changepass' />;
        } else if (authUser.usercode) {
            return <Navigate to='/PromotionProposal/homepage' />;
        } else {
            return <Navigate to="/PromotionProposal/" />;
        }
    }

    return children;
}
