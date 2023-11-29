import { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
const PrivateRouteEmployee = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);

    if (
        currentUserInfo?.userEmail &&
        currentUserInfo?.userRole === "employee" &&
        !currentUserInfo?.currentWorkingCompanyEmail
    ) {
        return (
            <div className="text-center text-4xl font-semibold text-red-500 flex items-center justify-center h-[50vh]">
                <span className="text-6xl pr-2">
                    <ErrorOutlineIcon fontSize="inherit"></ErrorOutlineIcon>
                </span>
                <span>
                    You are not in a team. <br /> Contact with our HR!
                </span>
            </div>
        );
    }

    if (currentUserInfo?.userEmail && currentUserInfo?.userRole === "employee") {
        return <div>{children}</div>;
    }

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Login as Employee to visit the page.");

    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRouteEmployee;
