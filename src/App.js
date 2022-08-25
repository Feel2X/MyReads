// navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";
// custom components
import BookShelf from "./components/BookShelf/BookShelf";
import BookSearch from "./components/BookSearch/BookSearch";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={
                <BookShelf />
            } />
            <Route path="/search" element={
                <BookSearch />
            } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;