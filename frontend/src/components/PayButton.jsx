import axios from "axios";
import { useSelector } from "react-redux";
import { url } from "../features/api";

const PayButton = ({ cartItems }) => {
    const user = useSelector((state) => state.auth);

    const handleCheckout = () => {
        // Map the cartItems to include the correct price based on whether the product is on sale
        const itemsForCheckout = cartItems.map(item => ({
            ...item,
            price: item.isOnSale ? item.salePrice : item.price
        }));

        axios
            .post(`${url}/stripe/create-checkout-session`, {
                cartItems: itemsForCheckout,
                userId: user._id,
            })
            .then((response) => {
                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            })
            .catch((err) => console.log(err.message));
    };

    return (
        <>
            <button onClick={() => handleCheckout()}>Check out</button>
        </>
    );
};

export default PayButton;
