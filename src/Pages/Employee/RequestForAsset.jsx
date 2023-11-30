import SectionTitle from "../../Components/SectionTitle";

import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Select from "react-select";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import DataLoading from "../../Components/DataLoading";
import moment from "moment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import toast from "react-hot-toast";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
};
import { Helmet } from "react-helmet-async";
const RequestForAsset = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [title_Filter, setTitle_Filter] = useState(null);
    const [availability_Filter, setAvailability_Filter] = useState(null);
    const [type_Filter, setType_Filter] = useState(null);
    const [searchUrl, setSearchUrl] = useState(`/product?email=${currentUserInfo?.userEmail}`);
    const axiosSecure = useAxiosSecure();

    const [modalOpen, setModalOpen] = useState(false);
    const [requestStage, setRequestStage] = useState({});
    const [additionalNotes, setAdditionalNotes] = useState("");

    const availabilityOptions = [
        { label: "Available", value: "available" },
        { label: "Out of Stock", value: "unavailable" },
    ];
    const assetTypeOptions = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];

    const { data: allAsset = [], isLoading: isAllAssetLoading } = useQuery({
        queryKey: ["allAsset", currentUserInfo?.userEmail, searchUrl],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);
            return res.data;
        },
    });

    const handleSearch = () => {
        // console.log({ title_Filter, availability_Filter, type_Filter });
        let query = ``;

        if (title_Filter && title_Filter !== "") {
            query += `&title=${title_Filter}`;
        }

        if (availability_Filter) {
            query += `&availability=${availability_Filter}`;
        }

        if (type_Filter) {
            query += `&type=${type_Filter}`;
        }

        setSearchUrl(`/product?email=${currentUserInfo?.userEmail}${query}`);
    };

    // final request for requesting for the product
    const handleProductRequest = (requestStage) => {
        const requestedProductInfo = {
            userEmail: currentUserInfo?.userEmail,
            userFullName: currentUserInfo?.userFullName,
            currentWorkingCompanyEmail: currentUserInfo?.currentWorkingCompanyEmail,

            productName: requestStage?.productName,
            productId: requestStage?._id,
            requestedDate: new Date(),
            additionalNotes: additionalNotes?.target?.value || " ",
            productType: requestStage?.productType,
            approvalStatus: "pending",
            approvalDate: null,
        };

        // console.log("requestedProductInfo", requestedProductInfo);

        return toast.promise(
            axiosSecure
                .post("/product/request/add", {
                    requestedProductInfo: requestedProductInfo,
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        return <b>Product requested successfully!</b>;
                    } else if (response.data?.productExists) {
                        return <b>Product requested already!</b>;
                    } else {
                        throw new Error("Failed to send request!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to send request!");
                }),
            {
                loading: "Request sending...",
                success: (message) => message,
                error: (error) => <b>Failed to send request!</b>,
            }
        );
    };

    return (
        <div className="custom-width  space-y-8">
            <SectionTitle
                data={{
                    title: "Asset List",
                    description: "All asset from your company",
                    noBorder: false,
                }}
            ></SectionTitle>

            {/* Search and Filter */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <TextField
                        id="outlined-basic"
                        label="Search By Title"
                        variant="outlined"
                        sx={{ width: "100%" }}
                        onChange={(event) => setTitle_Filter(event.target.value)}
                    />
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Filter assets</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="space-y-3">
                                <Select
                                    placeholder="Filter by Availability"
                                    options={availabilityOptions}
                                    onChange={(selectedOption) =>
                                        setAvailability_Filter(
                                            selectedOption ? selectedOption.value : null
                                        )
                                    }
                                    isClearable={true}
                                />
                                <Select
                                    placeholder="Filter by Type"
                                    options={assetTypeOptions}
                                    onChange={(selectedOption) =>
                                        setType_Filter(selectedOption ? selectedOption.value : null)
                                    }
                                    isClearable={true}
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className="flex justify-center">
                    <Button variant="contained" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </div>

            {isAllAssetLoading && <DataLoading></DataLoading>}

            {/* Asset List */}
            <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                {allAsset.map((asset, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-xl p-6 rounded-md space-y-6 flex flex-col"
                    >
                        <div>
                            <h2 className="text-2xl font-semibold">{asset.productName}</h2>
                        </div>
                        <div className="space-y-2 font-medium flex-1">
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
                                Quantity:
                                {asset?.productQuantity < 1 ? (
                                    <p className="text-red-600 font-semibold">Out of stock!</p>
                                ) : (
                                    <p className="font-semibold">Available</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="contained"
                                disabled={asset?.productQuantity < 1}
                                onClick={() => {
                                    setRequestStage(asset);
                                    setModalOpen(true);
                                }}
                            >
                                Request
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            <Modal
                open={modalOpen}
                onClose={() => {
                    setRequestStage({});
                    setModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="space-y-6 px-4 md:px-0">
                        <div className="text-xl text-[--warning] font-semibold">
                            Do you really want to request for the item?
                        </div>
                        <div className="text-base font-bold">
                            {" "}
                            <ArrowRightIcon />
                            {requestStage?.productName}
                        </div>
                        <div>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Additional Notes"
                                multiline
                                maxRows={4}
                                sx={{ width: "100%" }}
                                onChange={setAdditionalNotes}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleProductRequest(requestStage);
                                    setModalOpen(false);
                                    setRequestStage({});
                                }}
                            >
                                Request
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Helmet>
                <title>Request for Asset - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default RequestForAsset;
