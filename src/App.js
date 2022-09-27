import Homepage from "./pages/home/homepage";
import Main from "./pages/main/main";
import Room from "./pages/room/room.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div>
        <BrowserRouter>
          <Routes>
              <Route path='/main' element={<Main/>}/>
              <Route path='*' element={<Homepage/>}/>
              <Route path='/room' element={<Room/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    
  );
}

export default App;
