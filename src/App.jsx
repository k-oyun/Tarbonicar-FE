import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ModalSample from "./pages/ModalSample.jsx";
import ArticleWrite from "./pages/ArticleWrite.jsx";
import BoardList from "./pages/BoardList.jsx";

function App() {
    return (
        // <ModalSample/>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/article-write" element={<ArticleWrite />} />
                <Route path="/article-list" element={<BoardList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
