import Navbar from "../components/HomePage/Navbar";
import Hero from "../components/HomePage/Hero";
import Features from "../components/HomePage/Features";
import Packages from "../components/HomePage/Packages";
import Footer from "../components/HomePage/Footer";
import Intro from "../components/HomePage/Intro";
import SearchBox from "../components/HomePage/SearchBox";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <SearchBox />
      <Intro />
      <Features />
      <Packages />
      <Footer />
    </div>
  );
};

export default Home;
