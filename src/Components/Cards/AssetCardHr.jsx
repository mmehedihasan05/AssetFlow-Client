import { Button } from "@mui/material";
import moment from "moment";
import { useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AssetCardHr = ({ asset, allAssetRefetch }) => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

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
                        allAssetRefetch();
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
                        allAssetRefetch();
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
        <div className="bg-white shadow-xl p-6 rounded-md space-y-6 flex flex-col">
            <div>
                <h2 className="text-2xl font-semibold">{asset.productName}</h2>
            </div>
            <div className="space-y-4 md:space-y-2 font-medium flex-1">
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

                <div className="flex gap-1 flex-col md:flex-row">
                    Requester Name : <p className="font-semibold">{asset.userFullName}</p>
                </div>
                <div className="flex gap-1 flex-col md:flex-row">
                    Requester Email : <p className="font-semibold">{asset.userEmail}</p>
                </div>

                <div className="flex gap-1 flex-col md:flex-row">
                    Requested Date:{" "}
                    <p className="font-semibold">
                        {moment.utc(asset?.requestedDate).format("DD MMM YYYY")}
                    </p>
                </div>

                <div className="flex gap-1 flex-col md:flex-row">
                    Additional Notes :{" "}
                    <p className="font-semibold">{asset.additionalNotes || "-"}</p>
                </div>

                <div className="flex gap-1">
                    Status : <p className="font-semibold capitalize">{asset.approvalStatus}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <Button
                    variant="contained"
                    color="error"
                    disabled={
                        asset.approvalStatus === "approved" || asset.approvalStatus === "rejected"
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
    );
};

export default AssetCardHr;
