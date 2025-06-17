import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import ModalSample from "./pages/ModalSample.jsx";
import Main from "./pages/Main.jsx";

function App() {
  return (
    // <Header />
    // <ModalSample/>
    <BrowserRouter>
      <Routes>
        <Route Component={Main} path="/" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
