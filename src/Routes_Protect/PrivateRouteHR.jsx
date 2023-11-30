import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PrivateRouteHR = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    // <Navigate to="/payment" replace={true} />;

    if (currentUserInfo?.userEmail && currentUserInfo?.userRole === "hr") {
        return <div>{children}</div>;
    }

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Login as HR to visit the page.");

    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRouteHR;
