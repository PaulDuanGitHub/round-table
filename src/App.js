import Homepage from "./pages/home/homepage";
import Main from "./pages/main/main";
import Room from "./pages/room/room.jsx";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div>
        <HashRouter>
          <Routes>
              <Route path='/main' element={<Main/>}/>
              <Route path='*' element={<Homepage/>}/>
              <Route path='/room' element={<Room/>}/>
          </Routes>
        </HashRouter>
      </div>
    
  );
}

export default App;
