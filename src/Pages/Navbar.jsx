/* eslint-disable react/no-unknown-property */
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { GrLogout } from "react-icons/gr";
import "../CssStyles/Navbar.css";

const NavBar = () => {
    let { logout, currentUser } = useContext(AuthContext);
    const [navItem_dropdownShow, setNavItem_dropdownShow] = useState(false);
    const [profileItem_dropdownShow, setProfileItem_dropdownShow] = useState(false);

    const handleNavItemDropdown = () => {
        setNavItem_dropdownShow(!navItem_dropdownShow);
    };

    const handleProfileDropdown = () => {
        setProfileItem_dropdownShow(!profileItem_dropdownShow);
    };

    const routes_noUser = [
        { path: "/", name: "Home" },
        { path: "/register_employee", name: "Join as Employee" },
        { path: "/register_hr", name: "Join as HR" },
        { path: "/login", name: "Login" },
    ];
    const routes_employee = [
        { path: "/", name: "Home" },
        { path: "/my_assets", name: "My Assets" },
        { path: "/my_team", name: "My Team" },
        { path: "/request_for_asset", name: "Request for an Asset" },
        { path: "/make_custom_request", name: "Make a Custom Request" },
    ];
    const routes_hr = [
        { path: "/", name: "Home" },
        { path: "/asset_list", name: "Asset List" },
        { path: "/add_asset", name: "Add an Asset" },
        { path: "/all_requests", name: "All Requests" },
        { path: "/custom_requests_list", name: "Custom Requests List" },
        { path: "/my_employee_list", name: "My Employee List" },
        { path: "/add_employee", name: "Add an Employee" },
    ];

    let currentNav =
        currentUser?.role === "employee"
            ? routes_employee
            : currentUser?.role === "hr"
            ? routes_hr
            : routes_noUser;

    const handleLogout = () => {
        logout()
            .then((response) => {})
            .catch((error) => {});

        toast.promise(logout(), {
            loading: "Logging out...",
            success: <b>Logged out successfully!</b>,
            error: <b>Unable to log out</b>,
        });
    };

    // currentNav = routes_employee;
    // currentNav = routes_hr;

    return (
        <div id="navbar" className="bg-white shadow-md ">
            <div
                className="title rounded-sm
        flex items-center justify-between flex-row lg:flex-col
        py-4 px-2 space-y-2
        custom-width relative"
            >
                {/* Main Logo + Menu open close */}
                <div className="flex items-center flex-1 lg:flex-auto">
                    {/* Icon: For Mobile and Tab */}
                    <div className=" text-3xl block lg:hidden cursor-pointer">
                        <div onClick={handleNavItemDropdown} className="">
                            {navItem_dropdownShow ? (
                                <RxCross1></RxCross1>
                            ) : (
                                <HiOutlineMenuAlt1></HiOutlineMenuAlt1>
                            )}
                        </div>
                    </div>

                    {/* Brand Logo */}
                    <div className="mx-auto lg:mx-0">
                        <NavLink to="/">
                            <img className="w-[220px]" src="/Logo-bg-blue.png" alt="" />
                        </NavLink>
                    </div>

                    {/* profile informations */}
                    <div className="block lg:hidden">
                        <div onClick={handleProfileDropdown} className="">
                            <img
                                src={currentUser?.photoURL || "/no_user.png"}
                                className="h-[24px] w-[24px] md:h-[36px] md:w-[36px] rounded-full 
                                outline outline-1  outline-offset-1
                                cursor-pointer"
                                title={currentUser?.displayName}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Items + Profile Informations
                    For Large device */}
                <div
                    className={
                        currentUser
                            ? `hidden lg:flex items-center justify-between w-full`
                            : `hidden lg:flex items-center justify-center w-full`
                    }
                >
                    {/* Menu Items */}
                    <div>
                        <ul className="flex px-1 gap-x-6 gap-y-2 font-semibold">
                            {currentNav.map((route, idx) => (
                                <li key={idx}>
                                    <NavLink
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? ` text-[--text-primary] border-b-2 border-[--text-primary]`
                                                : ` hover:text-[--text-primary]`
                                        }
                                        to={route.path}
                                    >
                                        {route.name}
                                    </NavLink>
                                </li>
                            ))}

                            {/* TODO: Just logout thakbe and employee hole image o thakbe. */}
                            {currentUser?.email && (
                                <div className="flex gap-2 justify-center items-center">
                                    <div onClick={handleProfileDropdown} className=" hidden">
                                        <img
                                            src={currentUser?.photoURL || "/no_user.png"}
                                            className="h-[24px] w-[24px] md:h-[36px] md:w-[36px] rounded-full 
                                outline outline-1  outline-offset-1
                                cursor-pointer"
                                            title={currentUser?.displayName}
                                        />
                                    </div>

                                    <button
                                        className="_btn  font-semibold hover:text-[--text-primary] hidden"
                                        onClick={handleLogout}
                                        title="Logout"
                                    >
                                        <GrLogout></GrLogout>
                                    </button>
                                </div>
                            )}
                        </ul>
                    </div>

                    {/* Profile Informations */}
                    {currentUser && (
                        <div>
                            <div onClick={handleProfileDropdown} className="">
                                <img
                                    src={currentUser?.photoURL || "/no_user.png"}
                                    className="h-[24px] w-[24px] md:h-[36px] md:w-[36px] rounded-full 
                                outline outline-1  outline-offset-1
                                cursor-pointer"
                                    title={currentUser?.displayName}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Dropdown Main Items 
                    For Mobile and Tab */}
                <div
                    className={
                        navItem_dropdownShow
                            ? `dropdown dropdown_menuItems show
                            block lg:hidden bg-white shadow-lg rounded-sm z-10`
                            : `dropdown dropdown_menuItems hide
                            block lg:hidden bg-white shadow-lg rounded-sm z-10`
                    }
                >
                    {/* up arrow */}
                    <div className="arrowOnNav"></div>

                    {/* Dropdown Menu Data */}
                    <ul className="flex flex-col px-6 py-4 gap-6 justify-center font-semibold">
                        {currentNav.map((route, idx) => (
                            <li key={idx}>
                                <NavLink
                                    className={({ isActive, isPending }) =>
                                        isActive
                                            ? ` text-[--text-highlight] border-b-2 border-[--text-highlight]`
                                            : ` hover:text-[--text-highlight]`
                                    }
                                    to={route.path}
                                    onClick={handleNavItemDropdown}
                                >
                                    {route.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Dropdown User Info and Dashboard
                    For Mobile and Tab 
                    profileItem_dropdownShow && currentUser => eta na dile logout er poreo dropdown theke jay
                    */}
                <div
                    className={
                        profileItem_dropdownShow && currentUser
                            ? `dropdown dropdown_profileItems show
                            bg-white shadow-lg rounded-sm z-10`
                            : `dropdown dropdown_profileItems hide
                            bg-white shadow-lg rounded-sm z-10`
                    }
                >
                    {/* up arrow */}
                    <div className="arrowOnNav"></div>

                    {/* Dropdown Menu Data */}
                    <ul className="flex flex-col px-6 py-4 gap-6 justify-center font-semibold">
                        {/* User image, name, role */}
                        <li className="flex gap-4 items-center">
                            <img
                                src={currentUser?.photoURL || "/no_user.png"}
                                className="h-[24px] w-[24px] md:h-[40px] md:w-[40px] rounded-full 
                                outline outline-1  outline-offset-1
                                cursor-pointer"
                                title={currentUser?.displayName}
                            />
                            <div className="font-bold text-lg">{currentUser?.displayName}</div>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive, isPending }) =>
                                    isActive
                                        ? ` text-[--text-highlight] border-b-2 border-[--text-highlight]`
                                        : ` hover:text-[--text-highlight]`
                                }
                                to="/profile"
                            >
                                Profile
                            </NavLink>
                        </li>

                        {/* Logout */}
                        <li
                            onClick={handleLogout}
                            className=" font-semibold hover:text-[--text-highlight] cursor-pointer"
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            </div>

            {/* Overlay when dropdown active, 
                created this for close dropdown after clicking anywhere */}
            {/* 
                    (navItem_dropdownShow || profileItem_dropdownShow) && currentUser
                eta disi karon, dropdown kore logout dileo dekha jay overlay theke gese.
                */}
            <div
                id="fullScreenOverlay"
                className={
                    (navItem_dropdownShow || profileItem_dropdownShow) && currentUser
                        ? `show`
                        : `hide`
                }
                onClick={() => {
                    setNavItem_dropdownShow(false);
                    setProfileItem_dropdownShow(false);
                }}
            ></div>
        </div>
    );
};

export default NavBar;
