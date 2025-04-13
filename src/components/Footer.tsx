
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-sphere-dark py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Sphere Finance</h3>
            <p className="text-gray-400 text-sm">
              Revolutionary P2P lending platform with advanced testnet mining capabilities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/testnet" className="hover:text-sphere-green">Testnet</Link></li>
              <li><Link to="/mining" className="hover:text-sphere-green">Mining</Link></li>
              <li><Link to="/premium" className="hover:text-sphere-green">Premium</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/docs" className="hover:text-sphere-green">Documentation</Link></li>
              <li><a href="#" className="hover:text-sphere-green">Github</a></li>
              <li><a href="#" className="hover:text-sphere-green">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-sphere-green">Twitter</a></li>
              <li><a href="#" className="hover:text-sphere-green">Discord</a></li>
              <li><a href="#" className="hover:text-sphere-green">Telegram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Sphere Finance. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
