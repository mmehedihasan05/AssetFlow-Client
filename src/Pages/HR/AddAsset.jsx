import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import SectionTitle from "../../Components/SectionTitle";
import Select from "react-select";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../AuthProvider";

const AddAsset = () => {
    const axiosSecure = useAxiosSecure();
    let { currentUserInfo } = useContext(AuthContext);
    const [productName, setProductName] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [selectedType, setProductType] = useState("");

    const types = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];

    const handleAddProduct = (e) => {
        e.preventDefault();

        /*
        productName,
        productQuantity,
        productType
        
        productAddDate:
        productAddedBy: ""
        productSource: "company"
        */

        const productInformation = {
            productName,
            productQuantity,
            selectedType,
            productAddDate: new Date(),
            productAddedBy: currentUserInfo?.userEmail,
            productSource: currentUserInfo?.userRole,
        };

        console.log();

        // Uploading blog data to server
        return toast.promise(
            axiosSecure
                .post("/product/add", { productInformation: productInformation })
                .then((response) => {
                    // console.log(response.data);
                    if (response.data?.acknowledged) {
                        e.target.reset();
                        return <b>Product Added Successfully.</b>;
                    } else {
                        throw new Error("Failed to add product!");
                    }
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to add product!");
                }),
            {
                loading: "Adding product...",
                success: (message) => message,
                error: (error) => <b>Failed to add product!</b>,
            }
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 mb-8">
            <SectionTitle data={{ title: "Add an Asset", noBorder: false }}></SectionTitle>
            <form onSubmit={handleAddProduct} className="flex flex-col space-y-4">
                <TextField
                    id="outlined-basic"
                    label="Product Name"
                    variant="outlined"
                    onChange={(event) => setProductName(event.target.value)}
                    required
                />
                <TextField
                    id="outlined-number"
                    label="Quantity"
                    type="number"
                    onChange={(event) => setProductQuantity(event.target.value)}
                    required
                />

                <Select
                    placeholder="Select Type"
                    options={types}
                    onChange={setProductType}
                    required
                />

                <Button variant="contained" type="submit">
                    Add Product
                </Button>
            </form>
        </div>
    );
};

export default AddAsset;
