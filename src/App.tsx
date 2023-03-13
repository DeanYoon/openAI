import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Text from "./Routes/Text";
import Image from "./Routes/Image";
import Header from "./Components/Header";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/text" element={<Text />}></Route>
        <Route path="/image" element={<Image />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
