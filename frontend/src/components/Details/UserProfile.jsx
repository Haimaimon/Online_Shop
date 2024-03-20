import { useEffect,useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { setHeaders, url } from "../../features/api";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { fetchOrdersByUserId } from '../../features/ordersSlice';

const UserProfile = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const [user, setUser] = useState({
        name:"",
        email:"",
        isAdmin: false,
        password:"",
    });
    console.log(user);
    const [loading , setLoading] = useState(false);
    const [ updating , setUpdating] = useState(false);
    //const userr = useSelector((state) => state.auth.user);
    const userOrders = useSelector((state) => state.orders.userOrders);

    useEffect(() => {
        if (user && user._id) {
            console.log('Dispatching fetchOrdersByUserId with user ID:', user._id);
            dispatch(fetchOrdersByUserId(user._id));
        }
    }, [dispatch, user]);
    
    useEffect(() => {
        console.log('User orders:', userOrders);
    }, [userOrders]);
    
    useEffect(() => {
        setLoading(true);
        const fetchUser = async() => {
            try {
                const response = await axios.get(`${url}/users/find/${params.id}`,setHeaders());  
                
                setUser({
                    ...response.data,
                    password:"",
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
        setLoading(false);
    },[params.id]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await axios.put(`${url}/users/${params.id}`,
            {
                ...user,
            }, 
             setHeaders()
            );

            setUser({...res.data , password:""})

            toast.success("Profile updated")
        } catch (error) {
            console.log(error);
        }
        setUpdating(false);
    };
    return (
        <StyledProfile>
            <ProfileContainer>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3>User Profile</h3>
                        {user.isAdmin ? (
                            <Admin>Admin</Admin>
                        ) : (
                            <Customer>Customer</Customer>
                        )}
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="text"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                        <button>{updating ? "Updating" : "Update Profile"}</button>
                    </form>
                )}
                
            </ProfileContainer>
            <OrdersContainer>
            <h2>Orders:</h2>
                {userOrders && userOrders.length > 0 ? (
                userOrders.map((order) => (
                    <OrderCard key={order._id}>
                    <OrderHeader>
                        <h3>Order ID: {order._id}</h3>
                        <OrderTotal>Total: ${order.total}</OrderTotal>
                    </OrderHeader>
                    <OrderDetails>
                        <p>Delivery Status: {order.delivery_status}</p>
                        <h4>Products:</h4>
                        <ProductsList>
                        {order.products.map((product) => (
                            <ProductItem key={product.id}>
                            <ProductName>Name: {product.description}</ProductName>
                            <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
                            <ProductPrice>Price: ${product.price.unit_amount / 100}</ProductPrice>
                            </ProductItem>
                        ))}
                        </ProductsList>
                    </OrderDetails>
                    </OrderCard>
                ))
                ) : (
                <p>No orders found.</p>
                )}
            </OrdersContainer>
        </StyledProfile>
    );    
};
 
export default UserProfile;

const StyledProfile = styled.div`
   margin: 3rem;
   display: flex;
   justify-content: center;
`;
const ImageContainer = styled.div`
   flex: 1;
   img {
        width: 50%;
    }
`;
const ProfileContainer = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    height: auto;
    box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
    border-radius:5px ;
    padding: 2rem;
    form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        h3 {
            margin-bottom: 0.5rem;
        }
        label {
            margin-bottom: 0.2rem;
            color: gray;
        }
        input {
            margin-bottom: 1rem;
            outline: none;
            border: none;
            border-bottom: 1px solid gray;
        }
    }
`;

const Actions = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    button{
        border: none;
        outline: none;
        padding: 3px 5px;
        color: white;
        border-radius: 3px;
        cursor: pointer;
    }
`;

const Delete = styled.button`
     background-color: rgb(255,77,73);
`;

const View = styled.button`
    background-color: rgb(114,225,40);
`;

const Admin = styled.div`
    color: rgb(253,181,40);
    background-color: rgba(253,181,40,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Customer = styled.div`
    color: rgb(253,181,40);
    background-color: rgba(253,181,40,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;
const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 55px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OrderTotal = styled.span`
  font-weight: bold;
  color: #4CAF50;
`;

const OrderDetails = styled.div`
  font-size: 14px;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const ProductItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 10px;
`;

const ProductName = styled.p`
  font-weight: bold;
`;

const ProductQuantity = styled.p`
  color: #666;
`;

const ProductPrice = styled.p`
  color: #666;
`;