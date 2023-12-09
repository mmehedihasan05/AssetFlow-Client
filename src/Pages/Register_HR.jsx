import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
} from "@mui/material";

import { useContext, useState } from "react";
import SectionTitle from "../Components/SectionTitle";
import Select from "react-select";
import Authentication_3rdParty from "../Components/Authentication_3rdParty";
import usePackages from "../hooks/usePackages";
import { AuthContext } from "../AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
const imageApiKey = import.meta.env.VITE_IMAGE_API_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageApiKey}`;
const Register_HR = () => {
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [passwordInput, setPasswordInput] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("");
    const { userCreate } = useContext(AuthContext);

    let [packages = []] = usePackages();

    const handleRegister = async (e) => {
        e.preventDefault();

        let userImage = e.target.userImage.files[0];
        let companyImage = e.target.companyLogo.files[0];

        let userImageReponse;
        let companyImageReponse;

        // user image upload
        if (userImage) {
            let toastId = toast.loading("Uploading Image...");
            const uploadImage = async (bannerImage) => {
                try {
                    // Create FormData object
                    const formData = new FormData();
                    formData.append("image", bannerImage);

                    // Make the API request using Axios
                    const imagePostResponse = await axios.post(imageHostingApi, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    toast.remove(toastId);
                    return imagePostResponse.data;
                } catch (error) {
                    console.error("Image Upload Error:", error);
                    throw error;
                }
            };
            userImageReponse = await uploadImage(userImage);
        }

        // company logo upload
        if (companyImage) {
            let toastId2 = toast.loading("Uploading Image...");
            const uploadImage = async (bannerImage) => {
                try {
                    // Create FormData object
                    const formData = new FormData();
                    formData.append("image", bannerImage);

                    // Make the API request using Axios
                    const imagePostResponse = await axios.post(imageHostingApi, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    toast.remove(toastId2);
                    return imagePostResponse.data;
                } catch (error) {
                    console.error("Image Upload Error:", error);
                    throw error;
                }
            };
            companyImageReponse = await uploadImage(companyImage);
        }

        let data = {
            userFullName: fullName,
            userEmail: emailInput.toLowerCase(),
            userPassword: passwordInput,
            userDob: dateOfBirth || null,
            userImage: userImageReponse?.data?.url || null,
            userRole: "hr",

            userCompanyLogo: companyImageReponse?.data?.url || null,
            userCompanyName: companyName || null,
        };
        // console.log(data);
        userCreate(data)
            .then((response) => {
                // Reset form after successfull register
                e.target.reset();
            })
            .catch((error) => {});
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 mb-8  px-4 lg:px-0">
            <SectionTitle data={{ title: "Signup as HR", noBorder: "true" }}></SectionTitle>

            <form onSubmit={handleRegister}>
                <div className="flex flex-col space-y-4">
                    <TextField
                        id="outlined-basic"
                        label="Full Name"
                        variant="outlined"
                        onChange={(event) => setFullName(event.target.value)}
                        required
                    />
                    <TextField
                        id="outlined-basic"
                        label="Company Name"
                        variant="outlined"
                        onChange={(event) => setCompanyName(event.target.value)}
                        required
                    />

                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        onChange={(event) => setEmailInput(event.target.value)}
                        required
                    />
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((show) => !show)}
                                        onMouseDown={(event) => event.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            onChange={(event) => setPasswordInput(event.target.value)}
                            required
                        />
                    </FormControl>

                    <Select
                        placeholder="Select Package"
                        options={packages}
                        onChange={setSelectedPackage}
                        required
                    />
                    <div
                        className="flex gap-4 items-center
                    border border-[#c2c2c2] px-4 py-4 rounded bg-white"
                    >
                        <p>Date of Birth: </p>

                        <input
                            type="date"
                            name=""
                            id=""
                            placeholder="Date"
                            onChange={(event) => {
                                const currentDate = new Date();
                                const inputDate = new Date(event.target.value);

                                if (inputDate <= currentDate) {
                                    setDateOfBirth(event.target.value);
                                } else {
                                    toast.error("Invalid date of birth!");
                                }
                            }}
                            value={dateOfBirth}
                        />
                    </div>
                    <div
                        className="flex gap-4 items-center 
                    border border-[#c2c2c2] px-4 py-4 rounded bg-white"
                    >
                        <p>Company Logo: </p>

                        <input type="file" name="" id="companyLogo" />
                    </div>
                    <div
                        className="flex gap-4 items-center 
                    border border-[#c2c2c2] px-4 py-4 rounded bg-white"
                    >
                        <p>User Image: </p>

                        <input type="file" name="" id="userImage" />
                    </div>

                    <Button variant="contained" type="submit">
                        Sign Up
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Register_HR;
/*
npm uninstall @mui/lab
npm uninstall @mui/x-date-pickers
npm uninstall @mui/x-dnpm install @mui/x-date-pickers
*/
