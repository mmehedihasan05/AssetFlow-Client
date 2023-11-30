import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import AssetCardEmployee from "../../Components/Cards/AssetCardEmployee";
import CustomRequestEmployee from "../../Components/Cards/CustomRequestEmployee";
import MinimalCard from "../../Components/Cards/MinimalCard";
import DataLoading from "../../Components/DataLoading";
import Empty from "../../Components/Empty";
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

    // Custom Requests
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

    // console.log("frequentlyRequested 2", allRequestedAsset);
    console.log("frequentlyRequested", frequentlyRequested);

    return (
        <div className="space-y-16">
            {/* My Custom Requests */}
            {customAssets.length !== 0 && (
                <div className="space-y-8">
                    <SectionTitle
                        data={{
                            title: "My Custom Requests",
                            description: "Track custom requests",
                        }}
                    ></SectionTitle>

                    {iscustomAssetsLoading && <DataLoading></DataLoading>}

                    {/* Assets List  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customAssets.map((asset, idx) => (
                            <CustomRequestEmployee
                                key={idx}
                                asset={asset}
                                customAssets_refetch={customAssets_refetch}
                            ></CustomRequestEmployee>
                        ))}
                    </div>
                </div>
            )}

            {/* My pending requests */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "My pending requests",
                        description: "Track pending requests",
                    }}
                ></SectionTitle>

                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}
                {pendingRequests.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}

                {/* Assets List  */}
                <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                    {pendingRequests.map((asset, idx) => (
                        <AssetCardEmployee key={idx} asset={asset}></AssetCardEmployee>
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

                {monthlyRequests.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}

                {/* Assets List  */}
                <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                    {monthlyRequests.map((asset, idx) => (
                        <AssetCardEmployee key={idx} asset={asset}></AssetCardEmployee>
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
                {frequentlyRequested.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}

                <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                    {frequentlyRequested.map((asset, idx) => (
                        <MinimalCard key={idx} asset={asset}></MinimalCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Employee_Home;
