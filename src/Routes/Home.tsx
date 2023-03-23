import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { apiKey, iApiKey } from "../atoms";

const HomeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  color: red;
  font-size: 30px;
`;

function Home() {
  return <HomeWrapper></HomeWrapper>;
}

export default Home;
