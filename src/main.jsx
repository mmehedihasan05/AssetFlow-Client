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

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", loader: () => fetch("/servicesData.json"), element: <Home /> },
            { path: "", loader: () => fetch(""), element: "" },
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
