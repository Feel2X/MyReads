// navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";
// custom components
import BookShelf from "./components/BookShelf";
import BookSearch from "./components/BookSearch";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={
                <BookShelf />
            } />
            <Route path="/add" element={
                <BookSearch />
            } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;