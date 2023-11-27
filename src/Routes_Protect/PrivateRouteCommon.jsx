import { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const PrivateRouteCommon = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);

    if (currentUserInfo?.userEmail) {
        return <div>{children}</div>;
    }

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Login to visit the page.");

    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRouteCommon;
