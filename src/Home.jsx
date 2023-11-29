import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Employee_Home from "./Pages/Employee/Employee_Home";
import About from "./Pages/Home/About";
import Banner from "./Pages/Home/Banner";
import Packages from "./Pages/Home/Packages";
import HR_Home from "./Pages/HR/HR_Home";
import PrivateRouteEmployee from "./Routes_Protect/PrivateRouteEmployee";
import PrivateRouteHR from "./Routes_Protect/PrivateRouteHR";
import { Helmet } from "react-helmet-async";
const Home = () => {
    const { currentUserInfo } = useContext(AuthContext);

    return (
        <div className="space-y-8 custom-width">
            {currentUserInfo.userRole === "employee" ? (
                <PrivateRouteEmployee>
                    <Employee_Home />
                </PrivateRouteEmployee>
            ) : currentUserInfo.userRole === "hr" ? (
                <PrivateRouteHR>
                    <HR_Home />
                </PrivateRouteHR>
            ) : (
                <>
                    <Banner></Banner>
                    <About></About>
                    <Packages></Packages>
                </>
            )}

            <Helmet>
                <title>Home</title>
            </Helmet>
        </div>
    );
};

export default Home;
