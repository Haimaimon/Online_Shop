import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";


const initialState = {
  items: [],
  status: null,
  createStatus: null,
  editStatus: null,
  deleteStatus: null,
};

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async () => {
    try {
      const response = await axios.get(`${url}/products`);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/products`,
        values,
        setHeaders()
      );

      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
    }
  }
);

export const productsEdit = createAsyncThunk(
  "products/productsEdit",
  async (values, thunkAPI) => {
    try {
      const response = await axios.put(
        `${url}/products/${values.product._id}`,
        values,
        setHeaders()
      );
      
      // If the product quantity is updated, mark related notifications as seen
      if (values.product.quantity) {
        await thunkAPI.dispatch(updateProductQuantity({
          productId: values.product._id,
          quantity: values.product.quantity
        }));
      }

      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
    }
  }
);


export const updateProductQuantity = createAsyncThunk(
  "products/updateProductQuantity",
  async ({ productId, quantity }) => {
    try {
      await axios.patch(`${url}/notifications/updateQuantity`, {
        productId,
        quantity
      }, setHeaders());
    } catch (error) {
      console.error('Error updating product quantity and notifications:', error);
    }
  }
);

export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/products/${id}`, setHeaders());
      // Return the deleted product's ID in the action payload
      return { _id: id };
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);


const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
      // Your slice reducers here
    },
    extraReducers: (builder) => {
      builder
        .addCase(productsFetch.pending, (state) => {
          state.status = "pending";
        })
        .addCase(productsFetch.fulfilled, (state, action) => {
          state.items = action.payload;
          state.status = "success";
        })
        .addCase(productsFetch.rejected, (state) => {
          state.status = "rejected";
        })
        .addCase(productsCreate.pending, (state) => {
          state.createStatus = "pending";
        })
        .addCase(productsCreate.fulfilled, (state, action) => {
          state.items.push(action.payload);
          state.createStatus = "success";
          toast.success("Product Created!");
        })
        .addCase(productsCreate.rejected, (state) => {
          state.createStatus = "rejected";
        })
        .addCase(productsDelete.pending, (state) => {
            state.deleteStatus = "pending";
          })
        .addCase(productsDelete.fulfilled, (state, action) => {
            const newList = state.items.filter((item) => item._id != action.payload._id)
            state.items = newList
            state.deleteStatus = "success";
            toast.error("Product Delete!");
          })
        .addCase(productsDelete.rejected, (state) => {
            state.deleteStatus = "rejected";  
          // Consider using the action payload or meta for error details
          // and possibly showing an error toast here as well
        })
        .addCase(productsEdit.pending, (state) => {
          state.editStatus = "pending";
        })
      .addCase(productsEdit.fulfilled, (state, action) => {
          const updatedProduct = state.items.map((product) => 
          product._id === action.payload._id ? action.payload : product
          )
          state.items = updatedProduct;
          state.editStatus = "success";
          toast.info("Product updated!");
        })
      .addCase(productsEdit.rejected, (state) => {
          state.editStatus = "rejected";  
        // Consider using the action payload or meta for error details
        // and possibly showing an error toast here as well
      });
    },
  });
  

export default productsSlice.reducer;