import { useEffect } from "react";
import styled from "styled-components";
import { getTotals , clearCart} from "../features/cartSlice";
import { useDispatch,useSelector } from "react-redux";
import { url } from "../features/api";
import axios from 'axios';

const CheckoutSuccess = () => {
     const dispatch = useDispatch();
     const cart = useSelector((state) => state.cart);
     const cartItems = useSelector(state => state.cart.cartItems);
     const product = useSelector(state => state.product);
    console.log("pro" , product);

    useEffect(() => {
        console.log("pro" , product);
        console.log("protd" , cart.product);
        dispatch(clearCart());
    },[dispatch]);

    useEffect(() => {
        console.log("pro" , cart);
        dispatch(getTotals());
    },[cart,dispatch]);

    useEffect(() => {
        cartItems.forEach(async (item) => {
            try {
                await axios.patch(`${url}/products/${item._id}/decreaseQuantity`, {
                    quantity: item.cartQuantity
                });
                console.log('Product quantity updated successfully');
            } catch (error) {
                console.error('Error updating product quantity:', error);
            }
        });
    }, [cartItems]);
    return ( 
        <Container>
            <h2>Checkout Successful</h2>
            <p>Your order might take some time to process. </p>
            <p>Check your order status at your profile after about 10mins. </p>
            <p>
                Incase of any inqueries contact the support at {" "}
                <strong>support@onlineshop.com</strong>
            </p>
        </Container>
    );
};
 
export default CheckoutSuccess;

const Container = styled.div`
  min-height: 80vh;
  max-width: 800;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    margin-bottom: 0.5rem;
    color: #029e02;
  }
`;