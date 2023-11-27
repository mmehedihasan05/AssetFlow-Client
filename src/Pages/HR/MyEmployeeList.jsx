import SectionTitle from "../../Components/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DataLoading from "../../Components/DataLoading";
import Checkbox from "@mui/material/Checkbox";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Tooltip from "@mui/material/Tooltip";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
};

const MyEmployeeList = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteStage, setDeleteStage] = useState({});

    // Employess in my team
    const {
        data: subordinates = [],
        isLoading: isSubordinatesLoading,
        refetch: refetch_Subordinates,
    } = useQuery({
        queryKey: ["subordinates", currentUserInfo?.userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/users/subordinates?email=${currentUserInfo?.userEmail}`
            );
            return res.data;
        },
    });

    const handleEmployeeRemove = (userInfo) => {
        return toast.promise(
            axiosSecure
                .delete(
                    `/users/subordinates/remove?email=${currentUserInfo?.userEmail}&targetedUserEmail=${userInfo.userEmail}`
                )
                .then((response) => {
                    if (
                        response.data?.updatedEmployeeData_result?.acknowledged &&
                        response.data?.updatedHrData_Result?.acknowledged
                    ) {
                        refetch_Subordinates();
                        return <b>Employee removed from team!</b>;
                    } else {
                        throw new Error("Failed remove employee!");
                    }
                })
                .catch((error) => {
                    console.log("error from singlebooking ", error);
                    throw new Error("Failed to remove employee!");
                }),
            {
                loading: "Removing Employee...",
                success: (message) => message,
                error: (error) => <b>Failed to remove employee!</b>,
            }
        );
    };

    return (
        <div className="space-y-8  md:max-w-full lg:max-w-[75%] mx-auto px-6">
            <SectionTitle data={{ title: "My Employees" }}></SectionTitle>
            <div className="space-y-2 ">
                {isSubordinatesLoading && <DataLoading></DataLoading>}
                {/* Employee List */}
                <div className="space-y-4">
                    {isSubordinatesLoading || (
                        <div className="flex gap-8 items-center border-b px-2 py-4  bg-white shadow-md rounded-lg hover:bg-blue-50">
                            {/* HR */}
                            <div className="w-[15%] flex justify-center">
                                <img
                                    src={currentUserInfo?.userImage}
                                    className="h-12 w-12 rounded-full object-cover outline outline-1  outline-offset-1 p-2px"
                                />
                            </div>
                            <div className="flex-1">{currentUserInfo?.userFullName}</div>
                            <div className="w-[20%] flex justify-center">
                                <Tooltip title="HR" arrow>
                                    <AdminPanelSettingsIcon></AdminPanelSettingsIcon>
                                </Tooltip>
                            </div>
                            <div className="w-[20%] flex justify-center">
                                <Tooltip title="HR cannot be removed!" arrow>
                                    <button className="px-2">
                                        <HighlightOffIcon className="text-gray-400" disabled />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    )}

                    {/* subordiates */}
                    {subordinates.map((employee, idx) => (
                        <div
                            key={idx}
                            className="flex gap-8 items-center
                                 border-b px-2 py-4 bg-white shadow-md rounded-lg hover:bg-blue-50"
                        >
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
                                <Tooltip title="Remove from team" arrow>
                                    <button
                                        className="px-2"
                                        onClick={() => {
                                            setDeleteStage(employee);
                                            setModalOpen(true);
                                        }}
                                    >
                                        <HighlightOffIcon color="error" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            <Modal
                open={modalOpen}
                onClose={() => {
                    setDeleteStage({});
                    setModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="space-y-6">
                        <div className="text-xl text-[--warning] font-semibold">
                            Do you really want to remove the employee from your team?
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <img
                                    src={deleteStage?.userImage}
                                    className="h-8 w-8 rounded-full object-cover outline outline-1  outline-offset-1 p-2px"
                                />
                            </div>
                            <div>{deleteStage?.userFullName}</div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleEmployeeRemove(deleteStage);
                                    setModalOpen(false);
                                    setDeleteStage({});
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default MyEmployeeList;
