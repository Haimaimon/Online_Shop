import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { configureStore} from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import productsReducer, { productsFetch } from './features/productsSlice';
import { productsApi } from './features/productsApi';
import cartReducer, { getTotals } from './features/cartSlice';
import authReducer from './features/authSlice';
import ordersSlice from './features/ordersSlice';
import usersSlice from './features/usersSlice.js';

//4PyEquL1OkhKMyb1


const store = configureStore({
  reducer:{
    products: productsReducer,
    orders: ordersSlice,
    users: usersSlice,
    cart: cartReducer,
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>{
    return getDefaultMiddleware().concat(productsApi.middleware);
  },
});

store.dispatch(productsFetch());
store.dispatch(getTotals());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
