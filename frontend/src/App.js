import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

//pages
import Home from "./pages/Home";
import Chat from "./pages/Chat";

//Context
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route exact path={"/"} element={<Home />} />
        <Route exact path={"/chat"} element={<Chat />} />
        {/* <Route path={'*'} element={ <NotFound/> } /> */}
      </Routes>
    </div>
  );
}

export default App;
