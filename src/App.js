import Homepage from "./pages/home/homepage";
import Index from "./pages/index";
import Room from "./pages/room/room.jsx";
import Test2 from "./pages/test2";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div>
        <BrowserRouter>
          <Routes>
              <Route path='/index' element={<Index/>}/>
              <Route path='*' element={<Homepage/>}/>
              <Route path='/room' element={<Room/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    
  );
}

export default App;
