import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              🌍 Horizon Travel
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted partner in crafting unforgettable travel
              experiences. Explore the world with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Destinations
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400 text-sm">Bali, Indonesia</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">Paris, France</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">
                  Santorini, Greece
                </span>
              </li>
              <li>
                <span className="text-slate-400 text-sm">
                  Maldives
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <ul className="space-y-2">
              <li className="text-slate-400 text-sm">
                123 Travel Street, Adventure City
              </li>
              <li className="text-slate-400 text-sm">
                info@horizontravel.com
              </li>
              <li className="text-slate-400 text-sm">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Horizon Travel. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
