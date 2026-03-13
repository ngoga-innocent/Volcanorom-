const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            VolcanoRom
          </h2>

          <p className="text-sm leading-relaxed text-gray-400">
            VolcanoRom is a professional platform where developers and
            tech enthusiasts can access premium tools, resources and
            software to boost productivity.
          </p>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-5">
            <a
              href="#"
              className="hover:text-white transition"
            >
              🌐
            </a>
            <a
              href="#"
              className="hover:text-white transition"
            >
              🐦
            </a>
            <a
              href="#"
              className="hover:text-white transition"
            >
              💼
            </a>
            <a
              href="#"
              className="hover:text-white transition"
            >
              📸
            </a>
          </div>
        </div>

        {/* PRODUCT */}
        

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            VOLCANOROM
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>

           

            

            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Support
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <a href="/help" className="hover:text-white">
                Help Center
              </a>
            </li>

            <li>
              <a href="/terms" className="hover:text-white">
                Terms of Service
              </a>
            </li>

            <li>
              <a href="/contact" className="hover:text-white">
                Contact Us
              </a>
            </li>

            <li>
              <a href="/refund" className="hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

          <p>
            © {new Date().getFullYear()} VolcanoRom. All rights reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="/terms" className="hover:text-white">
              Terms
            </a>

            <a href="/terms" className="hover:text-white">
              Privacy
            </a>

            <a href="#" className="hover:text-white">
              Cookies
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;