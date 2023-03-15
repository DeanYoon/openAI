import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Chat from "./Routes/Chat";
import Image from "./Routes/Image";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/openAI/" element={<Home />}></Route>
        <Route path="/openAI/chat" element={<Chat />}></Route>
        <Route path="/openAI/image" element={<Image />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
