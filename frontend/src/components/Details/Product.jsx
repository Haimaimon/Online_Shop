import {  useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { url ,setHeaders} from "../../features/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cartSlice";

const Product = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [product,setProduct] = useState({});
    const [loading,setLoading] = useState(false);

    console.log("prodcut", product);
    const handleAddToCart = (product) => {
        // Check if the product is on sale
        const priceToAdd = product.isOnSale ? product.salePrice : product.price;
      
        // Create a new product object with the adjusted price
        const productToAdd = {
          ...product,
          price: priceToAdd,
        };
          // Dispatch the product to the cart
        dispatch(addToCart(productToAdd));
        navigate("/cart");
    };
    useEffect(() => {
        setLoading(true);
        async function fetchDate(){
          try{
              const res = await axios.get(`${url}/products/find/${params.id}`, setHeaders());
              setProduct(res.data);
          }catch(err){
            console.log(err);
          }
          setLoading(false)
        }
        fetchDate();
      }, []);

    return  <StyledProduct>
        <ProductContainer>
            {loading ? <p> Loading...</p> : <>
            <ImageContainer>
                <img src={product.image?.url} alt="product" />
            </ImageContainer>
            <ProductsDetails>
                <h3>{product.name}</h3>
                <p><span>Brand : </span> {product.brand}</p>
                <p><span>Description : </span> {product.desc}</p>
                <Price>Price: ${product.price?.toLocaleString()}</Price>
                <Price>SalePrice: ${product.salePrice}</Price>
                <button className="product-add-to-cart" onClick={() => handleAddToCart
                (product)}> 
                    Add to Cart
                </button>
            </ProductsDetails>
            </>}
        </ProductContainer>
    </StyledProduct>;
};
 
export default Product;


const StyledProduct = styled.div`
   margin: 3rem;
   display: flex;
   justify-content: center;
`;

const ImageContainer = styled.div`
   flex: 1;
   img {
        width: 100%;
    }
`;

const ProductContainer = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    height: auto;
    box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
    border-radius:5px ;
    padding: 2rem;
    color: #000000; /* Darkest black */
`;

const ProductsDetails = styled.div`
    flex: 2;
    margin-left: 2rem;
    h3{
        font-size: 35px;
        color: #000000; /* Darkest black */
    }
    p span {
        font-weight: bold;
        color: #000000; /* Darkest black */
    }
`;

const Price = styled.div`
   margin: 1rem 0;
   font-weight: bold;
   font-size: 25px;
`;