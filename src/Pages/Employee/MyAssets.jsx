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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import DataLoading from "../../Components/DataLoading";
import moment from "moment";
import { PDFViewer } from "@react-pdf/renderer";
import Print from "../../Components/Print";
import toast from "react-hot-toast";

const MyAssets = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [title_Filter, setTitle_Filter] = useState(null);
    const [requestStatus_Filter, setRequestSatus_Filter] = useState(null);
    const [type_Filter, setType_Filter] = useState(null);
    const [searchUrl, setSearchUrl] = useState(
        `/product/request/list?email=${currentUserInfo?.userEmail}`
    );
    const axiosSecure = useAxiosSecure();

    const [actionButton, setActionButton] = useState("");

    const requestStatusOptions = [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
    ];
    const assetTypeOptions = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];

    const {
        data: allRequestedAsset = [],
        isLoading: isAllRequestedAssetLoading,
        refetch: allRequestedAsset_refetch,
    } = useQuery({
        queryKey: ["allRequestedAsset", currentUserInfo?.userEmail, searchUrl],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);
            return res.data;
        },
    });

    useEffect(() => {
        console.log("searchUrl ", { searchUrl });
        console.log("server res ", allRequestedAsset);
    }, [searchUrl, allRequestedAsset]);

    const handleSearch = () => {
        // console.log({ title_Filter, requestStatus_Filter, type_Filter });
        let query = ``;

        if (title_Filter && title_Filter !== "") {
            query += `&title=${title_Filter}`;
        }

        if (requestStatus_Filter) {
            query += `&requestStatus=${requestStatus_Filter}`;
        }

        if (type_Filter) {
            query += `&type=${type_Filter}`;
        }

        setSearchUrl(`/product/request/list?email=${currentUserInfo?.userEmail}${query}`);
    };

    const handleProductRequest = () => {};

    const handleRequestCancel = (asset) => {
        // Just remove from database
        // /product/request/cancel?email=${currentUserInfo?.userEmail}&targetedAssetId={asset._id}

        let assetId = asset._id;
        console.log(asset);
        return toast.promise(
            axiosSecure
                .delete(
                    `/product/request/cancel?email=${currentUserInfo?.userEmail}&targetedAssetId=${assetId}`
                )
                .then((response) => {
                    allRequestedAsset_refetch();
                    if (response.data?.acknowledged) {
                        return <b>Request Canceled!</b>;
                    } else {
                        throw new Error("Failed to cancel request!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to cancel request!");
                }),
            {
                loading: "Request cancelling...",
                success: (message) => message,
                error: (error) => <b>Failed to cancel request!</b>,
            }
        );
    };
    const handlePrint = () => {};
    const handleReturn = () => {
        // remove from db and add
    };

    const buttonAction = (asset) => {
        if (asset?.approvalStatus === "pending") {
            return (
                <Button variant="contained" onClick={() => handleRequestCancel(asset)}>
                    Cancel Request
                </Button>
            );
        } else if (
            asset?.approvalStatus === "approved" &&
            asset?.productType === "non_returnable"
        ) {
            return (
                <Button variant="contained" onClick={() => handlePrint(asset)}>
                    Print Details
                </Button>
            );
        } else if (asset?.approvalStatus === "approved" && asset?.productType === "returnable") {
            return (
                <Button variant="contained" onClick={() => handleReturn(asset)}>
                    Return Asset
                </Button>
            );
        }
    };
    return (
        <div className="custom-width  space-y-8">
            <SectionTitle data={{ title: "My Requested Assets", noBorder: false }}></SectionTitle>

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
                                    placeholder="Filter by Request Status"
                                    options={requestStatusOptions}
                                    onChange={(selectedOption) =>
                                        setRequestSatus_Filter(
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

            {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

            {/* Assets List Loading */}
            <div className="grid grid-cols-3 gap-4">
                {allRequestedAsset.map((asset, idx) => (
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
                                Requested Date:{" "}
                                <p className="font-semibold">
                                    {moment.utc(asset?.requestedDate).format("DD MMM YYYY")}
                                </p>
                            </div>

                            <div className="flex gap-1">
                                Approval Date:{" "}
                                <p className="font-semibold">
                                    {asset?.approvalDate
                                        ? moment.utc(asset?.approvalDate).format("DD MMM YYYY")
                                        : "-"}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                Request Status:{" "}
                                <p className="capitalize font-semibold">{asset?.approvalStatus}</p>
                            </div>
                        </div>

                        <div className="flex justify-center">{buttonAction(asset)}</div>
                    </div>
                ))}
            </div>

            {/* <PDFViewer>
                <Print />
            </PDFViewer> */}
        </div>
    );
};

export default MyAssets;
