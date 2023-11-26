import { Outlet } from "react-router-dom";
import { createContext, useContext } from "react";
import useAxiosSecure from "./hooks/useAxiosSecure";
import { AuthContext } from "./AuthProvider";
import NavBar from "./Pages/Navbar";
import Footer from "./Pages/Home/Footer";
import { Navigate } from "react-router-dom";

export const OtherContext = createContext();

const Root = () => {
    const axiosSecure = useAxiosSecure();
    const { currentUserInfo } = useContext(AuthContext);

    const functionalities = {};

    return (
        <div id="appRoot" className="">
            <OtherContext.Provider value={functionalities}>
                <div className="min-h-screen flex flex-col gap-y-8">
                    <div>
                        <NavBar></NavBar>
                    </div>
                    <div>
                        <Outlet></Outlet>
                    </div>
                    <div className="mt-auto">
                        <Footer></Footer>
                    </div>
                </div>
            </OtherContext.Provider>
        </div>
    );
};

export default Root;
