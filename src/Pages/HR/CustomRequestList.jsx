import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../AuthProvider";
import AssetCardHr from "../../Components/Cards/AssetCardHr";
import DataLoading from "../../Components/DataLoading";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import toast from "react-hot-toast";

const CustomRequestList = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const {
        data: customAssets = [],
        isLoading: iscustomAssetsLoading,
        refetch: customAssets_refetch,
    } = useQuery({
        queryKey: ["customRequestList", currentUserInfo?.userEmail],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(
                `/custom-product/list?email=${currentUserInfo?.userEmail}`
            );
            return res.data;
        },
    });

    console.log(customAssets);

    const handleApprove = (asset) => {
        console.log(asset);
        // _id: asset._id, eta product request id

        return toast.promise(
            axiosSecure
                .post("/custom-product/approve", {
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
                        customAssets_refetch();
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
                .post("/custom-product/reject", {
                    productInfo: { _id: asset._id },
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        customAssets_refetch();
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
            <SectionTitle
                data={{
                    title: "Custom requests",
                    noBorder: false,
                    description: (
                        <>
                            Custom assets requested <br /> by your employees
                        </>
                    ),
                }}
            ></SectionTitle>
            {iscustomAssetsLoading && <DataLoading></DataLoading>}

            {/* Assets List Loading */}
            <div className="grid grid-cols-3 gap-4">
                {customAssets.map((asset, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-xl p-6 rounded-md space-y-6 flex flex-col"
                    >
                        <div>
                            <img
                                src={asset.productImage}
                                className="w-full h-48 rounded-md object-contain"
                                alt=""
                            />
                        </div>
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
                                Reason :{" "}
                                <p className="font-semibold">{asset.productNotes || "-"}</p>
                            </div>

                            <div className="flex gap-1">
                                Requester Name :{" "}
                                <p className="font-semibold">{asset.userFullName}</p>
                            </div>
                            <div className="flex gap-1">
                                Requester Email : <p className="font-semibold">{asset.userEmail}</p>
                            </div>
                            {/*  */}

                            <div className="flex gap-1">
                                Requested Date:{" "}
                                <p className="font-semibold">
                                    {moment.utc(asset?.requestedDate).format("DD MMM YYYY")}
                                </p>
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
            <Helmet>
                <title>Custom Requests List - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default CustomRequestList;
