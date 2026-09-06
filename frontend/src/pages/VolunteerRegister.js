import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { volunteerRegister } from "../services/volunteerApi";

const GREEN = "#2D6A4F";

const T = {
    fr: {
        quote: "Chaque geste compte. Rejoignez une communauté qui agit concrètement.", quoteAuthor: "— L'équipe Terra Sana",
        title: "Créer un compte bénévole", sub: "Rejoignez la communauté Terra Sana",
        required: "Champ obligatoire",
        firstName: "Prénom", lastName: "Nom", email: "Email", password: "Mot de passe (min. 8 caractères)",
        passwordPh: "Choisissez un mot de passe",
        phone: "Téléphone", birthDate: "Date de naissance", gender: "Genre",
        select: "— Sélectionner —", male: "Homme", female: "Femme", other: "Autre / Non précisé",
        city: "Ville", postalCode: "Code postal",
        skills: "Compétences", skillsPh: "Ex : cuisine, communication, logistique...",
        availability: "Disponibilités", availabilityPh: "Ex : week-ends, mercredis après-midi...",
        preferredLanguage: "Langue préférée",
        creating: "Création du compte...", submit: "Créer mon compte",
        alreadyAccount: "Déjà un compte ?", login: "Se connecter",
        genericError: "Une erreur est survenue lors de l'inscription.", serverError: "Impossible de contacter le serveur."
    },
    en: {
        quote: "Every action counts. Join a community that takes real action.", quoteAuthor: "— The Terra Sana team",
        title: "Create a volunteer account", sub: "Join the Terra Sana community",
        required: "Required field",
        firstName: "First name", lastName: "Last name", email: "Email", password: "Password (min. 8 characters)",
        passwordPh: "Choose a password",
        phone: "Phone", birthDate: "Date of birth", gender: "Gender",
        select: "— Select —", male: "Male", female: "Female", other: "Other / Prefer not to say",
        city: "City", postalCode: "Postal code",
        skills: "Skills", skillsPh: "E.g.: cooking, communication, logistics...",
        availability: "Availability", availabilityPh: "E.g.: weekends, Wednesday afternoons...",
        preferredLanguage: "Preferred language",
        creating: "Creating account...", submit: "Create my account",
        alreadyAccount: "Already have an account?", login: "Log in",
        genericError: "An error occurred while registering.", serverError: "Could not contact the server."
    },
    nl: {
        quote: "Elke actie telt. Sluit je aan bij een gemeenschap die concreet handelt.", quoteAuthor: "— Het Terra Sana-team",
        title: "Vrijwilligersaccount aanmaken", sub: "Sluit je aan bij de Terra Sana-gemeenschap",
        required: "Verplicht veld",
        firstName: "Voornaam", lastName: "Naam", email: "E-mail", password: "Wachtwoord (min. 8 tekens)",
        passwordPh: "Kies een wachtwoord",
        phone: "Telefoon", birthDate: "Geboortedatum", gender: "Geslacht",
        select: "— Selecteer —", male: "Man", female: "Vrouw", other: "Ander / Niet gespecificeerd",
        city: "Stad", postalCode: "Postcode",
        skills: "Vaardigheden", skillsPh: "Bv.: koken, communicatie, logistiek...",
        availability: "Beschikbaarheid", availabilityPh: "Bv.: weekends, woensdagnamiddagen...",
        preferredLanguage: "Voorkeurstaal",
        creating: "Account aanmaken...", submit: "Mijn account aanmaken",
        alreadyAccount: "Al een account?", login: "Inloggen",
        genericError: "Er is een fout opgetreden bij de inschrijving.", serverError: "Kan geen contact maken met de server."
    }
};

