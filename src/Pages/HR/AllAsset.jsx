import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Button from "@mui/material/Button";
import moment from "moment";
import SectionTitle from "../../Components/SectionTitle";
import { TextField } from "@mui/material";
import Select from "react-select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataLoading from "../../Components/DataLoading";
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
import Empty from "../../Components/Empty";
const AllAsset = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [title_Filter, setTitle_Filter] = useState(null);
    const [availability_Filter, setAvailability_Filter] = useState(null);
    const [type_Filter, setType_Filter] = useState(null);
    const [quantity_Filter, setQuantity_Filter] = useState(null);
    const [searchUrl, setSearchUrl] = useState(`/product?email=${currentUserInfo?.userEmail}`);
    const axiosSecure = useAxiosSecure();

    const [modalOpen_update, setModalOpen_update] = useState(false);
    const [modalOpen_delete, setModalOpen_delete] = useState(false);
    const [actionStage, setActionStage] = useState({});

    const [productName, setProductName] = useState(null);
    const [productQuantity, setProductQuantity] = useState(null);
    const [selectedType, setProductType] = useState(null);

    const availabilityOptions = [
        { label: "Available", value: "available" },
        { label: "Out of Stock", value: "unavailable" },
    ];
    const assetTypeOptions = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];
    const quantityOptions = [
        { label: "High to Low", value: "highToLow" },
        { label: "Low to High", value: "lowToHigh" },
    ];

    const {
        data: allAsset = [],
        isLoading: isAllAssetLoading,
        refetch: refetch_allAsset,
    } = useQuery({
        queryKey: ["allAsset", currentUserInfo?.userEmail, searchUrl],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);
            return res.data;
        },
    });

    const handleSearch = () => {
        // console.log({ title_Filter, availability_Filter, type_Filter, quantity_Filter });
        let query = ``;
        /*
title
availability
type
sort
*/
        if (title_Filter && title_Filter !== "") {
            query += `&title=${title_Filter}`;
        }

        if (availability_Filter) {
            query += `&availability=${availability_Filter}`;
        }

        if (type_Filter) {
            query += `&type=${type_Filter}`;
        }

        if (quantity_Filter) {
            query += `&sort=${quantity_Filter}`;
        }

        setSearchUrl(`/product?email=${currentUserInfo?.userEmail}${query}`);
    };

    const handleProductUpdate = (asset) => {
        let productUpdatedInfo = {
            _id: asset._id,
            productName: productName || asset?.productName,
            productQuantity: Number(productQuantity) || Number(asset?.productQuantity),
            productType: selectedType || asset?.productType,
        };

        return toast.promise(
            axiosSecure
                .post("/product/update", {
                    productInformation: productUpdatedInfo,
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response);
                    if (response.data?.acknowledged) {
                        refetch_allAsset();
                        return <b>Asset updated Successfully.</b>;
                    } else {
                        throw new Error("Failed to update asset!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to update asset!");
                }),
            {
                loading: "Updating asset...",
                success: (message) => message,
                error: (error) => <b>Failed to update asset!</b>,
            }
        );
    };

    const handleProductDelete = (asset) => {
        let assetId = asset._id;
        return toast.promise(
            axiosSecure
                .delete(
                    `/product/delete?email=${currentUserInfo?.userEmail}&targetedAssetId=${assetId}`
                )
                .then((response) => {
                    refetch_allAsset();
                    if (response.data?.acknowledged) {
                        return <b>Product Deleted!</b>;
                    } else {
                        throw new Error("Failed to delete product!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to delete product!");
                }),
            {
                loading: "Product deleting...",
                success: (message) => message,
                error: (error) => <b>Failed to delete product!</b>,
            }
        );
    };

    return (
        <div className="custom-width space-y-8">
            <SectionTitle
                data={{
                    title: "Asset List",
                    description: "Assets created by you",
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
                            <Typography>Filter & Sorting</Typography>
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
                                <Select
                                    placeholder="Sort by quantity"
                                    options={quantityOptions}
                                    onChange={(selectedOption) =>
                                        setQuantity_Filter(
                                            selectedOption ? selectedOption.value : null
                                        )
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

            {allAsset.length === 0 && !isAllAssetLoading && <Empty></Empty>}

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
                            <p>
                                Asset Type:{" "}
                                {asset?.productType === "returnable"
                                    ? "Returnable"
                                    : asset?.productType === "non_returnable"
                                    ? "Non-Returnable"
                                    : "-"}
                            </p>

                            <div className="flex gap-1">
                                Quantity:
                                {asset?.productQuantity < 1 ? (
                                    <p className="text-red-600">Out of stock!</p>
                                ) : (
                                    <p>{asset?.productQuantity}</p>
                                )}
                            </div>
                            <p>
                                Added Date:{" "}
                                {moment.utc(asset?.productAddDate).format("DD MMM YYYY")}
                            </p>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setActionStage(asset);
                                    setModalOpen_update(true);
                                }}
                            >
                                Update
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    setActionStage(asset);
                                    setModalOpen_delete(true);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL : Product Update*/}
            <Modal
                open={modalOpen_update}
                onClose={() => {
                    setActionStage({});
                    setModalOpen_update(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="space-y-6 px-4 md:px-0">
                        <div className="text-xl text-[--warning] font-semibold">
                            Update the Asset
                        </div>

                        <div className="flex flex-col space-y-4">
                            <TextField
                                id="outlined-basic"
                                label="Product Name"
                                variant="outlined"
                                onChange={(event) => setProductName(event.target.value)}
                                defaultValue={actionStage.productName}
                            />
                            <TextField
                                id="outlined-number"
                                label="Quantity"
                                type="number"
                                onChange={(event) => setProductQuantity(event.target.value)}
                                defaultValue={actionStage.productQuantity}
                            />

                            <Select
                                placeholder="Select Type"
                                options={assetTypeOptions}
                                onChange={(selectedOption) =>
                                    setProductType(selectedOption ? selectedOption.value : null)
                                }
                                defaultValue={
                                    actionStage.productType === "returnable"
                                        ? assetTypeOptions[0]
                                        : assetTypeOptions[1]
                                }
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleProductUpdate(actionStage);
                                    setModalOpen_update(false);
                                    setActionStage({});
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>

            {/* MODAL : Product Delete*/}
            <Modal
                open={modalOpen_delete}
                onClose={() => {
                    setActionStage({});
                    setModalOpen_delete(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="space-y-6 px-4 md:px-0">
                        <div className="text-xl text-[--warning] font-semibold">
                            Do you really want to delete the asset?
                        </div>
                        <div className="text-base font-bold">
                            {" "}
                            <ArrowRightIcon />
                            {actionStage?.productName}
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleProductDelete(actionStage);
                                    setModalOpen_delete(false);
                                    setActionStage({});
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Helmet>
                <title>Asset List - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default AllAsset;
