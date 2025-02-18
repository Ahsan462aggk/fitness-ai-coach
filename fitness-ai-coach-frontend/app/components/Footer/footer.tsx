import { FaDumbbell, FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'; 
 
 
 const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white w-100">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FaDumbbell className="text-2xl text-green-400" />
                <span className="text-xl font-bold">Al Trainer</span>
              </div>
              <p className="text-gray-400">Transform your body, transform your life.</p>
              <div className="flex gap-4">
                <FaInstagram className="text-2xl cursor-pointer hover:text-green-400" />
                <FaTwitter className="text-2xl cursor-pointer hover:text-green-400" />
                <FaFacebookF className="text-2xl cursor-pointer hover:text-green-400" />
                <FaYoutube className="text-2xl cursor-pointer hover:text-green-400" />
              </div>
            </div>
  
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <MdPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MdEmail />
                <span>support@altrainer.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MdLocationOn />
                <span>New York, USA</span>
              </div>
            </div>
  
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2 text-gray-400">
                <a href="#" className="hover:text-green-400">Privacy Policy</a>
                <a href="#" className="hover:text-green-400">Terms of Service</a>
                <a href="#" className="hover:text-green-400">FAQs</a>
                <a href="#" className="hover:text-green-400">Careers</a>
              </div>
            </div>
  
            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="bg-green-400 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-green-300 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2023 Al Trainer. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer