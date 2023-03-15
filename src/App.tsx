import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Chat from "./Routes/Chat";
import Image from "./Routes/Image";
import Header from "./Components/Header";
import { useEffect } from "react";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
        <Route path="/image" element={<Image />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
