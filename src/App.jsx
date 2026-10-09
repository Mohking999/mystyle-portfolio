import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hero from "./components/sections/Hero.jsx";
import About from "./components/sections/About.jsx";
import Projects from "./components/sections/Projects.jsx";
import Skills from "./components/sections/Skills.jsx";
import Certificates from "./components/sections/Certificates.jsx";
import Contact from "./components/sections/Contact.jsx";
import useTheme from "./hooks/useTheme.js";
import DesktopPet from "./components/ui/DesktopPet.jsx";
import CustomCursor from "./components/ui/CustomCursor.jsx";

export default function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <>
      <CustomCursor />
      <a href="#main-content" className="visually-hidden">Skip to content</a>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <DesktopPet />
    </>
  );
}
