import { TextField } from "@mui/material";
import { useContext, useState } from "react";
import SectionTitle from "../../Components/SectionTitle";
import Select from "react-select";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../AuthProvider";
import { Helmet } from "react-helmet-async";
const AddAsset = () => {
    const axiosSecure = useAxiosSecure();
    let { currentUserInfo } = useContext(AuthContext);
    const [productName, setProductName] = useState(null);
    const [productQuantity, setProductQuantity] = useState(null);
    const [selectedType, setProductType] = useState(null);

    const types = [
        { label: "Returnable", value: "returnable" },
        { label: "Non-Returnable", value: "non_returnable" },
    ];

    const handleAddProduct = (e) => {
        e.preventDefault();

        const productInformation = {
            productName,
            productQuantity: Number(productQuantity),
            productType: selectedType,
            productAddDate: new Date(),
            productAddedBy: currentUserInfo?.userEmail,
            productSource: currentUserInfo?.userRole,
        };

        // Uploading blog data to server
        return toast.promise(
            axiosSecure
                .post("/product/add", {
                    productInformation: productInformation,
                    email: currentUserInfo?.userEmail,
                })
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
        <div className="max-w-3xl mx-auto space-y-8 mb-8 px-4 lg:px-0">
            <SectionTitle
                data={{
                    title: "Add an Asset",
                    description: "Create an asset for employee",
                    noBorder: false,
                }}
            ></SectionTitle>
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
                    onChange={(selectedOption) =>
                        setProductType(selectedOption ? selectedOption.value : null)
                    }
                    required
                />

                <Button variant="contained" type="submit">
                    Add Product
                </Button>
            </form>
            <Helmet>
                <title>Add Asset - AssetFlow</title>
            </Helmet>
        </div>
    );
};

export default AddAsset;
