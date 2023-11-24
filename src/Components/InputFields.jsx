import { FormControl } from "@mui/base";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useState } from "react";

import { Button, IconButton, TextField } from "@mui/material";
import { useContext } from "react";
import SectionTitle from "../Components/SectionTitle";
import Authentication_3rdParty from "../Components/Authentication_3rdParty";
import { AuthContext } from "../AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
/*
                            onClick={() => setShowPassword((show) => !show)}
                            onMouseDown={(event) => event.preventDefault()}

*/

const Password = ({ setPasswordInput, showPassword, setShowPassword }) => {
    return (
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
    );
};

export { Password };
