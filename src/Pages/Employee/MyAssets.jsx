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

const MyAssets = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [title_Filter, setTitle_Filter] = useState(null);
    const [availability_Filter, setRequestSatus_Filter] = useState(null);
    const [type_Filter, setType_Filter] = useState(null);
    const [searchUrl, setSearchUrl] = useState(`/product?email=${currentUserInfo?.userEmail}`);
    const axiosSecure = useAxiosSecure();

    const [modalOpen, setModalOpen] = useState(false);
    const [requestStage, setRequestStage] = useState({});
    const [additionalNotes, setAdditionalNotes] = useState("");

    const requestStatusOptions = [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "panding" },
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

    console.log("allAsset", allAsset);

    const handleSearch = () => {
        console.log({ title_Filter, availability_Filter, type_Filter });
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

    const handleProductRequest = () => {};

    return (
        <div className="custom-width  space-y-8">
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

            {isAllAssetLoading && <DataLoading></DataLoading>}

            {/* Assets List Loading */}
            <div></div>

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
                    <div className="space-y-6">
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
        </div>
    );
};

export default MyAssets;
