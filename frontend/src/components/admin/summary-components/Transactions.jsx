import styled from "styled-components";
import { useState ,useEffect} from "react";
import axios from "axios";
import { url ,setHeaders} from "../../../features/api";
import moment from "moment";

const Transactions = () => {
    
    const [orders, setOrderes] = useState([]);
    const [isLoading, setIsLoading] = useState(0);

    useEffect(() => {
      async function fetchDate(){
        setIsLoading(true);
        try{
            const res = await axios.get(`${url}/orders/?new=true`, setHeaders());

            setOrderes(res.data);
        }catch(err){
          console.log(err);
        }
        setIsLoading(false);
      }
      fetchDate();
    }, []);
    
    
    
    return ( 
    <StyledTransactions>
        {isLoading ? (
            <p>Transcations loading ...</p>
        ) : (
            <>
            <h3>Latest Transcations</h3>
            {
                orders?.map((order,index) => <Transaction key={index}>
                  <p> {order.shipping.name}</p>
                  <p> ${(order.total / 100).toLocaleString()}</p>
                  <p> {moment(order.createAt).fromNow()}</p>

                </Transaction>)
            }
            </>
        )}
    </StyledTransactions>
     );
}
 
export default Transactions;

const StyledTransactions = styled.div`
    background: rgb(48,51,78);
    color:rgba(234,234,255,0.87);
    width: 100;
    padding: 1.5rem;
    height: 170;
    border-radius: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `;

const Transaction = styled.div`
    background: rgba(38,198,249,0.12);
    padding: 1.5rem;
    border-radius: 10;
    display: flex;
    font-size: 14px;
    margin-top: 1rem;
    p{
        flex: 1;
    }
    &:nth-child(even){
        background: rgba(102,108,255,0.12);

    }
  `;