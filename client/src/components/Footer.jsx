function Footer() {
  return (
    <footer className="relative z-20 mt-20 border-t border-neonBlue bg-black/40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">

        <h2 className="text-xl font-bold text-neonPink drop-shadow-[0_0_10px_#FF2E9F]">
          InkNova
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Your Stories. Reimagined.
        </p>

        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <a href="#" className="hover:text-neonBlue transition duration-300">
            About
          </a>
          <a href="#" className="hover:text-neonPink transition duration-300">
            Privacy
          </a>
          <a href="#" className="hover:text-neonBlue transition duration-300">
            Contact
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} InkNova. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;