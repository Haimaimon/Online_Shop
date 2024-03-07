import styled from "styled-components";

import * as React from 'react';
import { DataGrid } from'@mui/x-data-grid';

import {  useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ordersEdit, ordersFetch } from "../../../features/ordersSlice";
import moment from "moment"; 



export default function OrdersList() {
  const navigate = useNavigate()
  const dispacth = useDispatch();
  const { list } = useSelector((state) => state.orders)
  
  console.log(list);

  React.useEffect(() => {
    dispacth(ordersFetch());
  }, [ dispacth]);

  const rows = list && list.map(order => {
    return {
        id: order._id,
        cName: order.shipping.name,
        amount: (order.total / 100),
        dStatus: order.delivery_status,
        date: moment(order.createdAt).fromNow(),
    }
  })
  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'cName', headerName: 'Name', width: 120,
},
    { field: 'amount', headerName: 'Amount($)', width: 100 },
    {
      field: 'dStatus',
      headerName: 'Status',
      width: 100,
      renderCell:(params) => {
        return (
            <div>
               {params.row.dStatus === "pending" ? (
               <Pending>Pending</Pending> 
               ) : params.row.dStatus ==="dispatched" ? (
                <Dispatched>Dispatched</Dispatched> 
               ) : params.row.dStatus ==="delivered" ? (
               <Deliverd>Delivered</Deliverd> 
               ):( 
               "error"
               )}
            </div>
        );
    },
    },
    {
        field: 'date',
        headerName: 'Date',
        width: 120,
      },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 220,
      renderCell : (params) => {
        return(
         <Actions>
            <DispatchedBtn onClick={()=> handleOrderDispatch(params.row.id)}>Dispatched</DispatchedBtn>
            <DeliverdBtn onClick={()=> handleOrderDeliver(params.row.id)}>Deliver</DeliverdBtn>
            <View onClick={() => navigate(`/order/${params.row.id}`)}>View </View>
        </Actions>
        );
      },
    },
  ];

  const handleOrderDispatch =(id) =>{
    dispacth(ordersEdit({
      id,
      delivery_status:"dispatched",
    }));

  };

  const handleOrderDeliver =(id) =>{
    dispacth(ordersEdit({
      id,
      delivery_status:"delivered",
    }));

  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowPerPageOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}


const DispatchedBtn = styled.button`
    background-color: rgb(38,198,249);
`;

const DeliverdBtn = styled.button`
    background-color: rgb(102,108,255);
`;

const View = styled.button`
    background-color: rgb(114,225,40);
`;

const Pending = styled.div`
    color: rgb(253,181,40);
    background-color: rgba(253,181,40,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Dispatched = styled.div`
    color: rgb(38,198,249);
    background-color: rgba(38,198,249,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
`;

const Deliverd = styled.div`
    color: rgb(102,108,255);
    background-color: rgba(102,108,255,0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 14px;
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