function VolunteerRegister({ lang }) {
    const t = T[lang] || T.fr;
    const Required = () => <span title={t.required} style={s.requiredMark}>?</span>;

    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", birthDate: "", gender: "", city: "", postalCode: "", skills: "", availability: "", preferredLanguage: "fr" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await volunteerRegister(form);
            if (!data.token) {
                setError(data.message || t.genericError);
                setLoading(false);
                return;
            }
            localStorage.setItem("volunteerToken", data.token);
            navigate("/volunteer/dashboard");
        } catch {
            setError(t.serverError);
        }
        setLoading(false);
    };

    return (
        <div className="split-panel" style={s.page}>
            <div className="split-panel-image" style={s.imagePanel}>
                <span style={s.leafIcon}>🌿</span>
                <div style={s.imageOverlay}>
                    <div style={s.quoteMark}>"</div>
                    <p style={s.quote}>{t.quote}</p>
                    <div style={s.quoteAuthor}>{t.quoteAuthor}</div>
                </div>
            </div>

            <div className="split-panel-form" style={s.formPanel}>
            <div style={s.card}>
                <div style={s.logo}>
                    <div style={{ ...s.logoIcon, background: GREEN }}>TS</div>
                    <span style={s.logoText}>Terra<span style={{ color: GREEN }}>Sana</span></span>
                </div>
                <h1 style={s.title}>{t.title}</h1>
                <p style={s.sub}>{t.sub}</p>

                {error && <div style={s.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={s.form}>
                    <div className="grid-responsive" style={s.grid2}>
                        <div style={s.row}>
                            <label style={s.label}>{t.firstName}<Required /></label>
                            <input value={form.firstName} onChange={set("firstName")} name="given-name" autoComplete="given-name" style={s.input} placeholder={t.firstName} required />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>{t.lastName}<Required /></label>
                            <input value={form.lastName} onChange={set("lastName")} name="family-name" autoComplete="family-name" style={s.input} placeholder={t.lastName} required />
                        </div>
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>{t.email}<Required /></label>
                        <input type="email" name="email" autoComplete="email" value={form.email} onChange={set("email")} style={s.input} placeholder="votre@email.com" required />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>{t.password}<Required /></label>
                        <input type="password" name="new-password" autoComplete="new-password" value={form.password} onChange={set("password")} style={s.input} placeholder={t.passwordPh} required minLength={8} />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>{t.phone}</label>
                        <input value={form.phone} onChange={set("phone")} style={s.input} placeholder="+32 xxx xx xx xx" />
                    </div>
                    <div className="grid-responsive" style={s.grid2}>
                        <div style={s.row}>
                            <label style={s.label}>{t.birthDate}</label>
                            <input type="date" value={form.birthDate} onChange={set("birthDate")} style={s.input} />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>{t.gender}</label>
                            <select value={form.gender} onChange={set("gender")} style={s.input}>
                                <option value="">{t.select}</option>
                                <option value="M">{t.male}</option>
                                <option value="F">{t.female}</option>
                                <option value="X">{t.other}</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid-responsive" style={s.grid2}>
                        <div style={s.row}>
                            <label style={s.label}>{t.city}</label>
                            <input value={form.city} onChange={set("city")} style={s.input} placeholder="Bruxelles" />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>{t.postalCode}</label>
                            <input value={form.postalCode} onChange={set("postalCode")} style={s.input} placeholder="1000" />
                        </div>
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>{t.skills}</label>
                        <input value={form.skills} onChange={set("skills")} style={s.input} placeholder={t.skillsPh} />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>{t.availability}</label>
                        <input value={form.availability} onChange={set("availability")} style={s.input} placeholder={t.availabilityPh} />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>{t.preferredLanguage}</label>
                        <select value={form.preferredLanguage} onChange={set("preferredLanguage")} style={s.input}>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="nl">Nederlands</option>
                        </select>
                    </div>
                    <button type="submit" style={{ ...s.btn, background: GREEN }} disabled={loading}>
                        {loading ? t.creating : t.submit}
                    </button>
                </form>

                <p style={s.link}>
                    {t.alreadyAccount}{" "}
                    <Link to="/volunteer/login" style={{ color: GREEN, fontWeight: "600" }}>{t.login}</Link>
                </p>
            </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: "100vh", display: "flex", background: "#F8F4E3" },
    imagePanel: {
        flex: "1 1 40%",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        background: "linear-gradient(160deg, #173C29, #2D6A4F)",
        display: "flex",
        alignItems: "flex-end",
        padding: "48px"
    },
    leafIcon: { position: "absolute", top: "42%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "160px", opacity: 0.12, pointerEvents: "none" },
    imageOverlay: { maxWidth: "360px", position: "relative" },
    quoteMark: { fontSize: "48px", color: "#D4A017", fontFamily: "Georgia, serif", lineHeight: "0.5", marginBottom: "12px" },
    quote: { color: "#fff", fontSize: "19px", fontWeight: "600", lineHeight: "1.5", marginBottom: "14px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    quoteAuthor: { color: "#74C69D", fontSize: "13px", fontWeight: "600" },
    formPanel: { flex: "1 1 60%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "40px", width: "480px", maxWidth: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
    logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },
    logoIcon: { color: "#fff", fontWeight: "bold", fontSize: "14px", width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontSize: "18px", fontWeight: "bold", color: "#1B1B1B" },
    title: { fontSize: "22px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "6px" },
    sub: { fontSize: "13px", color: "#888", marginBottom: "24px" },
    error: { background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px" },
    form: { display: "flex", flexDirection: "column", gap: "14px" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    requiredMark: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "14px", height: "14px", borderRadius: "50%", background: "#D4A017", color: "#fff", fontSize: "10px", fontWeight: "bold", marginLeft: "5px", cursor: "help", verticalAlign: "middle" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
    btn: { color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "4px" },
    link: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" }
};

export default VolunteerRegister;
