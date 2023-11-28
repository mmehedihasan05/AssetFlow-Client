import SectionTitle from "../../Components/SectionTitle";
import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import { AuthContext } from "../../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DataLoading from "../../Components/DataLoading";
import moment from "moment";
import toast from "react-hot-toast";

const AllRequests = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [nameEmail_search, setNameEmail_search] = useState(null);
    const [searchUrl, setSearchUrl] = useState(
        `/product/request/list?email=${currentUserInfo?.userEmail}`
    );

    const {
        data: allRequestedAsset = [],
        isLoading: isAllRequestedAssetLoading,
        refetch: allRequestedAsset_refetch,
    } = useQuery({
        queryKey: ["allRequestedAsset", "v2", currentUserInfo?.userEmail, searchUrl],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);
            return res.data;
        },
    });

    const handleSearch = () => {
        // console.log({ title_Filter, requestStatus_Filter, type_Filter });
        let query = ``;

        if (nameEmail_search) {
            query += `&nameEmailSearch=${nameEmail_search}`;
        }

        setSearchUrl(`/product/request/list?email=${currentUserInfo?.userEmail}${query}`);
    };

    const handleApprove = (asset) => {
        console.log(asset);
        // _id: asset._id, eta product request id

        return toast.promise(
            axiosSecure
                .post("/product/request/approve", {
                    productInfo: {
                        _id: asset._id,
                        approvalDate: new Date(),
                        productId: asset.productId,
                    },
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        allRequestedAsset_refetch();
                        return <b>Product approved!</b>;
                    } else {
                        throw new Error("Failed to approve!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to approve!");
                }),
            {
                loading: "Request sending...",
                success: (message) => message,
                error: (error) => <b>Failed to approve!</b>,
            }
        );
    };
    const handleReject = (asset) => {
        return toast.promise(
            axiosSecure
                .post("/product/request/reject", {
                    productInfo: { _id: asset._id },
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        allRequestedAsset_refetch();
                        return <b>Product rejected!</b>;
                    } else {
                        throw new Error("Failed to reject!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to reject!");
                }),
            {
                loading: "Request sending...",
                success: (message) => message,
                error: (error) => <b>Failed to reject!</b>,
            }
        );
    };

    return (
        <div className="custom-width space-y-8">
            <SectionTitle data={{ title: "All Requests" }}></SectionTitle>

            {/* Search and Filter */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <TextField
                        id="outlined-basic"
                        label="Search By Employee Name or Email"
                        variant="outlined"
                        sx={{ width: "100%" }}
                        onChange={(event) => setNameEmail_search(event.target.value)}
                    />
                </div>
                <div className="flex justify-center">
                    <Button variant="contained" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </div>

            {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

            {/* Assets List Loading */}
            <div className="grid grid-cols-2 gap-4">
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
                                Requester Name :{" "}
                                <p className="font-semibold">{asset.userFullName}</p>
                            </div>
                            <div className="flex gap-1">
                                Requester Email : <p className="font-semibold">{asset.userEmail}</p>
                            </div>

                            <div className="flex gap-1">
                                Requested Date:{" "}
                                <p className="font-semibold">
                                    {moment.utc(asset?.requestedDate).format("DD MMM YYYY")}
                                </p>
                            </div>

                            <div className="flex gap-1">
                                Additional Notes :{" "}
                                <p className="font-semibold">{asset.additionalNotes || "-"}</p>
                            </div>

                            <div className="flex gap-1">
                                Status :{" "}
                                <p className="font-semibold capitalize">{asset.approvalStatus}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button
                                variant="contained"
                                color="error"
                                disabled={
                                    asset.approvalStatus === "approved" ||
                                    asset.approvalStatus === "rejected"
                                }
                                onClick={() => handleReject(asset)}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="contained"
                                disabled={asset.approvalStatus === "approved"}
                                onClick={() => handleApprove(asset)}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Print Modal */}
        </div>
    );
};

export default AllRequests;
