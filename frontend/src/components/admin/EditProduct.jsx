import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { PrimaryButton } from "./CommonStyled";
import { productsEdit } from '../../features/productsSlice';
import axios from 'axios';
import { url, setHeaders } from '../../features/api';


export default function EditProduct({proId}) {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  const { items , editStatus} = useSelector((state) => state.products);

  const [currentProd , setCurrentProd] = useState({});
  const [previewImg, setPreviewImg] = useState("");

  const [productImg, setProductImg] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [isOnSale, setIsOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const [popularity, setPopularity] = useState(currentProd.popularity);
  const [ quantity , setQuantity] = useState('');
 
  const handlePopularityChange = (e) => {
    setPopularity(e.target.checked);
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];

    TransformFileData(file);
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
        setPreviewImg(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(
      productsEdit({
        productImg,
        product: {
            ...currentProd,
            name:name,
            brand: brand,
            price:price,
            desc:desc,
            isOnSale: isOnSale,
            salePrice:salePrice,
            popularity:popularity,
            quantity:quantity,
        }
      })
    );
    // Check if the product quantity was increased and send a notification update request
    if (parseInt(quantity) > currentProd.quantity) {
      try {
          await axios.patch(
              `${url}/notifications/updateQuantity`,
              { productId: currentProd._id },
              setHeaders()
          );
      } catch (error) {
          console.error('Error updating notifications:', error);
      }
    }
  };



  const handleClickOpen = () => {
    setOpen(true);

    let selectedProd = items.filter((item) => item._id === proId)

    selectedProd = selectedProd[0];

    setCurrentProd(selectedProd);
    setPreviewImg(selectedProd.image.url);
    setProductImg("");
    setBrand(selectedProd.brand);
    setName(selectedProd.name)
    setPrice(selectedProd.price);
    setDesc(selectedProd.desc);
    setIsOnSale(selectedProd.isOnSale);
    setSalePrice(selectedProd.salePrice || '');
    setPopularity(selectedProd.popularity);
    setQuantity(selectedProd.quantity);

  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Edit  onClick={handleClickOpen}>
        Edit
      </Edit>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
        <StyledEditProduct>
      <StyledForm onSubmit={handleSubmit}>
        <h3>Create a Product</h3>
        <input
          id="imgUpload"
          accept="image/*"
          type="file"
          onChange={handleProductImageUpload}
          
        />
        <select onChange={(e) => setBrand(e.target.value)} value={brand} required>
          <option value="">Select Types of NFTs</option>
          <option value="MusicNFTs">Music NFTs</option>
          <option value="GamingNFTs">Gaming NFTs</option>
          <option value="FasionNFTs">Fasion NFTs</option>
          <option value="SportsNFTs">Sports NFTs</option>
          <option value="ArtNFTs">Art NFTs</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)} value={name}
          required
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)} value={price}
          required
        />
        <input
          type="text"
          placeholder="Short Description"
          onChange={(e) => setDesc(e.target.value)} value={desc}
          required
        />
        <label>
          On Sale:
          <input
            type="checkbox"
            checked={isOnSale}
            onChange={(e) => setIsOnSale(e.target.checked)}
          />
        </label>
        {isOnSale && (
          <input
            type="number"
            placeholder="Sale Price"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            required={isOnSale}
          />
        )}
        <label>
          Popular:
          <input type="checkbox" checked={popularity} onChange={handlePopularityChange} />
        </label>
        <input
          type="number"
          placeholder="Quantity"
          onChange={(e) => setQuantity(e.target.value)} value={quantity}
          required
        />
        <PrimaryButton type="submit">
            {editStatus === "pending" ? "Sucmitting" : "Submit"}
        </PrimaryButton>
      </StyledForm>
      <ImagePreview>
        {previewImg ? (
          <>
            <img src={previewImg} alt="product image!" />
          </>
        ) : (
          <p>Product image upload preview will appear here!</p>
        )}
      </ImagePreview>
    </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
   </div>
  );
}

const Edit = styled.button`
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
    background-color: #4b70e2;
`;


const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
  }
`;
