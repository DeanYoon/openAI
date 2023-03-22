import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export interface iTextData {
  id: number;
  text: string;
}

export interface iChatBubbleProps {
  id: number;
  text: string;
  i: number;
}

export const myTextList = atom<iTextData[]>({
  key: "myText",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const aiTextList = atom<iTextData[]>({
  key: "aiText",
  default: [],
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
