import styled from "styled-components";
import {FaUsers, FaChartBar, FaClipboard} from "react-icons/fa";
import Widget from "./summary-components/Widget";
import { useState ,useEffect} from "react";
import axios from "axios";
import { url,setHeaders } from "../../features/api";
import Chart from "./summary-components/Chart";
import Transactions from "./summary-components/Transactions";
import AllTimeData from "./summary-components/AllTimeData";


const Summary = () => {
    
    const [users, setUsers] = useState([]);
    const [usersPerc, setUsersPerc] = useState(0);
    const [orders, setOrdes] = useState([]);
    const [ordersPerc, setOrdersPerc] = useState(0);
    const [income, setIncome] = useState([]);
    const [incomePerc, setIncomePerc] = useState(0);

    function compare (a,b) {
      if(a._id < b._id){
        return 1
      }
      if(a._id > b._id){
        return -1
      }
      return 0;

    }
    useEffect(() => {
      async function fetchDate(){
        try{
            const res = await axios.get(`${url}/users/stats`, setHeaders());
            res.data.sort(compare);
            console.log("stats", res.data);
            setUsers(res.data);
            if (res.data.length > 1) {
              setUsersPerc(
                ((res.data[0]?.total ?? 0) - (res.data[1]?.total ?? 0)) / (res.data[1]?.total ?? 1) * 100
              );
            }
        }catch(err){
          console.log(err);
        }
      }
      fetchDate();
    }, []);

    useEffect(() => {
      async function fetchDate(){
        try{
            const res = await axios.get(`${url}/orders/income/stats`, setHeaders());
            res.data.sort(compare);
            console.log("stats", res.data);
            setIncome(res.data);
            if (res.data.length > 1) {
              setIncomePerc(
                ((res.data[0]?.total ?? 0) - (res.data[1]?.total ?? 0)) / (res.data[1]?.total ?? 1) * 100
              );
            }
        }catch(err){
          console.log(err);
        }
      }
      fetchDate();
    }, []);


    const data = [
      {
        icon:<FaUsers/>,
        digits:users[0]?.total,
        isMoney:false,
        title:"Users",
        color:" rgb(102,108,255)",
        bgColor:" rgbe(102,108,255,0.12)",
        percentage: usersPerc,
      },
      {
        icon:<FaClipboard/>,
        digits:orders[0]?.total,
        isMoney:false,
        title:"Orders",
        color:" rgb(38,198,249)",
        bgColor:" rgbe(38,198,249,0.12)",
        percentage:ordersPerc
      },
      {
        icon:<FaChartBar/>,
        digits:income[0]?.total ? income[0]?.total / 100 : "",
        isMoney:true,
        title:"Earnngs",
        color:" rgb(253,181,40)",
        bgColor:" rgbe(253,181,40,0.12)",
        percentage:incomePerc,
      },
    ]
    return <StyledSummary>
      <MainStats>
        <Overview>
          <Title>
            <h2>Overview</h2>
            <p>How your shop is performing compared the previous month</p>

          </Title>
          <WidgetWrapper>
            {data?.map((data,index) => (
               <Widget key={index} data={data} /> 
            ))}
          </WidgetWrapper>
        </Overview>
        <Chart/>
      </MainStats>
      <SideStats>
        <Transactions/>
        <AllTimeData/>
      </SideStats>
    </StyledSummary>;
  };
  
  export default Summary;

  const StyledSummary = styled.div`
    width: 100;
    display: flex;
  `;

  const MainStats = styled.div`
    flex: 2;
    width: 100;
  `;

  const Title = styled.div`
    p{
      font-size: 14;
      color: rgba(234,234,255,0.68);
    }
  `;

  const Overview = styled.div`
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

  const WidgetWrapper = styled.div`
    display: flex;
    width: 100;
    justify-content: space-between;
  `;
  const SideStats = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    width: 100;
  `;
