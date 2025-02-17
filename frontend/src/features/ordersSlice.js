import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { url,setHeaders } from "./api";

const initialState ={
    list : [],
    status:null,
};

export const fetchOrdersByUserId = createAsyncThunk(
  'orders/fetchOrdersByUserId',
  async (userId, thunkAPI) => {
      try {
          const response = await axios.get(`${url}/orders/user/${userId}`, setHeaders());
          return response.data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data);
      }
  }
);


export const ordersFetch = createAsyncThunk("orders/ordersFetch" , async () => {
    try {
        const response = await axios.get(`${url}/orders` , setHeaders());

        return response.data;
    } catch (err) {
        console.log(err);
    }
});

export const ordersEdit = createAsyncThunk(
   "orders/ordersEdit",
   async (values , {getState}) => {
    const state = getState();

    let currentOrder = state.orders.list.filter(
      (order) => order._id === values.id
    );

    const newOrder = {
      ...currentOrder[0],
      delivery_status: values.delivery_status,
    };
    try {
      const response = await axios.put(
        `${url}/orders/${values.id}`,
        newOrder,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
   } 
);

const ordersSlice = createSlice({
    name:"orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(ordersFetch.pending, (state) => {
            state.status = "pending";
          })
          .addCase(ordersFetch.fulfilled, (state, action) => {
            state.list = action.payload;
            state.status = "success";
          })
          .addCase(ordersFetch.rejected, (state) => {
            state.status = "rejected";
          })
          .addCase(ordersEdit.pending, (state) => {
            state.createStatus = "pending";
          })
          .addCase(ordersEdit.fulfilled, (state, action) => {
            const updatedOrders = state = state.list.map((order) =>
            order._id === action.payload._id ? action.payload : order
            );
            state.list = updatedOrders;
            state.status = "success"
          })
          .addCase(ordersEdit.rejected, (state) => {
            state.status = "rejected";
          })
          .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
            state.userOrders = action.payload;
            state.status = 'succeeded';
          })
          .addCase(fetchOrdersByUserId.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
          });
      },
});

export default ordersSlice.reducer;