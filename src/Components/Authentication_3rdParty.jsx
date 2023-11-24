import { Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import SendIcon from "@mui/icons-material/Send";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

const Authentication_3rdParty = ({ actionName }) => {
    const { googleLogin, githubLogin } = useContext(AuthContext);

    // TODO: google and github e register role set er jnno functional korte hbe.
    const handleUserCreate_3rdParty = (media) => {
        if (actionName === "login") {
            return media("Logged in Successfully", "login");
        } else if (actionName === "register_hr") {
            return media("Registered Successfully", "register_hr");
        } else if (actionName === "register_employee") {
            return media("Registered Successfully", "register_employee");
        }
    };

    return (
        <div className="w-full">
            {/* Continue Using Text */}
            <div className="flex items-center justify-center w-[90%] mx-auto">
                <div className="border border-[var(--text-medium)] flex-1 h-0"></div>
                <h1 className="text-base font-semibold px-2 py-2 _text-medium">Continue Using</h1>
                <div className="border border-[var(--text-medium)] flex-1 h-0"></div>
            </div>

            {/* Login With Google/Github */}
            <div className="flex gap-4 mt-4 justify-center">
                {/* Google */}
                <Button
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={() => handleUserCreate_3rdParty(googleLogin)}
                >
                    Google
                </Button>

                {/* Github */}
                <Button
                    variant="contained"
                    startIcon={<GitHubIcon />}
                    onClick={() => handleUserCreate_3rdParty(githubLogin)}
                >
                    Github
                </Button>
            </div>
        </div>
    );
};

export default Authentication_3rdParty;
