import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Chat from "./Routes/Chat";
import Image from "./Routes/Image";
import Navigate from "./Components/Navigate";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { widthSize } from "./atoms";

const Main = styled.div`
  width: 90vw;
  height: 90vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  border-radius: 10px;
  overflow: hidden;
  display: flex;
  position: relative;
`;
const Header = styled.div`
  position: absolute;
  width: inherit;
  height: 70px;
  background-color: white;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const ButtonBox = styled.div`
  width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
`;
const Button = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.color};
`;
const UserIcon = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 30px;
  margin-right: 10px;
`;

function App() {
  const width = useRecoilValue(widthSize);
  return (
    <BrowserRouter>
      <Main>
        {width < 500 ? null : <Navigate />}
        <Header>
          <ButtonBox>
            <Button color="#FF605C"></Button>
            <Button color="#FFBD44"></Button>
            <Button color="#00CA4E"></Button>
          </ButtonBox>
          <UserIcon />
        </Header>
        <Routes>
          <Route path="/openAI/" element={<Home />}></Route>
          <Route path="/openAI/chat" element={<Chat />}></Route>
          <Route path="/openAI/image" element={<Image />}></Route>
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;
