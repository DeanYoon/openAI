import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { character } from "./Components/characterData";
const { persistAtom } = recoilPersist();

export const myTextList = atom<ITextData[]>({
  key: "myText",
  default: [],
});
export const aiTextList = atom<ITextData[]>({
  key: "aiText",
  default: [],
});

export const widthSize = atom({
  key: "width",
  default: window.innerWidth,
});

export interface iApiKey {
  API: string;
}

export const apiKey = atom({
  key: "apiKey",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const inputText = atom({
  key: "inputText",
  default: "",
});

export const isLoadingAPI = atom({
  key: "isLoadingAPI",
  default: false,
});
export const isListeningMic = atom({
  key: "isListeningMic",
  default: false,
});

export const botPrompt = atom({
  key: "botPrompt",
  default: character[0].text,
});

export const botCharacter = atom({
  key: "botType",
  default: character[0].title,
});
export interface ITextData {
  id: number;
  text: string;
  time: string;
}

export interface IChatData {
  myTextList: ITextData[];
  aiTextList: ITextData[];
}
interface IAllData {
  [key: string]: IChatData;
}

export const chatDatas = atom<IAllData>({
  key: "chatData",
  default: {
    sarcastic: {
      myTextList: [],
      aiTextList: [],
    },
    lovely: {
      myTextList: [],
      aiTextList: [],
    },
    exhausted: {
      myTextList: [],
      aiTextList: [],
    },
  },
  effects_UNSTABLE: [persistAtom],
});
