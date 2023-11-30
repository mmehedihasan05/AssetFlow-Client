import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Root from "./Root";
import Home from "./Home";
import ErrorPage from "./ErrorPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import AuthProvider from "./AuthProvider";
import Login from "./Pages/Login";
import Register_Employee from "./Pages/Register_Employee";
import Register_HR from "./Pages/Register_HR";
import AddAsset from "./Pages/HR/AddAsset";
import AllAsset from "./Pages/HR/AllAsset";
import PrivateRouteEmployee from "./Routes_Protect/PrivateRouteEmployee";
import PrivateRouteHR from "./Routes_Protect/PrivateRouteHR";
import AddEmployee from "./Pages/HR/AddEmployee";
import Payment from "./Pages/HR/Payment";
import PublicRouteProtect from "./Routes_Protect/PublicRouteProtect";
import MyEmployeeList from "./Pages/HR/MyEmployeeList";
import Profile from "./Pages/Profile";
import PrivateRouteCommon from "./Routes_Protect/PrivateRouteCommon";
import MyTeam from "./Pages/Employee/MyTeam";
import RequestForAsset from "./Pages/Employee/RequestForAsset";
import MyAssets from "./Pages/Employee/MyAssets";
import MakeCustomRequest from "./Pages/Employee/MakeCustomRequest";
import AllRequests from "./Pages/HR/AllRequests";
import CustomRequestList from "./Pages/HR/CustomRequestList";
import CheckOutForm from "./hooks/CheckoutForm";

const queryClient = new QueryClient();

/*
<PrivateRouteEmployee></PrivateRouteEmployee>
<PrivateRouteHR></PrivateRouteHR>
*/

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            // Employee Routes
            {
                path: "/my_team",
                element: (
                    <PrivateRouteEmployee>
                        <MyTeam />
                    </PrivateRouteEmployee>
                ),
            },
            {
                path: "/request_for_asset",
                element: (
                    <PrivateRouteEmployee>
                        <RequestForAsset />
                    </PrivateRouteEmployee>
                ),
            },
            {
                path: "/my_assets",
                element: (
                    <PrivateRouteEmployee>
                        <MyAssets />
                    </PrivateRouteEmployee>
                ),
            },
            {
                path: "/make_custom_request",
                element: (
                    <PrivateRouteEmployee>
                        <MakeCustomRequest />
                    </PrivateRouteEmployee>
                ),
            },
            // HR Routes
            {
                path: "/asset_list",
                element: (
                    <PrivateRouteHR>
                        <AllAsset />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/add_asset",
                element: (
                    <PrivateRouteHR>
                        <AddAsset />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/custom_requests_list",
                element: (
                    <PrivateRouteHR>
                        <CustomRequestList />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/all_requests",
                element: (
                    <PrivateRouteHR>
                        <AllRequests />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/my_employee_list",
                element: (
                    <PrivateRouteHR>
                        <MyEmployeeList />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/add_employee",
                element: (
                    <PrivateRouteHR>
                        <AddEmployee />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/payment",
                element: (
                    <PrivateRouteHR>
                        <Payment />
                    </PrivateRouteHR>
                ),
            },
            {
                path: "/final_payment",
                element: (
                    <PrivateRouteHR>
                        <CheckOutForm />
                    </PrivateRouteHR>
                ),
            },

            // Common Protected Routes only for HR and Employee
            {
                path: "/profile",
                element: (
                    <PrivateRouteCommon>
                        <Profile />
                    </PrivateRouteCommon>
                ),
            },

            // Login and Register Routes
            {
                path: "/register_employee",
                element: (
                    <PublicRouteProtect>
                        <Register_Employee />
                    </PublicRouteProtect>
                ),
            },
            {
                path: "/register_hr",
                element: (
                    <PublicRouteProtect>
                        <Register_HR />
                    </PublicRouteProtect>
                ),
            },
            {
                path: "/login",
                element: (
                    <PublicRouteProtect>
                        <Login />
                    </PublicRouteProtect>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                    <Toaster position="top-center" reverseOrder={false} />
                </AuthProvider>
            </HelmetProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
