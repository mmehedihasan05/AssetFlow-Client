import {
    Button,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext, useState } from "react";
import SectionTitle from "../Components/SectionTitle";
import Authentication_3rdParty from "../Components/Authentication_3rdParty";
import { AuthContext } from "../AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { Password } from "../Components/InputFields";

const Login = () => {
    const { login, currentUser } = useContext(AuthContext);
    const location = useLocation();

    const [emailInput, setEmailInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const handleEmailInput = (event) => {
        setEmailInput(event.target.value);
    };

    if (currentUser?.email && location?.state) {
        return <Navigate to={location.state} />;
    } else if (currentUser?.email && !location?.state) {
        return <Navigate to="/" />;
    }

    const handleLogin = (e) => {
        e.preventDefault();
        let data = {
            userEmail: emailInput,
            userPassword: passwordInput,
        };
        console.log(data);
        login(data);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <SectionTitle data={{ title: "Login", noBorder: "true" }}></SectionTitle>

            <div className="flex flex-col space-y-4">
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    onChange={handleEmailInput}
                />
                {/* 
                <Password
                    setPasswordInput={setShowPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                ></Password> */}

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
                    />
                </FormControl>

                <Button variant="contained" onClick={handleLogin}>
                    Login
                </Button>
                <Authentication_3rdParty actionName="login"></Authentication_3rdParty>
            </div>
        </div>
    );
};

export default Login;
