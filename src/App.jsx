import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import ModalSample from "./pages/ModalSample.jsx";
import MyPage from "./pages/MyPage.jsx";

function App() {
  return (
    // <Header />
    // <ModalSample/>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
