import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Button, Modal, Tooltip } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomRequestInfo from "./CustomRequestInfo";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

import { TextField } from "@mui/material";
import { useContext } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { AuthContext } from "../../AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
const imageApiKey = import.meta.env.VITE_IMAGE_API_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageApiKey}`;

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    maxWidth: 400,
};

const CustomRequestEmployee = ({ asset, customAssets_refetch }) => {
    const axiosSecure = useAxiosSecure();
    let { currentUserInfo } = useContext(AuthContext);

    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [productName, setProductName] = useState(asset?.productName);
    const [productPrice, setProductPrice] = useState(asset?.productPrice);
    const [additionalNotes, setAdditionalNotes] = useState(asset?.productNotes);
    const [deliveryDeadline, setDeliveryDeadline] = useState(asset?.productDeliveryDeadline);
    const [selectedType, setProductType] = useState(asset?.productType);
    const [selectedUrgencyLevel, setUrgencyLevel] = useState(asset?.productUrgencyLevel);
    const [productImage, setProductImage] = useState(null);

    const types = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];

    const urgencyLevelOptions = [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
    ];

    const handleCustomUpdate = async () => {
        console.log("hiiiii", asset);

        let productImageReponse;
        if (productImage) {
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
            productImageReponse = await uploadImage(productImage);
        }

        if (productImage && !productImageReponse?.success) {
            toast.error("Image Upload Failed!");
            return;
        }

        const productInformation = {
            _id: asset._id,
            productName: productName || asset?.productName,
            productType: selectedType || asset?.productType,
            productPrice: productPrice || asset?.productPrice,
            productUrgencyLevel: selectedUrgencyLevel || asset?.productUrgencyLevel,
            productNotes: additionalNotes.target.value || asset?.productNotes,
            productDeliveryDeadline: deliveryDeadline || asset?.productDeliveryDeadline,
            productImage: productImageReponse?.data?.url || asset?.productImage,
        };

        console.log(productInformation);

        return toast.promise(
            axiosSecure
                .post("/custom-product/update", {
                    productInformation: productInformation,
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        customAssets_refetch();
                        setEditMode(false);
                        return <b>Product Updated Successfully.</b>;
                    } else {
                        throw new Error("Failed to update request!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to update request!");
                }),
            {
                loading: "Updating request...",
                success: (message) => message,
                error: (error) => <b>Failed to update request!</b>,
            }
        );
    };

    return (
        <div>
            <div className="bg-white shadow-xl p-6 rounded-md space-y-6 flex flex-col">
                <div>
                    <h2 className="text-2xl font-semibold">{asset.productName}</h2>
                </div>
                <div className="space-y-2 font-medium flex-1">
                    <div className="flex gap-1">
                        Price :
                        <p className="font-semibold">
                            <AttachMoneyIcon fontSize="small" />
                            {asset?.productPrice}
                        </p>
                    </div>

                    <div className="inline-flex gap-1">
                        Asset Type:
                        <p className="font-semibold">
                            {asset?.productType === "returnable"
                                ? "Returnable"
                                : asset?.productType === "non_returnable"
                                ? "Non-Returnable"
                                : "-"}
                        </p>
                    </div>

                    <div className="flex gap-1">
                        Status : <p className="font-semibold capitalize">{asset.approvalStatus}</p>
                    </div>
                </div>
                <Button
                    variant="contained"
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    View Details
                </Button>
            </div>

            {/* MODAL */}
            <Modal
                open={modalOpen}
                onClose={() => {
                    setEditMode(false);
                    setModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="space-y-6">
                        {/* Edit cancel save buttons */}
                        {editMode ? (
                            <>
                                {/* Update form */}
                                <div className="flex flex-col space-y-4">
                                    <TextField
                                        id="outlined-basic"
                                        label="Product Name"
                                        variant="outlined"
                                        onChange={(event) => setProductName(event.target.value)}
                                        required
                                        defaultValue={productName}
                                    />

                                    <TextField
                                        id="outlined-number"
                                        label="Price"
                                        type="number"
                                        onChange={(event) => setProductPrice(event.target.value)}
                                        required
                                        defaultValue={productPrice}
                                    />

                                    <TextField
                                        id="outlined-multiline-flexible"
                                        label="Why need this"
                                        multiline
                                        maxRows={4}
                                        sx={{ width: "100%" }}
                                        onChange={setAdditionalNotes}
                                        required
                                        defaultValue={additionalNotes}
                                    />

                                    <Select
                                        placeholder="Select Type"
                                        options={types}
                                        onChange={(selectedOption) =>
                                            setProductType(
                                                selectedOption ? selectedOption.value : null
                                            )
                                        }
                                        required
                                        value={selectedType === "returnable" ? types[0] : types[1]}
                                    />
                                    <Select
                                        placeholder="Select Urgency Level"
                                        options={urgencyLevelOptions}
                                        onChange={(selectedOption) =>
                                            setUrgencyLevel(
                                                selectedOption ? selectedOption.value : null
                                            )
                                        }
                                        value={
                                            selectedUrgencyLevel === "low"
                                                ? urgencyLevelOptions[0]
                                                : selectedUrgencyLevel === "medium"
                                                ? urgencyLevelOptions[1]
                                                : urgencyLevelOptions[2]
                                        }
                                        required
                                    />

                                    {/* Delivery Deadline */}
                                    <div className="flex gap-4 items-center border border-[#c2c2c2] px-4 py-4 rounded bg-white">
                                        <p className="text-[#646466] text-[0.85rem]">
                                            Delivery Deadline:{" "}
                                        </p>

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

                                    <div className="flex gap-4 items-center border border-[#c2c2c2] px-4 py-4 rounded bg-white">
                                        <p>Asset Image: </p>

                                        <input
                                            type="file"
                                            name=""
                                            id="assetImage"
                                            onChange={(event) => {
                                                const file = event.target.files[0];

                                                if (file) {
                                                    setProductImage(file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setEditMode(true);
                                            handleCustomUpdate();
                                        }}
                                        startIcon={<DoneIcon />}
                                    >
                                        Save
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setEditMode(false);
                                        }}
                                        endIcon={<CloseIcon />}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <CustomRequestInfo asset={asset} extra={false}></CustomRequestInfo>

                                <div className="flex justify-between gap-4">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setModalOpen(false);
                                        }}
                                        startIcon={<CloseIcon />}
                                    >
                                        Close
                                    </Button>

                                    <Tooltip
                                        title={`${
                                            asset.approvalStatus === "approved"
                                                ? "Approved Items Cannot be edited"
                                                : ""
                                        }`}
                                        arrow
                                        placement="top-start"
                                    >
                                        <span>
                                            <Button
                                                variant="contained"
                                                endIcon={<EditIcon />}
                                                onClick={() => {
                                                    setEditMode(true);
                                                }}
                                                disabled={asset.approvalStatus === "approved"}
                                            >
                                                Update
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </div>
                            </>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default CustomRequestEmployee;
