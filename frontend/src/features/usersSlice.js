import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { url,setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState ={
    list : [],
    status:null,
    deleteStatus:null,
};

export const usersFetch = createAsyncThunk("users/usersFetch" , async () => {
    try {
        const response = await axios.get(`${url}/users` , setHeaders());

        return response.data;
    } catch (err) {
        console.log(err);
    }
});

export const userDelete = createAsyncThunk(
    "users/userDelete",
    async (id) => {
      try {
        const response = await axios.delete(
          `${url}/users/${id}`,
          setHeaders()
        );
  
        return response.data;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data);
      }
    }
);

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(usersFetch.pending, (state) => {
          state.status = "pending";
        })
        .addCase(usersFetch.fulfilled, (state, action) => {
          state.list = action.payload;
          state.status = "success";
        })
        .addCase(usersFetch.rejected, (state) => {
          state.status = "rejected";
        })
        .addCase(userDelete.pending, (state) => {
            state.deleteStatus = "pending";
        })
        .addCase(userDelete.fulfilled, (state, action) => {
            const newList = state.list.filter((user) => user._id != action.payload._id)
            state.list = newList
            state.deleteStatus = "success";
            toast.error("User Delete!",{
                position:"bottom-left",
            });
        })
        .addCase(userDelete.rejected, (state) => {
            state.deleteStatus = "rejected";  
          // Consider using the action payload or meta for error details
          // and possibly showing an error toast here as well
        })
    },
  });
export default usersSlice.reducer;  
  