import { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const PrivateRouteEmployee = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);

    if (currentUserInfo?.userEmail && currentUserInfo?.userRole === "employee") {
        return <div>{children}</div>;
    }

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Login as Employee to visit the page.");

    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRouteEmployee;
