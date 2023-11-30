import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const MakePaymentRedirect = ({ children }) => {
    const { currentUserInfo } = useContext(AuthContext);

    if (currentUserInfo?.currentMemberShipLimit > 0) {
        return <div>{children}</div>;
    }
    // return navigate("/payment");
    // toast.error("Please make payment to continue!");

    let toastId;
    toast.remove(toastId);
    toastId = toast.error("Please make payment to continue!");

    return <Navigate to="/payment" />;
};

export default MakePaymentRedirect;
