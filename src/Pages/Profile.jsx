import { Button, TextField, Tooltip } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthProvider";
import DataLoading from "../Components/DataLoading";
import SectionTitle from "../Components/SectionTitle";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CheckIcon from "@mui/icons-material/Check";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
const Profile = () => {
    const { currentUserInfo, setCurrentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const [nameEdit, setNameEdit] = useState(true);
    const [dobEdit, setDobEdit] = useState(true);

    const [fullName, setFullName] = useState(currentUserInfo?.userFullName);
    const [dateOfBirth, setDateOfBirth] = useState(currentUserInfo?.userDob);

    const handleProfileUpdate = () => {
        setNameEdit(true);
        setDobEdit(true);

        const profileInformation = {
            userFullName: fullName,
            userDob: dateOfBirth,
        };

        // Updating profile information
        return toast.promise(
            axiosSecure
                .post("/users/updateProfile", {
                    profileInformation: profileInformation,
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    console.log(response);
                    if (response.data?.updatedEmployeeData_result?.acknowledged) {
                        setCurrentUserInfo(response.data?.userInformation);
                        return <b>Profile information updated Successfully.</b>;
                    } else {
                        throw new Error("Failed to update profile!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to update profile!");
                }),
            {
                loading: "Updating profile...",
                success: (message) => message,
                error: (error) => <b>Failed to update profile!</b>,
            }
        );
    };

    return (
        <div className="space-y-8 max-w-[75%] mx-auto px-6">
            <SectionTitle data={{ title: "Update information" }}></SectionTitle>
            <div className="flex flex-col space-y-4">
                {/* Full name */}
                <div className="flex items-center gap-4">
                    <TextField
                        id="standard-read-only-input"
                        label="Full Name"
                        defaultValue={fullName}
                        sx={{ width: "100%" }}
                        InputProps={{
                            readOnly: nameEdit,
                        }}
                        variant="standard"
                        onChange={(event) => setFullName(event.target.value)}
                    />
                    <button onClick={() => setNameEdit(!nameEdit)}>
                        {nameEdit ? <ModeEditOutlineIcon /> : <CheckIcon />}
                    </button>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                    <TextField
                        id="standard-read-only-input"
                        label="Email"
                        defaultValue={currentUserInfo?.userEmail || ""}
                        sx={{ width: "100%" }}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="standard"
                    />
                    <Tooltip title="Email cannot be edited!" arrow>
                        <button>
                            <ModeEditOutlineIcon className="text-gray-300" />
                        </button>
                    </Tooltip>
                </div>

                {/* Date of birth */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col w-full">
                        <p className="text-[#646466] text-[0.85rem]">Date of Birth: </p>

                        <input
                            type="date"
                            name=""
                            id=""
                            className="border-b border-[#c2c2c2] py-1  bg-transparent text-[#202021]"
                            onChange={(event) => setDateOfBirth(event.target.value)}
                            value={dateOfBirth}
                            disabled={dobEdit}
                        />
                    </div>
                    <button onClick={() => setDobEdit(!dobEdit)}>
                        {dobEdit ? <ModeEditOutlineIcon /> : <CheckIcon />}
                    </button>
                </div>
                <Button variant="contained" onClick={handleProfileUpdate}>
                    Update
                </Button>
            </div>
        </div>
    );
};

export default Profile;
