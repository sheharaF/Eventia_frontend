import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SearchResults from "./pages/SearchResults";
import Intro from "./components/HomePage/Intro";
import BackToTop from "./components/BacktoTop";
import PackageResults from "./pages/PackageResults";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/package-results" element={<PackageResults />} />
        </Routes>
      </Router>
      <BackToTop />
    </>
  );
};

export default App;
