import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Users from '../Users';

const AllTimeData = () => {
    const { items } = useSelector((state) => state.products);
    const { list: userList } = useSelector((state) => state.users);
    const { list: orderList } = useSelector((state) => state.orders); 
    const totalSalesRevenue = orderList.reduce((acc, order) => acc + order.total, 0);


    return ( 
      <Main>
        <h3>All Time </h3>
        <Info>
            <Title>Users</Title>
            <Data>{userList.length}</Data>
        </Info>
        <Info>
            <Title>Products</Title>
            <Data>{items.length}</Data>
        </Info>
        <Info>
            <Title>Orders</Title>
            <Data>{orderList.length}</Data>
        </Info>
        <Info>
            <Title>Earning</Title>
            <Data>${totalSalesRevenue.toFixed(2)}</Data>
        </Info>
      </Main>
     );

}
 
export default AllTimeData;

const Main = styled.div`
    background: rgb(48,51,78);
    color:rgba(234,234,255,0.87);
    margin-top: 1.5rem;
    padding: 1.5rem;
    border-radius: 5px;
    font-size: 14px;
  `;

const Info = styled.div`
    background: rgba(38,198,249,0.12);
    padding: 0.3rem;
    border-radius: 3px;
    display: flex;
    margin-top: 1rem;
    &:nth-child(even){
        background: rgba(102,108,255,0.12);

    }
  `;
const Title =styled.div`
    flex: 1;
`;
const Data = styled.div`
    flex: 1;
    font-weight: 700;
`
