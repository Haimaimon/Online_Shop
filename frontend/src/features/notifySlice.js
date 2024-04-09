import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { url,setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState ={
    items : [],
    status:null,
    deleteStatus:null,
};

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (notificationId, thunkAPI) => {
      try {
        const response = await axios.delete(`${url}/notifications/${notificationId}`, setHeaders());
        return notificationId; // Return the deleted notification's ID
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );


  const notifySlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
      // Your slice reducers here
    },
    extraReducers: (builder) => {
      builder
        .addCase(deleteNotification.fulfilled, (state,action) => {
          state.items = state.items.filter(notification => notification._id !== action.payload);
        })  
    },
});
  

export default notifySlice.reducer;  
  