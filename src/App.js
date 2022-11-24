import HomePage from "./pages/home/HomePage.jsx";
import MainPage from "./pages/main/MainPage.jsx";
import RoomPage from "./pages/room/RoomPage.jsx";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div>
        <HashRouter>
          <Routes>
              <Route path='/main' element={<MainPage/>}/>
              <Route path='*' element={<HomePage/>}/>
              <Route path='/room' element={<RoomPage/>}/>
          </Routes>
        </HashRouter>
      </div>
    
  );
}

export default App;
