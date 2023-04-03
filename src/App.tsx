import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Chat from "./Routes/Chat";
import Image from "./Routes/Image";
import Navigate from "./Components/Navigate";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { loginState, widthSize } from "./atoms";
import Athentication from "./Routes/Athentication";
import Header from "./Components/Header";
import { useEffect } from "react";
import Signup from "./Routes/Signup";

const Main = styled.div`
  width: 90vw;
  height: 90vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  border-radius: 10px;
  overflow: hidden;
  display: flex;
  position: relative;
`;

function App() {
  const width = useRecoilValue(widthSize);
  const isLoggedIn = useRecoilValue(loginState);

  return (
    <BrowserRouter>
      <Main>
        {width < 500 ? null : <Navigate />}
        <Header />
        <Routes>
          <Route path="/openAI/home" element={<Home />}></Route>
          <Route
            path="/openAI/chat"
            element={isLoggedIn ? <Chat /> : <Home />}
          ></Route>
          <Route path="/kakao-login" element={<Athentication />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;
