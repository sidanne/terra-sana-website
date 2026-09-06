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
import Events from "./pages/Events";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";

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
                <Route path="/login" element={<Login lang={lang} />} />
                <Route path="/admin" element={<Admin lang={lang} />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword lang={lang} />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword lang={lang} />} />
                <Route path="/confidentialite" element={<Confidentialite lang={lang} />} />
                <Route path="/conditions" element={<Conditions lang={lang} />} />
                <Route path="/cookies" element={<Cookies lang={lang} />} />
                <Route path="/aide" element={<Aide lang={lang} />} />
                <Route path="/sponsors" element={<Sponsors lang={lang} />} />
                <Route path="/benevolat" element={<Benevolat lang={lang} />} />
                <Route path="/evenements" element={<Events lang={lang} />} />
                <Route path="/volunteer/login" element={<VolunteerLogin lang={lang} />} />
                <Route path="/volunteer/register" element={<VolunteerRegister lang={lang} />} />
                <Route path="/volunteer/dashboard" element={<VolunteerDashboard lang={lang} />} />
                <Route path="/volunteer/forgot-password" element={<ForgotPassword lang={lang} />} />
                <Route path="/volunteer/reset-password" element={<ResetPassword lang={lang} />} />
                <Route path="*" element={<NotFound lang={lang} />} />
            </Routes>
            <Footer lang={lang} />
        </Router>
    );
}

export default App;
