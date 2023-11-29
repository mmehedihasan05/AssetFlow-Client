import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import DataLoading from "../../Components/DataLoading";
import PopularRequest from "../../Components/PopularRequest";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Employee_Home = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const [searchUrl, setSearchUrl] = useState(
        `/product/request/list?email=${currentUserInfo?.userEmail}`
    );
    const axiosSecure = useAxiosSecure();

    const [monthlyRequests, setMonthlyRequests] = useState([]);
    const [pendingRequests, setpendingRequests] = useState([]);
    const [frequentlyRequested, setfrequentlyRequested] = useState([]);

    // Pending requests
    const {
        data: allRequestedAsset = [],
        isLoading: isAllRequestedAssetLoading,
        refetch: allRequestedAsset_refetch,
    } = useQuery({
        queryKey: ["allRequestedAsset", currentUserInfo?.userEmail],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(searchUrl);

            let assets = res.data;

            // Pending request
            let tempPending = assets.filter((asset) => asset.approvalStatus === "pending");
            console.log(tempPending);
            setpendingRequests(tempPending);

            // Monthly requests
            let tempMonthlyRequests = assets.filter((asset) => {
                const storedMonth = new Date(asset?.requestedDate).getMonth() + 1;
                const currentMonth = new Date().getMonth() + 1;
                if (storedMonth === currentMonth) {
                    return asset;
                }
            });
            let sortedMonthlyRequests = tempMonthlyRequests.sort((a, b) => {
                const dateA = new Date(a.requestedDate);
                const dateB = new Date(b.requestedDate);
                return dateB - dateA;
            });
            setMonthlyRequests(sortedMonthlyRequests);

            // frequently requests
            let chekedProductIds = [];
            let uniqueRequestedItems = []; // if items requested more than 1 time, in this array it will store for only one time.
            assets.forEach((asset01) => {
                let totalRequested = 0;

                if (!chekedProductIds.includes(asset01.productId)) {
                    assets.forEach((asset02) => {
                        if (asset02.productId === asset01.productId) {
                            totalRequested++;
                        }
                    });

                    chekedProductIds.push(asset01.productId);
                    asset01.totalRequested = totalRequested;
                    uniqueRequestedItems.push(asset01);
                }
            });
            let tempFrequentlyRequested = uniqueRequestedItems.sort(
                (a, b) => b.totalRequested - a.totalRequested
            );

            setfrequentlyRequested(tempFrequentlyRequested.slice(0, 4));

            return tempPending;
        },
    });

    // console.log("frequentlyRequested 2", allRequestedAsset);
    console.log("frequentlyRequested", frequentlyRequested);

    return (
        <div className="space-y-16">
            {/* My Custom Requests */}
            {/* <div></div> */}

            {/* My pending requests */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "My pending requests",
                        description: "Track pending requests",
                    }}
                ></SectionTitle>

                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

                {/* Assets List  */}
                <div className="grid grid-cols-3 gap-4">
                    {pendingRequests.map((asset, idx) => (
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
                                    <p className="capitalize font-semibold">
                                        {asset?.approvalStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* My mothly requests */}
            <div className="space-y-8 ">
                <SectionTitle
                    data={{
                        title: "My Monthly requests",
                        description: "View your monthly requested assets",
                    }}
                ></SectionTitle>
                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

                {/* Assets List  */}
                <div className="grid grid-cols-3 gap-4">
                    {monthlyRequests.map((asset, idx) => (
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
                                    <p className="capitalize font-semibold">
                                        {asset?.approvalStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Frequently Requested Items */}
            <div className="space-y-8 ">
                <SectionTitle
                    data={{
                        title: "Frequently Requested Items",
                        description: "Explore your popular requests",
                    }}
                ></SectionTitle>
                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

                <div className="grid grid-cols-3 gap-4">
                    {frequentlyRequested.map((asset, idx) => (
                        <PopularRequest key={idx} asset={asset}></PopularRequest>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Employee_Home;
