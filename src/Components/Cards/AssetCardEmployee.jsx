import { Button } from "@mui/material";
import moment from "moment";
import { useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AssetCardEmployee = ({
    asset,
    allRequestedAsset_refetch,
    setModalOpen,
    setRequestStage,
    button = false,
}) => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

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

    const handleReturn = (asset) => {
        // remove from db and add

        return toast.promise(
            axiosSecure
                .post("/product/request/return", {
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
                        return <b>Product returned!</b>;
                    } else {
                        throw new Error("Failed to rett=urn!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to rett=urn!");
                }),
            {
                loading: "Product returning...",
                success: (message) => message,
                error: (error) => <b>Failed to return!</b>,
            }
        );
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
                <Button
                    variant="contained"
                    onClick={() => {
                        setRequestStage(asset);
                        setModalOpen(true);
                    }}
                    color="secondary"
                >
                    Print Details
                </Button>
            );
            // return <Print></Print>;
        } else if (asset?.approvalStatus === "approved" && asset?.productType === "returnable") {
            return (
                <Button variant="contained" onClick={() => handleReturn(asset)}>
                    Return Asset
                </Button>
            );
        } else if (asset?.approvalStatus === "returned") {
            return (
                <Button variant="contained" disabled={true} onClick={() => handleReturn(asset)}>
                    Returned
                </Button>
            );
        }
    };

    return (
        <div className="bg-white shadow-xl p-6 rounded-md space-y-6 flex flex-col">
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

            {button && <div className="flex justify-center">{buttonAction(asset)}</div>}
        </div>
    );
};

export default AssetCardEmployee;
