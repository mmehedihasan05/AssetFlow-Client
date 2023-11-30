// urgency level and deadline productDeliveryDeadline productUrgencyLevel

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import moment from "moment";

const CustomRequestInfo = ({ asset, extra = true }) => {
    return (
        <div className="space-y-4">
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
            <div className=" space-y-4 md:space-y-2 font-medium flex-1">
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

                <div className="flex gap-1 flex-col md:flex-row">
                    Reason : <p className="font-semibold">{asset.productNotes || "-"}</p>
                </div>
                <div className="flex gap-1 capitalize">
                    Urgency Level :{" "}
                    <p className="font-semibold">{asset.productUrgencyLevel || "-"}</p>
                </div>
                <div className="flex gap-1 flex-col md:flex-row">
                    Delivery Deadline :{" "}
                    <p className="font-semibold">
                        {asset.productDeliveryDeadline
                            ? moment.utc(asset?.productDeliveryDeadline).format("DD MMM YYYY")
                            : "-"}
                    </p>
                </div>

                {extra && (
                    <>
                        <div className="flex gap-1 flex-col md:flex-row">
                            Requester Name : <p className="font-semibold">{asset.userFullName}</p>
                        </div>
                        <div className="flex gap-1 flex-col md:flex-row">
                            Requester Email : <p className="font-semibold">{asset.userEmail}</p>
                        </div>
                    </>
                )}

                <div className="flex gap-1 flex-col md:flex-row">
                    Requested Date:{" "}
                    <p className="font-semibold">
                        {moment.utc(asset?.requestedDate).format("DD MMM YYYY")}
                    </p>
                </div>

                <div className="flex gap-1">
                    Status : <p className="font-semibold capitalize">{asset.approvalStatus}</p>
                </div>
            </div>
        </div>
    );
};

export default CustomRequestInfo;
