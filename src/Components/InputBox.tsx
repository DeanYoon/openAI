import styled from "styled-components";

const InputWrapper = styled.div`
  width: 500px;
  display: flex;
  justify-content: space-between;
  font-size: 30px;
  label {
    width: 20%;
  }
  input {
    width: 80%;
  }
`;

interface InputBoxProps {
  label: string;
  setAttribute: (value: string) => void;
}

const InputBox = (props: InputBoxProps) => {
  return (
    <InputWrapper>
      <label className="label">{props.label}</label>
      <input onChange={(e) => props.setAttribute(e.target.value)} />
    </InputWrapper>
  );
};

export default InputBox;
