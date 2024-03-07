import styled from "styled-components";

const Widget = ({data}) => {
    return <StyledWidget>
        <Icon color={data.color} bgcolor={data.bgColor}>
            {data.icon}
        </Icon>
        <Text>
            <h3>
                {data.isMoney ? "$" + data.digits?.toLocaleString()
                : data.digits?.toLocaleString()
                }
            </h3>
            <p> {data.title}</p>
        </Text>
        {data.percentage < 0 ? (
        <>
        <Percentage isPositive = {false}>
            {Math.floor(data.percentage) + "%"}
        </Percentage>
        </>
        ) : (
        <>
        <Percentage isPositive = {true}>
            {Math.floor(data.percentage) + "%"}
        </Percentage>
        </>
        )}
    </StyledWidget>
};
 
export default Widget;

const StyledWidget = styled.div`
display: flex;
align-items: center;
`;

const Icon = styled.div`
background: ${({ bgcolor}) => bgcolor };
color: ${({ color }) => color};
padding: 0%.5rem;
border-radius: 3;
margin-right: 0.5rem;
font-size: 20;
`;

const Text = styled.div`
h3 {
    font-weight: 900;
}
p {
    font-size: 14;
    color: rgba(234,234,255,0.68);
}
`;

const Percentage = styled.div`
  margin-left: 0.5rem;
  font-size: 14;
  color: ${({ isPositive }) => (isPositive ? "rgb(114,225,40)" : "rgb(255,77,73)")};
  ${({ isPositive }) => isPositive && `
    // Additional styles for positive percentage
  `}
`;