import { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const PrivateRouteEmployee = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);
    const location = useLocation();

    // if (currentUserInfo?.userEmail) {
    //     return <div>{children}</div>;
    // }

    if (currentUserInfo?.userEmail && location?.state) {
        return <Navigate to={location.state} />;
    } else if (currentUserInfo?.userEmail && !location?.state) {
        return <Navigate to="/" />;
    }

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Login to visit the page.");

    // toastId toast.error("Login to visit the page.");

    // navigate("/login");
    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRouteEmployee;
