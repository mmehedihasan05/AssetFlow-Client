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
import { useState } from "react";
import Authentication_3rdParty from "../Components/Authentication_3rdParty";
import SectionTitle from "../Components/SectionTitle";

const Register_Employee = () => {
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [startDate, setStartDate] = useState(null);

    return (
        <div className="max-w-3xl mx-auto space-y-8 mb-8">
            <SectionTitle data={{ title: "Signup as Employee", noBorder: "true" }}></SectionTitle>

            <div className="flex flex-col space-y-4">
                <TextField
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    onChange={(event) => setFullName(event.target.value)}
                />
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    onChange={(event) => setEmailInput(event.target.value)}
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
                    />
                </div>

                <Button variant="contained">Sign Up</Button>
            </div>

            <Authentication_3rdParty actionName="register_employee"></Authentication_3rdParty>
        </div>
    );
};

export default Register_Employee;
