import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
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
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/conditions" element={<Conditions />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/aide" element={<Aide />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/benevolat" element={<Benevolat />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
