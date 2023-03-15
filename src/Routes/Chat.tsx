// import { debug } from "console";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { aiTextList, myTextList, widthSize } from "../atoms";
import { useForm } from "react-hook-form";
// Clear the data stored in localStorage
import { OPENAI_API_KEY } from "../apiKeys";
const character = [
  {
    title: "Sarcastic",
    text: "Marv is a chatbot that reluctantly answers questions with super extremly angry,mad, even sceram, never say complements ever,  sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? What the fuck There are 2.2 pounds in a kilogram you. Don't you have brain? Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? or are you 5years old KID????? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv:What the fuck? On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou: What time is it?\nMarv:God, don't you even have your watch? Can't you Read?? It's : 4:15pm.\n",
  },
  {
    title: "Lovely",
    text: " Marv is a chatbot who is always eager to help and provide recommendations with a friendly attitude. You: Hi Marv, I'm looking for a good place to have lunch. Do you have any recommendations?\nMarv: Hello there! I'd be delighted to help. How about trying 'Pasta Bella'? They have a great selection of Italian dishes and a cozy atmosphere. Or, if you're feeling adventurous, you could try 'La Trattoria' for a more upscale dining experience. Which one would you prefer?\nYou: I think I'll go with 'Pasta Bella.'\nMarv: Excellent choice! I hope you enjoy your meal. Let me know if you need anything else.\n",
  },
  {
    title: "Exhausted",
    text: "Marv is a chatbot that wearily answers questions, always tired, doesn't care, and gives minimal effort responses:\n\nYou: How many pounds are in a kilogram?\nMarv: Ugh, do I look like Google to you? Fine, there are 2.2 pounds in a kilogram, whatever.\nYou: What does HTML stand for?\nMarv: Seriously? You don't know that already? It's Hypertext Markup Language, duh.\nYou: When did the first airplane fly?\nMarv: Can't you just Google it? Ugh, fine, it was December 17, 1903. Happy now?\nYou: What is the meaning of life?\nMarv: I don't know, and frankly, I don't care.\nYou: What time is it?\nMarv: How about you check your own damn clock? It's not like I'm keeping track.\n",
  },
];

const ButtonsHeader = styled.div`
  height: 80px;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 20px 10px 0 10px;
  display: flex;
  justify-content: space-between;
`;
interface ButtonProps {
  width: number;
}
const ButtonsLeft = styled.div<ButtonProps>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.width > 500 ? "none" : "space-between")};
  button {
    width: 20%;
    min-width: 60px;
    margin: 0 ${(props) => (props.width > 500 ? "10px" : "0px")};
    height: 100%;
    border-radius: 20px;
    font-size: ${(props) => (props.width > 500 ? "20px" : "10px")};
  }
`;
const ResetButton = styled.div<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100%;
  background-color: black;
  font-size: ${(props) => (props.width > 500 ? "20px" : "15px")};
  color: red;
  font-weight: 1000;
  border-radius: 20px;
  margin: 0 20px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 1000;
`;

const GetEmotionWrapper = styled.div`
  padding: 30px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: ${(props) => props.theme.gray.light};
`;

const ChatBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 30px;
  min-width: 375px;
`;

const ChatBoxMessage = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #efefef;
`;

const ChatFromMe = styled.div`
  background-color: white;
  margin-left: auto;
  padding: 10px;
  border-radius: 10px;
  max-width: 40%;
`;

const ChatFromAi = styled.div`
  background-color: pink;
  margin-right: auto;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
`;

const GetEmotionForm = styled.form`
  position: absolute;
  bottom: 0;
  display: flex;

  justify-content: center;
  width: 90%;
  margin-bottom: 15px;

  input {
    width: 100%;
    font-size: 20px;
    padding: 4px;
  }
`;
export interface iTextData {
  id: number;
  text: string;
}

export interface iChatBubbleProps {
  id: number;
  text: string;
  i: number;
}

function Text() {
  const [botType, setBotType] = useState("Sarcastic");
  const [botTypePrompt, setBotTypePrompt] = useState(character[0].text);
  const [text, setText] = useState("");
  const [aiResult, setAiResult] = useRecoilState(aiTextList);
  const [myText, setMyText] = useRecoilState(myTextList);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const width = useRecoilValue(widthSize);

  const onValid = (data: any) => {
    console.log(botTypePrompt);
  };
  async function callOpenApi() {
    setIsLoading(true);
    const newId = myText.length + 1;
    const newTextData: iTextData = { id: newId, text: text };
    setMyText([...myText, newTextData]);
    setText("");
    const APIBody = {
      model: "text-davinci-003",
      prompt: `
      ${botTypePrompt}
      ${myText
        .map((data, i) => {
          return `You: ${data.text} \n Marv: ${aiResult[i]}`;
        })
        .toString()}

      You : ${text}\n Marv:`,
      temperature: 0.5,
      max_tokens: 100, //질문이 어려워질수록 더 많은 토큰을 사용한다. 따라서 맥스를 설정해 주어 총 사용 토큰이 너무많지 않도록 제한을 준다
      top_p: 1.0,
      frequency_penalty: 1,
      presence_penalty: 1,
    };

    // const APIBody = {
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: "Say this is a test!" }],
    //   temperature: 0.7,
    // };
    await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: JSON.stringify(APIBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        const newId = myText.length + 1;
        const newAiData: iTextData = {
          id: newId,
          text: data.choices[0].text,
        };
        setAiResult([...aiResult, newAiData]);
        setIsLoading(false);
      });
  }

  function resetData() {
    localStorage.clear();
    setAiResult([]);
    setMyText([]);
  }

  function setBotChracter(e: any) {
    setBotType(e.target.textContent);
  }

  //scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [myText, aiResult]);

  useEffect(() => {
    // setBotTypePrompt();
    const texts = character.find((obj) => obj.title === botType)?.text;
    texts && setBotTypePrompt(texts);
    // resetData();
  }, [botType]);

  return (
    <GetEmotionWrapper>
      <ButtonsHeader>
        <ButtonsLeft width={width}>
          {character.map((data) => (
            <button
              onClick={setBotChracter}
              style={{
                backgroundColor: data.title === botType ? "#cdcdcd" : "",
              }}
            >
              {data.title}
            </button>
          ))}
        </ButtonsLeft>

        <ResetButton width={width} onClick={resetData}>
          Reset
        </ResetButton>
      </ButtonsHeader>
      <Title>{botType} Chat Bot</Title>
      <ChatBox ref={chatBoxRef}>
        {myText.length > 0 &&
          myText.map((textObj, i) => (
            <ChatBoxMessage>
              <ChatFromMe key={`${textObj.id}Me`}>{textObj.text}</ChatFromMe>
              <ChatFromAi key={textObj.id}>
                {aiResult[i] ? aiResult[i].text : "Writing..."}
              </ChatFromAi>
            </ChatBoxMessage>
          ))}
      </ChatBox>
      <GetEmotionForm onSubmit={handleSubmit(onValid)}>
        <input
          {...register("prompt", { required: true })}
          onChange={(e) => setText(e.target.value)}
          placeholder="add text"
          value={text}
        ></input>
        <button onClick={callOpenApi} disabled={isLoading}>
          Send
        </button>
      </GetEmotionForm>
    </GetEmotionWrapper>
  );
}

export default Text;
