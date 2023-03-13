import styled from "styled-components";

const HomeWrapper = styled.div`
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: red;
  font-size: 500px;
`;

function Home() {
  return <HomeWrapper>{}</HomeWrapper>;
}

export default Home;
