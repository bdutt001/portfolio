import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";


export default function App() {
  return (
      <div className="app">
        
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About></About>} />
          <Route path="/projects" element={<Projects></Projects>} />
        </Routes>
        <Footer />
      </div>
  );
}