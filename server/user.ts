export type IUser = {
  id: number;
  username: string;
  profileUrl: string;
  chatData: {
    [key: string]: {
      myTextList: Array<{
        text: string;
        createdAt: string;
        updatedAt: string;
      }>;
      aiTextList: Array<{
        text: string;
        createdAt: string;
        updatedAt: string;
      }>;
    };
  };
};
