import { useEffect , useState} from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url , setHeaders} from "../../features/api";

const Order = () => {
    const params = useParams();

    const [order , setOrder] = useState({});
    const [loading , setLoading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${url}/orders/findOne/${params.id}`,
                    setHeaders()
                );
                setOrder(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOrder();
    }, [params.id]);
    return (
        <StyledOrder>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <OrdersContainer>
                        <h2>Order Details</h2>
                        <p>
                            Delivery status : {" "}
                            {order.delivery_status === " pending" ? (
                              <Pending>Pending</Pending>  
                            ) : order.delivery_status === "dispatched" ? (
                                <Dispatched>Dispatched</Dispatched>
                            ) : order.delivery_status === "delivered" ? (
                                <Deliverd>Delivered</Deliverd>
                            ) : (
                                "error"
                            )
                        }
                        </p>
                        <h3>Ordered Products</h3>
                        <Items>
                            {order.products?.map((product,index) =>(
                                <Item key={index}>
                                     <span>{product.description}</span>
                                     <span>{product.quantity}</span>
                                     <span>
                                        {"$" + (product.amount_total / 100).toLocaleString()}
                                     </span>
                                </Item>
                            ))}
                        </Items>
                        <div>
                            <h3>Total Price</h3>
                            <p>{"$" + (order.total / 100).toLocaleString()}</p>
                        </div>
                        <div>
                            <h3>Shipping Details</h3>
                            <p>Customer: {order.shipping?.name}</p>
                            <p>City: {order.shipping?.address.city}</p>
                            <p>Email: {order.shipping?.email}</p>
                        </div>
                    </OrdersContainer>
                </>
            )
        }
        </StyledOrder>
      );
};
 
export default Order;

const StyledOrder = styled.div`
   margin: 3rem;
   display: flex;
   justify-content: center;
   h3 {
    margin: 1.5rem 0 0.5rem 0;
    color: #000000; /* Darkest black */
   }
`;

const OrdersContainer = styled.div`
    width: 100%;
    max-width: 500px;
    height: auto;
    box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
    border-radius:5px ;
    padding: 2rem;
    color: #000000; /* Darkest black */
`;

const Items = styled.div`
   span {
    margin-right: 1.5rem;
    color: #000000; /* Darkest black */
    &:first-child{
        font-weight: bold;
        color: #000000; /* Darkest black */
    }
   }
`;


const Item = styled.div`
   margin-left: 0.5rem;
   margin-bottom: 0.5rem;
`;

const Pending = styled.span`
    color: rgb(252, 168, 0);
    background-color: rgba(253,181,40,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Dispatched = styled.span`
    color: rgb(38,198,249);
    background-color: rgba(38,198,249,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Deliverd = styled.span`
    color: rgb(102,108,255);
    background-color: rgba(102,108,255,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;
