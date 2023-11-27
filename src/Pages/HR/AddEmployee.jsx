import SectionTitle from "../../Components/SectionTitle";
import Button from "@mui/material/Button";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Checkbox from "@mui/material/Checkbox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Tooltip from "@mui/material/Tooltip";
import toast from "react-hot-toast";
import DataLoading from "../../Components/DataLoading";

const AddEmployee = () => {
    // /users/available
    let { currentUserInfo } = useContext(AuthContext);
    let [employeesCheck, setEmployeesCheck] = useState([]);
    const axiosSecure = useAxiosSecure();

    // Available employee
    const {
        data: availableEmployee = [],
        isLoading: isavailableEmployeeLoading,
        refetch: refetch_availableEmployee,
    } = useQuery({
        queryKey: ["availableEmployee", currentUserInfo?.userEmail],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(
                `/users/available?email=${currentUserInfo?.userEmail}`
            );
            return res.data;
        },
    });

    // Total product added by the admin
    const { data: totalProductCount = {}, refetch: refetch_totalProductCount } = useQuery({
        queryKey: ["totalProductCount", currentUserInfo?.userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/product/count?email=${currentUserInfo?.userEmail}`);
            return res.data;
        },
    });

    // Total membership and remaininng slots
    const { data: memberShipInfo = {}, refetch: refetch_memberShipInfo } = useQuery({
        queryKey: ["memberShipInfo", currentUserInfo?.userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `membership/check?email=${currentUserInfo?.userEmail}`
            );
            return res.data;
        },
    });

    console.log(availableEmployee, totalProductCount, memberShipInfo);

    const handleManualRefetch = () => {
        refetch_availableEmployee();
        refetch_totalProductCount();
        refetch_memberShipInfo();
    };

    const handleCheck = (e) => {
        let id = e.target.value;

        if (e.target.checked) {
            let temp = [...employeesCheck, id];
            setEmployeesCheck(temp);
        } else {
            let temp = employeesCheck.filter((storedId) => storedId !== id);
            setEmployeesCheck(temp);
        }
    };

    useEffect(() => {
        console.log(employeesCheck);
    }, [employeesCheck]);

    /*
    all product count: /product/count
    total membershipCount and slots left: membership/check
    */

    const remaininngSlot =
        memberShipInfo?.currentMemberShipLimit - memberShipInfo?.totalCurrentEmployees;

    const handleSingleBooking = (userId) => {
        if (remaininngSlot < 1) {
            toast.error("Increase Limit! No more remainning slot. ");
            return;
        }
        return toast.promise(
            axiosSecure
                .post(`/users/booking`, {
                    email: currentUserInfo?.userEmail,
                    employeesToBook: [userId],
                })
                .then((response) => {
                    console.log("singleUserBook", response);

                    handleManualRefetch();
                    if (
                        response.data?.updatedHrData_Result?.acknowledged &&
                        response.data?.userBooking_Result?.acknowledged
                    ) {
                        return <b>Successfully Booked employee!</b>;
                    } else {
                        throw new Error("Failed to book employee!");
                    }
                })
                .catch((error) => {
                    console.log("error from singlebooking ", error);
                    throw new Error("Failed to book employee!");
                }),
            {
                loading: "Booking user...",
                success: (message) => message,
                error: (error) => <b>Failed to book employee!</b>,
            }
        );
    };

    const handleMultiBooking = () => {
        if (remaininngSlot < employeesCheck.length) {
            toast.error("Increase Limit! No more remainning slot. ");
            return;
        }
        return toast.promise(
            axiosSecure
                .post(`/users/booking`, {
                    email: currentUserInfo?.userEmail,
                    employeesToBook: employeesCheck,
                })
                .then((response) => {
                    console.log("multiUserBook", response);

                    handleManualRefetch();
                    setEmployeesCheck([]);
                    if (
                        response.data?.updatedHrData_Result?.acknowledged &&
                        response.data?.userBooking_Result?.acknowledged
                    ) {
                        return <b>Successfully Booked employee!</b>;
                    } else {
                        throw new Error("Failed to book employee!");
                    }
                })
                .catch((error) => {
                    console.log("error from singlebooking ", error);
                    throw new Error("Failed to book employee!");
                }),
            {
                loading: "Booking user...",
                success: (message) => message,
                error: (error) => <b>Failed to book employee!</b>,
            }
        );
    };

    return (
        <div className="space-y-16  md:max-w-full lg:max-w-[75%] mx-auto px-6">
            <SectionTitle data={{ title: "Add an Employee", noBorder: false }}></SectionTitle>
            <div className="flex gap-3 flex-col text-center">
                <div className="p-4 bg-white shadow-lg rounded-md text-2xl font-semibold flex items-center space-x-6">
                    <h2 className="">Total Asset :</h2>
                    <div className="text-base">{totalProductCount?.totalProducts || "*"} Asset</div>
                </div>
                <div className="p-4 bg-white shadow-lg rounded-md text-2xl font-semibold flex items-center gap-4 space-x-6">
                    <div className="flex items-center gap-4">
                        <h2>Employee Package : </h2>
                        <div className="flex gap-4">
                            <h3 className="text-base">
                                Maximum {memberShipInfo?.currentMemberShipLimit || "*"} Employees
                            </h3>
                            <div className="border-2"></div>
                            <h3 className="text-base">
                                {memberShipInfo?.currentMemberShipLimit -
                                    memberShipInfo?.totalCurrentEmployees || "*"}{" "}
                                Slots Remaining
                            </h3>
                        </div>
                    </div>

                    <Link to="/payment">
                        <Button variant="contained">Increase Limit</Button>
                    </Link>
                </div>
            </div>
            <div className="space-y-2 ">
                {/* Employee List Head */}
                <div className="flex justify-between">
                    <div className="text-xl font-semibold">Available Employees:</div>
                    <div className="flex items-center gap-4">
                        {employeesCheck.length > 0 && (
                            <>
                                <p className="text-xl font-semibold">
                                    {employeesCheck.length} Employee Selected
                                </p>
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleMultiBooking}
                                >
                                    Add All
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isavailableEmployeeLoading && <DataLoading></DataLoading>}
                {/* Employee List */}
                <div className="">
                    <div className="space-y-4">
                        {availableEmployee.map((employee, idx) => (
                            <div
                                key={idx}
                                className="flex gap-8 border-b px-2 py-4 items-center bg-white shadow-md rounded-lg hover:bg-blue-50"
                            >
                                <div>
                                    <Checkbox onChange={handleCheck} value={employee.userEmail} />
                                </div>
                                <div className="w-[15%] flex justify-center">
                                    <img
                                        src={employee?.userImage}
                                        className="h-12 w-12 rounded-full object-cover outline outline-1  outline-offset-1 p-2px"
                                    />
                                </div>
                                <div className="flex-1">{employee?.userFullName}</div>
                                <div className="w-[20%] flex justify-center">
                                    <Tooltip title="Employee" arrow>
                                        <PersonOutlineIcon></PersonOutlineIcon>
                                    </Tooltip>
                                </div>
                                <div className="w-[20%] flex justify-center">
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => {
                                            handleSingleBooking(employee.userEmail);
                                        }}
                                    >
                                        Add to Team
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
