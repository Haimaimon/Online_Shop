import styled from "styled-components";

import * as React from 'react';
import { DataGrid } from'@mui/x-data-grid';

import {  useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { productsDelete } from "../../../features/productsSlice";
import EditProduct from "../EditProduct";
import { useEffect } from "react";
import { userDelete, usersFetch } from "../../../features/usersSlice";



export default function UsersList() {
  const navigate = useNavigate();
  const dispacth = useDispatch();
  const { list } = useSelector((state) => state.users)

  useEffect(() => {
    dispacth(usersFetch());
  },[dispacth]);

  const rows = list && list.map(user => {
    return {
        id: user._id,
        uName: user.name,
        uEmail: user.email,
        isAdmin: user.isAdmin,
    };
  });
  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'uName', headerName: 'name', width: 150 ,
    
},
    { field: 'uEmail', headerName: 'email', width: 200 },
    {
      field: 'isAdmin',
      headerName: 'Role',
      width: 100,
      renderCell:(params) => {
        return (
            <div>
                {params.row.isAdmin ? (
                <Admin>Admin</Admin> 
                ):(
                  <Customer>Customer</Customer>
                )}
            </div>
        );
    },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell:(params) => {
        return (
            <Actions>
                <Delete onClick={() => handleDelete(params.row.id)}>Delete</Delete>
                <View onClick={() => navigate(`/user/${params.row.id}`)}>
                    View
                </View>
            </Actions>
        );
    },
    },
  ];

  const handleDelete = (id) =>{
    dispacth(userDelete(id));
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

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