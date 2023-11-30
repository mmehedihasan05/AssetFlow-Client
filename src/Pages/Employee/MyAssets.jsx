import SectionTitle from "../../Components/SectionTitle";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "@mui/material/Button";
import { Box, Modal, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Select from "react-select";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import DataLoading from "../../Components/DataLoading";
import moment from "moment";
import { PDFViewer } from "@react-pdf/renderer";
import toast from "react-hot-toast";
import Print from "../../Components/Print";
import { Helmet } from "react-helmet-async";
import AssetCardEmployee from "../../Components/Cards/AssetCardEmployee";
import Empty from "../../Components/Empty";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    width: "70vw",
    height: "90vh",
};
const currentDate = new Date().toLocaleString();

const MyAssets = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [title_Filter, setTitle_Filter] = useState(null);
    const [requestStatus_Filter, setRequestSatus_Filter] = useState(null);
    const [type_Filter, setType_Filter] = useState(null);
    const [searchUrl, setSearchUrl] = useState(
        `/product/request/list?email=${currentUserInfo?.userEmail}`
    );
    const axiosSecure = useAxiosSecure();

    const [modalOpen, setModalOpen] = useState(false);
    const [requestStage, setRequestStage] = useState({});
    const [actionButton, setActionButton] = useState("");
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
        queryKey: ["allRequestedAsset", "v1", currentUserInfo?.userEmail, searchUrl],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);
            return res.data;
        },
    });

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

    return (
        <div className="custom-width  space-y-8">
            <SectionTitle
                data={{
                    title: "My Assets",
                    description: "All requested items by you",
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
            {allRequestedAsset.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}

            {/* Assets List Loading */}
            <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                {allRequestedAsset.map((asset, idx) => (
                    <AssetCardEmployee
                        key={idx}
                        asset={asset}
                        allRequestedAsset_refetch={allRequestedAsset_refetch}
                        requestStage={requestStage}
                        setRequestStage={setRequestStage}
                        button={true}
                    ></AssetCardEmployee>
                ))}
            </div>

            <Helmet>
                <title>My Assets - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default MyAssets;
