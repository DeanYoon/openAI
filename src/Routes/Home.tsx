import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { apiKey, iApiKey, loginState } from "../atoms";
import Admin from "../Components/Admin";
import { KakaoLogin, KakaoLogout } from "../Components/KakaoLogin";
import Login from "../Components/Login";

const HomeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  color: red;
  font-size: 30px;

  width: 100%;
`;
function Home() {
  const isLoggedIn = useRecoilValue(loginState);
  console.log("asd");
  return <HomeWrapper>{isLoggedIn ? <Admin /> : <Login />}</HomeWrapper>;
}

export default Home;
