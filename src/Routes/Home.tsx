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

const ApiForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  label {
    display: flex;
    align-items: center;
  }
`;

function Home() {
  const [apiData, setApiData] = useRecoilState<iApiKey>(apiKey);
  const { register, handleSubmit } = useForm();
  const [text, setText] = useState("");
  const onSubmit = () => {
    const newApiData = { API: text };
    setApiData(newApiData);
    setText("");
  };

  return (
    <HomeWrapper>
      <ApiForm onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("API", { required: true })}
          placeholder="Insert your API Key"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        />

        <button>Submit</button>
      </ApiForm>
      {apiData.API ? <div>{apiData.API}</div> : null}
    </HomeWrapper>
  );
}

export default Home;
