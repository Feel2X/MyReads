import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<div>Hello world</div>} />
            <Route exact path="/add" element={<div>Add</div>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
