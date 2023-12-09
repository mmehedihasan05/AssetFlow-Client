import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../AuthProvider";
import AssetCardHr from "../../Components/Cards/AssetCardHr";
import DataLoading from "../../Components/DataLoading";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import toast from "react-hot-toast";
import CustomRequestInfo from "../../Components/Cards/CustomRequestInfo";
import Empty from "../../Components/Empty";

const CustomRequestList = ({ title = null, description = null, onlyPending = false }) => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [customAssets, setCustomAssets] = useState([]);

    const {
        data: customAssets_ = [],
        isLoading: iscustomAssetsLoading,
        refetch: customAssets_refetch,
    } = useQuery({
        queryKey: ["customRequestList", currentUserInfo?.userEmail],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(
                `/custom-product/list?email=${currentUserInfo?.userEmail}`
            );

            if (onlyPending) {
                let temp = res.data.filter((asset) => asset.approvalStatus === "pending");
                setCustomAssets(temp);
            } else {
                setCustomAssets(res.data);
            }
            return res.data;
        },
    });

    const handleApprove = (asset) => {
        // console.log(asset);
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
                    title: title || "Custom requests",
                    noBorder: false,
                    description: description || (
                        <>
                            Custom assets requested <br /> by your employees
                        </>
                    ),
                }}
            ></SectionTitle>
            {iscustomAssetsLoading && <DataLoading></DataLoading>}

            {customAssets_.length === 0 && !iscustomAssetsLoading && <Empty></Empty>}

            {/* Assets List Loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                {customAssets.map((asset, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-xl p-6 rounded-md space-y-6 flex flex-col"
                    >
                        <CustomRequestInfo asset={asset}></CustomRequestInfo>
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
