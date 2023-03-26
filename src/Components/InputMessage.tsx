import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import {
  botCharacter,
  botPrompt,
  chatDatas,
  inputText,
  isListeningMic,
  isLoadingAPI,
  isSoundOn,
  ITextData,
} from "../atoms";
import { OPENAI_API_KEY } from "../apiKeys";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { characterName } from "./characterData";

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
    padding-left: 20px;
    width: 100%;
    border: none;
    height: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
    padding-right: 100px;

    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    &::placeholder {
      font-size: 15px;
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
  justify-content: space-between;
  position: absolute;
  width: 80px;
  right: 30px;
  top: 8px;

  button {
    background-color: inherit;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SendButton = styled.button``;
const MicButton = styled.button``;

const LanguageSelect = styled.select`
  appearance: none;
  padding: 5px;
  border: none;
  cursor: pointer;
  font-size: 10px;
  background-color: inherit;
`;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const voices = speechSynthesis.getVoices();
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";
const languages = [
  { label: "En", value: "en-US" },
  { label: "Kr", value: "ko-KR" },
  { label: "Jp", value: "ja-JP" },
  { label: "Zh", value: "zh-CN" },
  // add more languages here
];

const InputMessage = () => {
  const { register, handleSubmit } = useForm();
  const [text, setText] = useRecoilState(inputText);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAPI);
  const [isListening, setIsListening] = useRecoilState(isListeningMic);
  const [note, setNote] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState("");
  const [allData, setAllData] = useRecoilState(chatDatas);
  const botTypePrompt = useRecoilValue(botPrompt);
  const [botType, setBotType] = useRecoilState(botCharacter);
  const isSound = useRecoilValue(isSoundOn);
  const inputRef = useRef<HTMLInputElement>(null);
  const category = botType.toLowerCase();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0].value);
  function getTimeNow() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedTime;
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [botType, currentLanguage]);

  const addData = (
    category: string,
    text: string,
    time: string,
    fromMe: boolean
  ) => {
    setAllData((prevData) => ({
      ...prevData,
      [category]: {
        myTextList: fromMe
          ? [
              ...prevData[category].myTextList,
              {
                id: prevData[category].myTextList.length + 1,
                text,
                time,
              },
            ]
          : [...prevData[category].myTextList],
        aiTextList: fromMe
          ? [...prevData[category].aiTextList]
          : [
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
    addData(category, text, getTimeNow(), true);
    setText("");
    const APIBody = {
      model: "text-davinci-003",
      prompt: `
      ${botTypePrompt}
      ${
        category !== "translation" &&
        allData[category].myTextList
          .map((data, i) => {
            return `You: ${data.text} \n ${characterName}: ${allData[category].aiTextList[i]}`;
          })
          .toString()
      }

      You : ${text}\n ${characterName}:`,
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
        let answerFromOpenAI: string = data.choices[0].text;
        answerFromOpenAI = answerFromOpenAI.replace("[object Object],", "");
        addData(category, answerFromOpenAI, getTimeNow(), false);
        setIsLoading(false);
        setAiAnswer(answerFromOpenAI);
      })
      .catch((error) => {
        console.log(error);
        addData(
          category,
          "failed to load text from ChatGPT",
          getTimeNow(),
          false
        );
        setIsLoading(false);
      });
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
  const handleChange = (event: any) => {
    setCurrentLanguage(event.target.value);
  };
  useEffect(() => {
    mic.lang = currentLanguage;
  }, [currentLanguage]);

  /////////////// Text to Speech //////////////////////

  useEffect(() => {
    if (isSound) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(aiAnswer);
      utterance.lang = currentLanguage;
      utterance.voice = voices.filter(
        (voice) => voice.lang === currentLanguage
      )[22]; //22
      utterance.volume = 0.7;
      utterance.rate = 1.1;
      synth.speak(utterance);
    }
  }, [aiAnswer]);
  return (
    <ChatBotForm onSubmit={handleSubmit(onValid)}>
      <input
        {...register("prompt", { required: true })}
        onChange={(e) => setText(e.target.value)}
        placeholder="add text"
        value={text}
        autoComplete="off"
        ref={inputRef}
      ></input>
      <Buttons>
        <SendButton onClick={callOpenApi} disabled={isLoading}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </SendButton>
        <MicButton onClick={() => setIsListening((prev) => !prev)}>
          <FontAwesomeIcon
            icon={isListening ? faMicrophoneSlash : faMicrophone}
          />
        </MicButton>
        <LanguageSelect value={currentLanguage} onChange={handleChange}>
          {languages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </LanguageSelect>
      </Buttons>
    </ChatBotForm>
  );
};

export default InputMessage;
