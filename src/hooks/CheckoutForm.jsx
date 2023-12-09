/* eslint-disable react-hooks/exhaustive-deps */
// This example shows you how to set up React Stripe.js and use Elements.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useEffect, useState } from "react";
// import { CardElement, Elements, useElements, useStripe } from "../../src";
import toast from "react-hot-toast";
import { AuthContext } from "../AuthProvider";
import useAxiosSecure from "./useAxiosSecure";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");

    const axiosSecure = useAxiosSecure();
    let { currentUserInfo, selectedPackage, setCurrentUserInfo, setSelectedPackage } =
        useContext(AuthContext);
    // let price = 10;
    const navigate = useNavigate();

    let [price, setPrice] = useState(null);

    useEffect(() => {
        // console.log("selectedPackage", selectedPackage);
        if (selectedPackage) {
            setPrice(selectedPackage.price);

            axiosSecure
                .post("/create-payment-intent", {
                    price: selectedPackage.price,
                    email: currentUserInfo?.userEmail,
                })
                .then((res) => {
                    // console.log(res.data.clientSecret);
                    setClientSecret(res.data.clientSecret);
                });
        }
    }, [selectedPackage]);

    // 5200828282828210

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (error) {
            toast.error(error.message);
            console.log("[error]", error);
        } else {
            console.log("[PaymentMethod]", paymentMethod);
        }

        // console.log("card", card);
        // Confirm payment
        const { paymentIntent, error: cardConfirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: currentUserInfo?.userFullName || "anonymous",
                        email: currentUserInfo?.userEmail || "anonymous",
                    },
                },
            }
        );

        if (cardConfirmError) {
            toast.error(cardConfirmError.code);
            console.log("cardConfirmError", cardConfirmError);
        } else if (paymentIntent.status === "succeeded") {
            // console.log("paymentIntent", paymentIntent);

            const paymentInfo = {
                transactionId: paymentIntent.id,
                userFullName: currentUserInfo?.userFullName,
                userEmail: currentUserInfo?.userEmail,
                paymentDate: new Date(),
                selectedPlan: selectedPackage,
            };

            // /users/updatePayment
            // 5200 8282 8282 8210

            axiosSecure
                .post("/users/updatePayment", {
                    packageInfo: selectedPackage,
                    email: currentUserInfo?.userEmail,
                })
                .then((response) => {
                    // console.log(response.data?.updatedPaymentData_result);
                    // console.log(response.data?.userInformation);

                    setSelectedPackage(null);
                    setCurrentUserInfo(response.data?.userInformation);
                    toast.success("Payment Success");
                    return navigate("/add_employee");
                })
                .catch((error) => {
                    console.log(error);

                    throw new Error("Failed to make payment!");
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                                color: "#aab7c4",
                            },
                        },
                        invalid: {
                            color: "#9e2146",
                        },
                    },
                }}
            />
            <button type="submit" disabled={!stripe || !clientSecret}>
                Pay
            </button>
        </form>
    );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CheckOut = () => {
    let { selectedPackage } = useContext(AuthContext);

    return (
        <div
            id="stripe_parentt"
            className="max-w-2xl border-2 bg-white shadow-md px-4 py-8 mx-auto"
        >
            <div className="space-y-4">
                <h2 className="text-2xl text-center border-b-2 w-fit px-4 mx-auto">
                    Package Details
                </h2>
                {selectedPackage ? (
                    <>
                        <div className="text-lg">
                            <p>
                                Package Name:{" "}
                                <span className="font-medium">{selectedPackage.label}</span>
                            </p>
                            <p>
                                Price:{" "}
                                <span className="font-medium">{selectedPackage.price} USD</span>
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-xl text-red-600 text-center">Please select package!</div>
                )}
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
};

export default CheckOut;
