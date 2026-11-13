// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app">
      <Header></Header>
      <Routes>
          <Route path="/" element={<Home />} />           {/* header on all of these */}
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
      </Routes>
      <Footer></Footer>
    </div>
    
  );
}