import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import RegisterHeader from "./components/RegisterHeader.jsx";
import ModalSample from "./pages/ModalSample.jsx";
import Main from "./pages/Main.jsx";
import ArticleWrite from "./pages/ArticleWrite.jsx";
import ArticleList from "./pages/ArticleList.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import KakaoRedirect from "./pages/KakaoRedirect";

function HeaderSelector() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/signup") return <RegisterHeader />;
  if (path === "/login") return null;
  if (path === "/") return null;
  return (
    <Header
      backgroundColor={"transparent"}
      textColor={"black"}
      logoColor={"dark"}
      border={true}
    />
  );
}

function App() {
  return (
    // <ModalSample/>
    <BrowserRouter>
      <HeaderSelector />
      <Routes>
        <Route Component={Main} path="/" />
        <Route path="/article-write" element={<ArticleWrite />} />
        <Route path="/article-list" element={<ArticleList />} />
        <Route path="/article-view" element={<ArticleView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth/kakao" element={<KakaoRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
