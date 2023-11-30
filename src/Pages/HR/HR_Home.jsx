/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import DataLoading from "../../Components/DataLoading";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Chart } from "react-google-charts";
import AssetCardHr from "../../Components/Cards/AssetCardHr";
import MinimalCard from "../../Components/Cards/MinimalCard";
import LimitedStockViewer from "../../Components/LimitedStockViewer";
import Empty from "../../Components/Empty";
import toast from "react-hot-toast";
import CustomRequestList from "./CustomRequestList";

const options = {
    title: "Asset Request Comparision",
};

const HR_Home = () => {
    let { currentUserInfo, isNewSignupHR, setIsNewSignupHR } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [searchUrl, setSearchUrl] = useState(
        `/product/request/list?email=${currentUserInfo?.userEmail}`
    );
    const [requestedAssets, setRequestedAssets] = useState([]);
    const [topRequested, setTopRequested] = useState([]);
    const [assetTypeData, setAssetTypeData] = useState([
        ["Type", "Total"],
        ["Returnable Asset", 0],
        ["Non-Returnable Asset", 0],
    ]);

    const [requestTypeData, setRequestTypeData] = useState([
        ["Request", "Total"],
        ["Company Provided Assets", 0],
        ["Custom Requested Assets", 0],
    ]);

    const navigate = useNavigate();

    // Requested Assets
    const {
        data: allRequestedAsset = [],
        isLoading: isAllRequestedAssetLoading,
        refetch: allRequestedAsset_refetch,
    } = useQuery({
        queryKey: ["allRequestedAsset", "v5", currentUserInfo?.userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(searchUrl);
            let assets = res.data;
            // Pending requests (max: 5 items)
            let tempPendingRequest = assets
                .reverse()
                .filter((asset) => asset.approvalStatus === "pending");
            setRequestedAssets(tempPendingRequest.slice(0, 5));

            // Top most requested items (max: 4 items)
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

            let tempMostRequested = uniqueRequestedItems.sort(
                (a, b) => b.totalRequested - a.totalRequested
            );

            setTopRequested(tempMostRequested.slice(0, 4));

            // Asset Request Comparison
            // Make a pie chart for the total percentage of returnable items and non-returnable items requested by the employee.
            let totalReturnableRequests = assets.filter(
                (asset) => asset.productType === "returnable"
            ).length;
            let totalNon_returnableRequests = assets.length - totalReturnableRequests;
            setAssetTypeData([
                ["Asset Type", "Amount"],
                ["Returnable Asset", totalReturnableRequests],
                ["Non-Returnable Asset", totalNon_returnableRequests],
            ]);

            return res.data;
        },
    });

    // All assets listed by HR
    const { data: limitedStock = [], isLoading: islimitedStockLoading } = useQuery({
        queryKey: ["limitedStock", currentUserInfo?.userEmail],
        queryFn: async () => {
            // ?email=${currentUser?.email}
            const res = await axiosSecure.get(
                `/product/limited-stock?email=${currentUserInfo?.userEmail}`
            );
            return res.data.limitedStock;
        },
    });

    // Total Custom Requests
    const { data: customRequestsCount = 0 } = useQuery({
        queryKey: ["customRequestsCount", currentUserInfo?.userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/custom-product/list?email=${currentUserInfo?.userEmail}`
            );

            return res.data.length;
        },
    });

    useEffect(() => {
        setRequestTypeData([
            ["Request", "Total"],
            ["Company Provided Assets", allRequestedAsset.length],
            ["Custom Requested Assets", customRequestsCount],
        ]);
    }, [allRequestedAsset, customRequestsCount]);

    useEffect(() => {
        if (isNewSignupHR) {
            setIsNewSignupHR(false);
            return navigate("/payment");
        } else if (currentUserInfo?.currentMemberShipLimit === 0) {
            return navigate("/payment");
        }
    }, []);

    return (
        <div className="space-y-16">
            {/* All Requests */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "All Requests",
                        description: "Assets requests from your employees",
                    }}
                ></SectionTitle>
                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}
                {requestedAssets.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestedAssets.map((asset, idx) => (
                        <AssetCardHr
                            key={idx}
                            asset={asset}
                            allAssetRefetch={allRequestedAsset_refetch}
                        ></AssetCardHr>
                    ))}
                </div>
            </div>

            {/* Custom Pending Request */}
            <CustomRequestList
                title="Pending Custom Requests"
                description="Custom Pending Requests from your employees"
                onlyPending={true}
            ></CustomRequestList>

            {/* Top requested items */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "Top Requested Assets",
                        description: "Assets that requested most",
                    }}
                ></SectionTitle>
                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}
                {topRequested.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topRequested.map((asset, idx) => (
                        <MinimalCard key={idx} asset={asset}></MinimalCard>
                    ))}
                </div>
            </div>

            {/* Limited Stock items */}
            <div className="space-y-8 ">
                <SectionTitle
                    data={{
                        title: "Limited Stock Assets",
                        description: "Assets with limited availability ",
                    }}
                ></SectionTitle>
                {islimitedStockLoading && <DataLoading></DataLoading>}
                {limitedStock.length === 0 && !islimitedStockLoading && <Empty></Empty>}

                <LimitedStockViewer limitedStock={limitedStock}></LimitedStockViewer>
            </div>

            {/* Asset Request Comparison Pie Chart : Returnable vs Non Returnable */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "Asset Types Overview",
                        description: (
                            <>
                                Visualizing Returnable vs Non-returnable <br /> Asset Requests in
                                Percentage
                            </>
                        ),
                    }}
                ></SectionTitle>

                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

                {allRequestedAsset.length === 0 && !isAllRequestedAssetLoading ? (
                    <Empty></Empty>
                ) : (
                    <Chart
                        chartType="PieChart"
                        data={assetTypeData}
                        options={{
                            title: "Asset Type Comparision",
                        }}
                        width={"100%"}
                        height={"400px"}
                    />
                )}
            </div>

            {/* Asset Request Comparison Pie Chart : Company Provided Vs Custom */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "Asset Request Comparison",
                        description: (
                            <>
                                Comparing Custom vs. Company-Provided <br /> Asset Requests in
                                Percentage
                            </>
                        ),
                    }}
                ></SectionTitle>

                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

                {allRequestedAsset.length === 0 && !isAllRequestedAssetLoading ? (
                    <Empty></Empty>
                ) : (
                    <Chart
                        chartType="PieChart"
                        data={requestTypeData}
                        options={{
                            title: "Asset Request Comparision",
                            pieStartAngle: 100,
                            colors: ["#3D30A2", "#B15EFF", "#FBBC05", "#EA4335"],
                        }}
                        width={"100%"}
                        height={"400px"}
                    />
                )}
            </div>
        </div>
    );
};

export default HR_Home;
