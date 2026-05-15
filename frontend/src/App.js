import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Confidentialite from "./pages/Confidentialite";
import Conditions from "./pages/Conditions";
import Cookies from "./pages/Cookies";
import Aide from "./pages/Aide";
import Sponsors from "./pages/Sponsors";
import Benevolat from "./pages/Benevolat";

function App() {
    const [lang, setLang] = useState("fr");

    return (
        <Router>
            <Navbar lang={lang} setLang={setLang} />
            <Routes>
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/about" element={<About lang={lang} />} />
                <Route path="/projects" element={<Projects lang={lang} />} />
                <Route path="/projects/:id" element={<ProjectDetail lang={lang} />} />
                <Route path="/blog" element={<Blog lang={lang} />} />
                <Route path="/contact" element={<Contact lang={lang} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/conditions" element={<Conditions />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/aide" element={<Aide />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/benevolat" element={<Benevolat lang={lang} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer lang={lang} />
        </Router>
    );
}

export default App;
