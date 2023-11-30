import Button from "@mui/material/Button";

import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import { AuthContext } from "../../AuthProvider";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import axios from "axios";
const imageApiKey = import.meta.env.VITE_IMAGE_API_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageApiKey}`;

const MakeCustomRequest = () => {
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

    // Urgency Level:Delivery Deadline:
    const handleAddCustomRequest = async (e) => {
        e.preventDefault();
        let assetImage = e.target.assetImage.files[0];
        let assetImageReponse;
        if (assetImage) {
            let toastId = toast.loading("Uploading Image...");
            const uploadImage = async (image) => {
                try {
                    // Create FormData object
                    const formData = new FormData();
                    formData.append("image", image);

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
            assetImageReponse = await uploadImage(assetImage);
        }

        if (assetImage && !assetImageReponse?.success) {
            toast.error("Image Upload Failed!");
            return;
        }

        const productInformation = {
            productName,
            productType: selectedType,
            productAddDate: new Date(),
            productPrice: productPrice || null,
            productUrgencyLevel: selectedUrgencyLevel || null,
            productNotes: additionalNotes.target.value || "",
            productDeliveryDeadline: deliveryDeadline || null,
            productImage: assetImageReponse?.data?.url || null,

            userFullName: currentUserInfo?.userFullName,
            userEmail: currentUserInfo?.userEmail,
            currentWorkingCompanyEmail: currentUserInfo?.currentWorkingCompanyEmail,
            productSource: currentUserInfo?.userRole,
            approvalStatus: "pending",
        };

        console.log(productInformation);

        return toast.promise(
            axiosSecure
                .post("/custom-product/add", {
                    productInformation: productInformation,
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        e.target.reset();
                        return <b>Product Requested Successfully.</b>;
                    } else {
                        throw new Error("Failed to make request!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to make request!");
                }),
            {
                loading: "Making request...",
                success: (message) => message,
                error: (error) => <b>Failed to make request!</b>,
            }
        );
    };
    return (
        <div className="max-w-3xl mx-auto space-y-8 mb-8">
            <SectionTitle
                data={{
                    title: "Make a custom request",
                    noBorder: false,
                }}
            ></SectionTitle>
            <form onSubmit={handleAddCustomRequest} className="flex flex-col space-y-4">
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

                <Button variant="contained" type="submit">
                    Make Request
                </Button>
            </form>
            <Helmet>
                <title>Make Custom Request - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default MakeCustomRequest;
