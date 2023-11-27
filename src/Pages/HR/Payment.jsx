import SectionTitle from "../../Components/SectionTitle";
import usePackages from "../../hooks/usePackages";
import Packages from "../Home/Packages";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Payment = () => {
    let [packages = []] = usePackages();
    const navigate = useNavigate();

    return (
        <div className="custom-width space-y-8">
            <SectionTitle data={{ title: "Make Payment" }}></SectionTitle>
            <div>
                <div className="grid grid-cols-2 gap-6">
                    {packages.map((Package, idx) => (
                        <div
                            key={idx}
                            className="shadow-md flex flex-col rounded-md space-y-4 pb-4"
                        >
                            <img src={Package.image} className="rounded-t-md" alt="" />
                            <div className="flex-auto p-4 space-y-2">
                                <h2 className="text-2xl font-semibold">{Package.label}</h2>
                                <p>{Package.description}</p>
                            </div>

                            <div className="text-2xl font-semibold flex items-center justify-center">
                                Price:
                                <AttachMoneyRoundedIcon />
                                {Package.price}
                            </div>

                            <div></div>
                            <Button
                                sx={{ margin: "0px 16px" }}
                                variant="contained"
                                onClick={() => navigate("")}
                            >
                                Buy Package
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Payment;
