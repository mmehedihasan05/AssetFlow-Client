const LimitedStockViewer = ({ limitedStock }) => {
    return (
        <div>
            <ul className="space-y-4 text-xl font-medium">
                {/* productName, productType, productQuantity */}
                {limitedStock.map((asset, idx) => (
                    <li
                        key={idx}
                        className="flex gap-8 items-center
                                 border-b px-2 py-4 bg-white shadow-md rounded-lg hover:bg-blue-50"
                    >
                        <div className="flex-1 pl-4">{asset.productName}</div>
                        <div className="capitalize w-[20%] text-center">
                            {asset.productType === "non_returnable"
                                ? "Non Returnable"
                                : "Returnable"}
                        </div>
                        <div className="w-[20%] text-center">
                            {asset.productQuantity < 1 ? (
                                <span className="text-red-600">Out of Stock</span>
                            ) : (
                                asset.productQuantity
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LimitedStockViewer;
