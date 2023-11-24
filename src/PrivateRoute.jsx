import { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();

    if (currentUser?.email) {
        return <div>{children}</div>;
    }

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Login to visit the page.");

    // toastId toast.error("Login to visit the page.");

    // navigate("/login");
    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRoute;
