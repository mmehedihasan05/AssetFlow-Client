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

const AllAsset = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [title_Filter, setTitle_Filter] = useState(null);
    const [availability_Filter, setAvailability_Filter] = useState(null);
    const [type_Filter, setType_Filter] = useState(null);
    const [quantity_Filter, setQuantity_Filter] = useState(null);
    const [searchUrl, setSearchUrl] = useState(`/product?email=${currentUserInfo?.userEmail}`);
    const axiosSecure = useAxiosSecure();

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

    const { data: allAsset = [], isLoading: isAllAssetLoading } = useQuery({
        queryKey: ["allAsset", currentUserInfo?.userEmail, searchUrl],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);
            return res.data;
        },
    });

    const handleSearch = () => {
        console.log({ title_Filter, availability_Filter, type_Filter, quantity_Filter });
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

    return (
        <div className="custom-width space-y-8">
            <SectionTitle data={{ title: "Asset List", noBorder: false }}></SectionTitle>

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

            {/* Asset List */}
            <div className="grid grid-cols-3 gap-4">
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
                            <Button variant="contained">Update</Button>

                            <Button variant="contained" color="error">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllAsset;
