import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 flex-grow">
        {children}
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;