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
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/conditions" element={<Conditions />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/aide" element={<Aide />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/benevolat" element={<Benevolat lang={lang} />} />
                <Route path="/evenements" element={<Events />} />
                <Route path="/volunteer/login" element={<VolunteerLogin />} />
                <Route path="/volunteer/register" element={<VolunteerRegister />} />
                <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
                <Route path="/volunteer/forgot-password" element={<ForgotPassword />} />
                <Route path="/volunteer/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer lang={lang} />
        </Router>
    );
}

export default App;
