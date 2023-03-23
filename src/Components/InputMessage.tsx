import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  aiTextList,
  botCharacter,
  botPrompt,
  chatDatas,
  inputText,
  isListeningMic,
  isLoadingAPI,
  ITextData,
  myTextList,
} from "../atoms";
import { OPENAI_API_KEY } from "../apiKeys";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const ChatBotForm = styled.form`
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  position: relative;
  input {
    font-size: 20px;
    padding: 4px;
    width: 100%;
    border: none;
    height: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: all 0.3s ease-in-out;

    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }
  button {
    border: none;
    right: 0;
    font-size: 20px;
    background-color: white;
  }
`;

const Buttons = styled.div`
  display: flex;
  position: absolute;
  right: 23px;
  top: 8px;
`;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

type InputProps = {
  inputRef: React.RefObject<HTMLInputElement>;
};
const InputMessage = ({ inputRef }: InputProps) => {
  const { register, handleSubmit } = useForm();
  const [text, setText] = useRecoilState(inputText);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAPI);
  const [isListening, setIsListening] = useRecoilState(isListeningMic);
  const [myText, setMyText] = useRecoilState(myTextList);
  const [aiResult, setAiResult] = useRecoilState(aiTextList);
  const botTypePrompt = useRecoilValue(botPrompt);
  const [note, setNote] = useState<string | null>(null);
  const [allData, setAllData] = useRecoilState(chatDatas);
  const [botType, setBotType] = useRecoilState(botCharacter);
  const category = botType.toLowerCase();
  function getTimeNow() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedTime;
  }

  const addDataFromMe = (category: string, text: string, time: string) => {
    setAllData((prevData) => ({
      ...prevData,
      [category]: {
        myTextList: [
          ...prevData[category].myTextList,
          {
            id: prevData[category].myTextList.length + 1,
            text,
            time,
          },
        ],
        aiTextList: [...prevData[category].aiTextList],
      },
    }));
  };
  const addDataFromAI = (category: string, text: string, time: string) => {
    setAllData((prevData) => ({
      ...prevData,
      [category]: {
        myTextList: [...prevData[category].myTextList],
        aiTextList: [
          ...prevData[category].aiTextList,
          {
            id: prevData[category].aiTextList.length + 1,
            text,
            time,
          },
        ],
      },
    }));
  };

  const onValid = (data: any) => {};
  async function callOpenApi() {
    setIsLoading(true);
    setIsListening(false);
    addDataFromMe(category, text, getTimeNow());
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
        const newAiData: ITextData = {
          id: newId,
          text: data.choices[0].text,
          time: getTimeNow(),
        };
        setAiResult([...aiResult, newAiData]);
        addDataFromAI(category, data.choices[0].text, getTimeNow());
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  ///////////////// ///speech to text///////////////////////////////

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setNote(transcript);
      };
    } else {
      mic.stop();
    }
  };
  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    if (typeof note === "string") {
      setText(note);
    }
  }, [note]);
  return (
    <ChatBotForm onSubmit={handleSubmit(onValid)}>
      <input
        {...register("prompt", { required: true })}
        onChange={(e) => setText(e.target.value)}
        placeholder="add text"
        value={text}
        autoComplete="off"
      ></input>
      <Buttons>
        <button onClick={callOpenApi} disabled={isLoading}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        <button onClick={() => setIsListening((prev) => !prev)}>
          <FontAwesomeIcon
            icon={isListening ? faMicrophoneSlash : faMicrophone}
          />
        </button>
      </Buttons>
    </ChatBotForm>
  );
};

export default InputMessage;
