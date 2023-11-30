import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import DataLoading from "../../Components/DataLoading";
import SectionTitle from "../../Components/SectionTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Chart } from "react-google-charts";
import AssetCardHr from "../../Components/Cards/AssetCardHr";
import MinimalCard from "../../Components/Cards/MinimalCard";
import LimitedStockViewer from "../../Components/LimitedStockViewer";

const options = {
    title: "Asset Request Comparision",
};

const HR_Home = () => {
    let { currentUserInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [searchUrl, setSearchUrl] = useState(
        `/product/request/list?email=${currentUserInfo?.userEmail}`
    );
    const [requestedAssets, setRequestedAssets] = useState([]);
    const [topRequested, setTopRequested] = useState([]);
    const [assetTypeData, setAssetTypeData] = useState([
        ["Task", "Hours per Day"],
        ["Returnable Asset", 0],
        ["Non-Returnable Asset", 0],
    ]);

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
            setRequestedAssets(assets.reverse().slice(0, 5));

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

                <div className="grid grid-cols-2 gap-4">
                    {requestedAssets.map((asset, idx) => (
                        <AssetCardHr
                            key={idx}
                            asset={asset}
                            allAssetRefetch={allRequestedAsset_refetch}
                        ></AssetCardHr>
                    ))}
                </div>
            </div>

            {/* Top requested items */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "Top Requested Assets",
                        description: "Assets that requested most",
                    }}
                ></SectionTitle>
                {isAllRequestedAssetLoading && <DataLoading></DataLoading>}

                <div className="grid grid-cols-2 gap-4">
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

                <LimitedStockViewer limitedStock={limitedStock}></LimitedStockViewer>
            </div>

            {/* Asset Request Comparison Pie Chart */}
            <div className="space-y-8">
                <SectionTitle
                    data={{
                        title: "Asset Request Comparision",
                        description: (
                            <>
                                Visualizing Returnable vs Non-returnable <br /> Asset Requests in
                                Percentage
                            </>
                        ),
                    }}
                ></SectionTitle>
                {isAllRequestedAssetLoading ? (
                    <DataLoading></DataLoading>
                ) : (
                    <Chart
                        chartType="PieChart"
                        data={assetTypeData}
                        options={options}
                        width={"100%"}
                        height={"400px"}
                    />
                )}
            </div>
        </div>
    );
};

export default HR_Home;
