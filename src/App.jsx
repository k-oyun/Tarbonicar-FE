import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ModalSample from "./pages/ModalSample.jsx";
import Main from "./pages/Main.jsx";
import ArticleWrite from "./pages/ArticleWrite.jsx";
import ArticleList from "./pages/ArticleList.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    // <ModalSample/>
    <BrowserRouter>
      <Routes>
        <Route Component={Main} path="/" />
        <Route path="/article-write" element={<ArticleWrite />} />
        <Route path="/article-list" element={<ArticleList />} />
        <Route path="/article-view" element={<ArticleView />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
