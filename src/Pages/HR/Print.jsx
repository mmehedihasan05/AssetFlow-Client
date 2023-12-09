import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "@mui/material";
import moment from "moment";

const Print = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // const assetId = queryParams.get("assetId");
    /**

/print-asset?
currentWorkingCompanyImage=${currentUserInfo?.currentWorkingCompanyImage}
currentWorkingCompanyName=${currentUserInfo?.currentWorkingCompanyName}
productName=${asset?.productName}
productId=${asset?.productId}
productType=${asset?.productType}
approvalDate=${asset?.approvalDate}
userFullName=${asset?.userEmail}}

currentWorkingCompanyImage,
currentWorkingCompanyName,
productName,
productId,
productType,
approvalDate,
userFullName,

  const assetId = queryParams.get('assetId');

 */

    const currentWorkingCompanyImage = queryParams.get("currentWorkingCompanyImage");
    const currentWorkingCompanyName = queryParams.get("currentWorkingCompanyName");
    const productName = queryParams.get("productName");
    const productId = queryParams.get("productId");
    const productType = queryParams.get("productType");
    const approvalDate = queryParams.get("approvalDate");
    const userFullName = queryParams.get("userFullName");
    const userEmail = queryParams.get("userEmail");

    // console.log("Print page", {
    //     currentWorkingCompanyImage,
    //     currentWorkingCompanyName,
    //     productName,
    //     productId,
    //     productType,
    //     approvalDate,
    //     userFullName,
    //     userEmail,
    // });

    const componentRef = useRef();

    const handlePrint_ = useReactToPrint({
        content: () => componentRef.current,
    });
    // console.log("Print page", {
    //     currentWorkingCompanyImage,
    //     currentWorkingCompanyName,
    //     productName,
    //     productId,
    //     productType,
    //     approvalDate,
    //     userFullName,
    //     userEmail,
    // });
    const currentDate = new Date().toLocaleString();

    return (
        <div>
            <div
                id="print-contents"
                ref={componentRef}
                className="flex flex-col justify-between h-[92vh] px-4 py-4 text-black"
            >
                <div>
                    <div className="flex justify-center">
                        <img src={currentWorkingCompanyImage} className="max-w-[180px]" alt="" />
                    </div>
                    <div className="space-y-4 font-medium text-xl mt-16">
                        <div className="flex gap-1 text-2xl">
                            <p>Product Name : </p>
                            <p>{productName}</p>
                        </div>
                        <div className="flex gap-1">
                            <p>Product ID : </p>
                            <p>{productId}</p>
                        </div>

                        <div className="flex gap-1">
                            <p>Product Type : </p>
                            <p className="capitalize">
                                {productType === "non_returnable" ? "Non Returnable" : "Returnable"}{" "}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Product Approval Date : </p>
                            <p>
                                {approvalDate
                                    ? moment.utc(approvalDate).format("DD MMM YYYY")
                                    : "-"}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <p>Product Issued To : </p>
                            <p>
                                {userFullName} ({userEmail})
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">{currentDate}</div>
            </div>
            <div className="flex justify-center">
                <Button variant="contained" onClick={handlePrint_} sx={{ width: "fit-content" }}>
                    Print Now
                </Button>
            </div>
        </div>
    );
};

export default Print;
