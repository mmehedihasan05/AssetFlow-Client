const PopularRequest = ({ asset }) => {
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
                    Total Requested:{" "}
                    <p className="capitalize font-semibold">{asset?.totalRequested} times</p>
                </div>
            </div>
        </div>
    );
};

export default PopularRequest;
