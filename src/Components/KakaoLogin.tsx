import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { loginState, UserData } from "../atoms";

const KakaoIcon = styled(FontAwesomeIcon)`
  scale: 1.3;
  width: 20px;
`;

const KakaoButton = styled.button`
  font-size: 15px;
  background-color: #ffeb00;
  height: 35px;
  border-radius: 30px;
  border: none;
  padding: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  &:hover {
    background-color: #ffdd00;
  }
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const KakaoLogin = () => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: "fbe17719e0bfefa4b2b6f51dc1bea7a8",
    redirect_uri: "http://localhost:3000/kakao-login",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  return (
    <KakaoButton>
      <a href={finalUrl}>
        <KakaoIcon icon={faComment}></KakaoIcon>
      </a>
    </KakaoButton>
  );
};

interface FinishKakaoLoginProps {
  code: string | null;
}

export interface IUserData {
  id: number;
  nickname: string;
  profile_image: string;
}
export const FinishKakaoLogin = ({ code }: FinishKakaoLoginProps) => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState<IUserData>(UserData);
  useEffect(() => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
      client_id: "fbe17719e0bfefa4b2b6f51dc1bea7a8",
      client_secret: "4MTRap8K4TL0tmycZ70bhlSjBPzXwzRY",
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3000/kakao-login",
      code: code as string,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const fetchKakaoData = async () => {
      const kakaoTokenRequest = await axios.post(
        finalUrl,
        {},
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if ("access_token" in kakaoTokenRequest.data) {
        const { access_token } = kakaoTokenRequest.data;
        const userDataFromKakao = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-type": "application/json",
            },
          }
        );

        //recoil 전역 변수에 유저 데이터 저장 (꼭 필요한지?)
        const {
          id,
          properties: { profile_image, nickname },
        } = userDataFromKakao.data;

        const loggedInUserData: IUserData = {
          id,
          nickname,
          profile_image,
        };

        setUserData(loggedInUserData);

        //Session Storage에 userdata 저장
        sessionStorage.setItem("userData", JSON.stringify(loggedInUserData));
        setIsLoggedIn(true);
        navigate("/openAI");
      }
    };
    fetchKakaoData();
  }, [code]);

  return <></>;
};

export const KakaoLogout = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const resetUserData = useResetRecoilState(UserData);
  const handleClick = () => {
    setIsLoggedIn(false);
    resetUserData();
  };
  return <KakaoButton onClick={handleClick}>로그아웃</KakaoButton>;
};
