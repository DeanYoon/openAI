import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { character } from "./Components/characterData";
import { IUserData } from "./Components/KakaoLogin";

const { persistAtom } = recoilPersist();

export const loginState = atom({
  key: "isLoggedIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const UserData = atom<IUserData>({
  key: "UserData",
  default: {
    id: 0,
    nickname: "",
    profile_image: "",
  },
  effects_UNSTABLE: [persistAtom],
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
export const isSoundOn = atom({
  key: "isSoundOn",
  default: true,
  effects_UNSTABLE: [persistAtom],
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
const initialChatData = {
  myTextList: [],
  aiTextList: [],
};

export const chatDatas = atom<IAllData>({
  key: "chatDatas",
  default: Object.fromEntries(
    character.map(({ title }) => [title.toLowerCase(), initialChatData])
  ),
  effects_UNSTABLE: [persistAtom],
});
