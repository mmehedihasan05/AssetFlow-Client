import { useQuery } from "@tanstack/react-query";

import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePackages from "../../hooks/usePackages";

const Packages = () => {
    const navigate = useNavigate();
    let [packages] = usePackages();

    return (
        <div className="custom-width bg-white space-y-4">
            <SectionTitle
                data={{
                    title: "Our Packages",
                    description: "Flexible Packages to Suit Any Team Size",
                }}
            ></SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((Package, idx) => (
                    <div key={idx} className="shadow-md flex flex-col rounded-md space-y-4 pb-4">
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
                            onClick={() => navigate("/register_hr")}
                        >
                            Buy Package
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packages;
