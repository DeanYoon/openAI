import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { apiKey, iApiKey, loginState, UserData } from "../atoms";

import { KakaoLogin, KakaoLogout } from "../Components/KakaoLogin";

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
const LoginBox = styled.div`
  position: relative;
`;
const SocialLoginButton = styled.div`
  position: absolute;
  right: 30px;
  bottom: 30px;
`;

const LoginForm = styled.form`
  width: 300px;
  height: 250px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, rgb(127, 149, 210), #7eb1ff);
`;
const LoginHead = styled.div`
  border-bottom: 1px solid white;
  width: 300px;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  padding-bottom: 10px;
`;
const LoginInput = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  input {
    color: white;
    height: 30px;
    background-color: inherit;
    border: none;
    outline: none;
    font-size: 20px;
    &::placeholder {
      color: #ffffff94;
    }
  }
`;
const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const LoginButton = styled.button`
  padding: 0 40px;
  border-radius: 40px;
  height: 40px;
  border: none;
`;
//{isLoggedIn ? <KakaoLogout /> : <KakaoLogin />}

function Home() {
  const isLoggedIn = useRecoilValue(loginState);
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <HomeWrapper>
      {isLoggedIn ? null : (
        <LoginBox>
          <LoginForm onSubmit={handleSubmit(onSubmit)}>
            <LoginHead>LOGIN</LoginHead>
            <LoginInput>
              <input {...register("username")} placeholder="LOGIN" />
              <input {...register("password")} placeholder="PASSWORD" />
            </LoginInput>
            <Buttons>
              <LoginButton>LOGIN</LoginButton>
            </Buttons>
          </LoginForm>
          <SocialLoginButton>
            <KakaoLogin />
          </SocialLoginButton>
        </LoginBox>
      )}
    </HomeWrapper>
  );
}

export default Home;
