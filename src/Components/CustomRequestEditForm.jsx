import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import Select from "react-select";
import { AuthContext } from "../AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const CustomRequestEditForm = ({ asset }) => {
    const axiosSecure = useAxiosSecure();
    let { currentUserInfo } = useContext(AuthContext);
    const [productName, setProductName] = useState(null);
    const [productPrice, setProductPrice] = useState(null);
    const [selectedType, setProductType] = useState(null);
    const [selectedUrgencyLevel, setUrgencyLevel] = useState(null);
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [deliveryDeadline, setDeliveryDeadline] = useState("");

    const types = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];

    const urgencyLevelOptions = [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
    ];

    return (
        <div className="flex flex-col space-y-4">
            <TextField
                id="outlined-basic"
                label="Product Name"
                variant="outlined"
                onChange={(event) => setProductName(event.target.value)}
                required
            />

            <TextField
                id="outlined-number"
                label="Price"
                type="number"
                onChange={(event) => setProductPrice(event.target.value)}
                required
            />

            <TextField
                id="outlined-multiline-flexible"
                label="Why need this"
                multiline
                maxRows={4}
                sx={{ width: "100%" }}
                onChange={setAdditionalNotes}
                required
            />

            <Select
                placeholder="Select Type"
                options={types}
                onChange={(selectedOption) =>
                    setProductType(selectedOption ? selectedOption.value : null)
                }
                required
            />
            <Select
                placeholder="Select Urgency Level"
                options={urgencyLevelOptions}
                onChange={(selectedOption) =>
                    setUrgencyLevel(selectedOption ? selectedOption.value : null)
                }
                required
            />

            {/* Delivery Deadline */}
            <div
                className="flex gap-4 items-center
                border border-[#c2c2c2] px-4 py-4 rounded bg-white"
            >
                <p className="text-[#646466] text-[0.85rem]">Delivery Deadline: </p>

                <input
                    type="date"
                    name=""
                    id=""
                    className="text-[#202021]"
                    onChange={(event) => {
                        const currentDate = new Date();
                        const inputDate = new Date(event.target.value);

                        if (inputDate >= currentDate) {
                            setDeliveryDeadline(event.target.value);
                        } else {
                            toast.error("Invalid delivery date!");
                        }
                    }}
                    value={deliveryDeadline}
                    required
                />
            </div>

            <div
                className="flex gap-4 items-center
                border border-[#c2c2c2] px-4 py-4 rounded bg-white"
            >
                <p>Asset Image: </p>

                <input type="file" name="" id="assetImage" required />
            </div>
        </div>
    );
};

export default CustomRequestEditForm;
