import React from 'react';
import {FaApple, FaGooglePlay, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { AiFillFacebook, AiFillInstagram, AiFillTwitterCircle, AiFillLinkedin, AiFillGithub } from 'react-icons/ai';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 px-4">
        
        {/* App Download */}
        <div>
          <h3 className="text-lg font-bold mb-4">Download Our App</h3>
          <div className="flex space-x-4" aria-label="App download links">
            <a href="#" aria-label="Download on Apple Store">
              <FaApple className="w-8 h-8 hover:text-gray-300" />
            </a>
            <a href="#" aria-label="Download on Google Play">
              <FaGooglePlay className="w-8 h-8 hover:text-gray-300" />
            </a>
          </div>
        </div>

        {/* Special Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Special</h3>
         <ul>
          <li><Link href="/dealsw">Flash Deals</Link></li>
          <li><Link href="/products?filter=latest">Latest Products</Link></li>
          <li><Link href="/best-sellers">Best Selling Products</Link></li> 
          <li><Link href="/support">Support</Link></li> 
          <li><Link href="/faq">FAQ</Link></li> 
          <li><Link href="/vendor/dashboard">Sell</Link></li> 
        </ul>
        </div>

        {/* Account & Shipping Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Account & Shipping</h3>
          <ul>
            <li><Link href="/user/profile">Profile Info</Link></li>
            <li><Link href="/support">Customer Support</Link></li>
            <li><Link href="/track-order">Track Order</Link></li>
            <li><Link href="/faq">Refund Policy</Link></li>
            <li><Link href="/faq">Return Policy</Link></li>
            <li><Link href="/faq">Cancellation Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-bold mb-4">Newsletter</h3>
          <p>Subscribe to get the latest updates</p>
          <form className="mt-4" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter Form">
            <input
              type="email"
              placeholder="Your Email Address"
              required
              className="p-2 rounded-md w-full text-black"
              aria-label="Email address"
            />
            <button type="submit" className="mt-2 w-full bg-blue-700 p-2 rounded-md hover:bg-blue-800">
              Subscribe
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center"><FaPhoneAlt className="mr-2" /> +46 720 040 449</li>
            <li className="flex items-center"><FaEnvelope className="mr-2" /> info@sahanso.com</li>
            <li className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Kvarnhagsgatan, Hässelby 12401</li>
            <li className="flex items-center"><FaWhatsapp className="mr-2" /> Support Ticket</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container mx-auto mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-gray-400 text-sm">© SAHANSO {new Date().getFullYear()}</p>

        <div className="flex space-x-4 mt-4 md:mt-0" aria-label="Social media links">
          <a href="#"><AiFillTwitterCircle className="w-6 h-6 hover:text-gray-300" /></a>
          <a href="#"><AiFillLinkedin className="w-6 h-6 hover:text-gray-300" /></a>
          <a href="#"><AiFillGithub className="w-6 h-6 hover:text-gray-300" /></a>
          <a href="#"><AiFillInstagram className="w-6 h-6 hover:text-gray-300" /></a>
          <a href="#"><AiFillFacebook className="w-6 h-6 hover:text-gray-300" /></a>
        </div>

        <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
          <a href="#" className="text-gray-400 hover:text-white">Terms</a>
          <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
