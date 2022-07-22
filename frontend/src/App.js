import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';

//pages
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route exact path={"/"} element={ <Home/> } />
          <Route exact path={"/chat"} element={ <Chat /> } />
          {/* <Route path={'*'} element={ <NotFound/> } /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
