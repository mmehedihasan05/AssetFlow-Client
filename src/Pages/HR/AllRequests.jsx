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
import { Helmet } from "react-helmet-async";
import AssetCardHr from "../../Components/Cards/AssetCardHr";
import Empty from "../../Components/Empty";

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

    return (
        <div className="custom-width space-y-8">
            <SectionTitle
                data={{ title: "All Requests", description: "Assets requests from your employees" }}
            ></SectionTitle>

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
            {allRequestedAsset.length === 0 && !isAllRequestedAssetLoading && <Empty></Empty>}

            {/* Assets List Loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allRequestedAsset.map((asset, idx) => (
                    <AssetCardHr
                        key={idx}
                        asset={asset}
                        allAssetRefetch={allRequestedAsset_refetch}
                    ></AssetCardHr>
                ))}
            </div>

            {/* Print Modal */}

            <Helmet>
                <title>All Requests - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default AllRequests;
