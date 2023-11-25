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
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../AuthProvider";
import Authentication_3rdParty from "../Components/Authentication_3rdParty";
import SectionTitle from "../Components/SectionTitle";

const imageApiKey = import.meta.env.VITE_IMAGE_API_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageApiKey}`;

const Register_Employee = () => {
    const [fullName, setFullName] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [passwordInput, setPasswordInput] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const { userCreate } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        let userImage = e.target.userImage.files[0];
        let userImageReponse;

        console.log(userImage, userImageReponse?.success);

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

        if (userImage && !userImageReponse?.success) {
            toast.error("Image Upload Failed!");
            return;
        }

        let data = {
            userFullName: fullName,
            userEmail: emailInput,
            userPassword: passwordInput,
            userDob: dateOfBirth,
            userImage: userImageReponse?.data?.url,
            userRole: "employee",
            userCompanyLogo: null,
            userCompanyName: null,
        };

        console.log(data);
        userCreate(data)
            .then((response) => {
                // Reset form after successfull register
                e.target.reset();
            })
            .catch((error) => {});
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 mb-8">
            <SectionTitle data={{ title: "Signup as Employee", noBorder: "true" }}></SectionTitle>

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

                    <div className="flex gap-4 items-center">
                        <p>Date of Birth: </p>

                        <input
                            type="date"
                            name=""
                            id=""
                            className="border border-[#c2c2c2] px-6 py-4 rounded bg-transparent"
                            placeholder="Date"
                            onChange={(event) => setDateOfBirth(event.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 items-center py-4">
                        <p>User Image: </p>

                        <input type="file" name="userImage" id="" />
                    </div>
                    <Button type="submit" variant="contained">
                        Sign Up
                    </Button>
                </div>
            </form>

            <Authentication_3rdParty actionName="register_employee"></Authentication_3rdParty>
        </div>
    );
};

export default Register_Employee;
