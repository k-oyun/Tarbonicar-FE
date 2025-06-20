import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ModalSample from "./pages/ModalSample.jsx";
import ArticleWrite from "./pages/ArticleWrite.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import MyPage from "./pages/MyPage.jsx";
import MyArticle from "./pages/MyArticle.jsx";

function App() {
  return (
    // <Header />
    // <ModalSample/>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/myarticle" element={<MyArticle />} />
        <Route path="/article-write" element={<ArticleWrite />} />
        <Route path="/article-view" element={<ArticleView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
