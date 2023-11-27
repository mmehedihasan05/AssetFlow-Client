// Protecting register and login page from access when logged in.

import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { Link, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PublicRouteProtect = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);
    const location = useLocation();

    if (currentUserInfo?.userEmail) {
        return <Navigate to="/" />;
    }
    return <div>{children}</div>;
};

export default PublicRouteProtect;
