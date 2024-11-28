import React from "react";
import Link from "next/link";
import {
  Contact2,
  Facebook,
  Instagram,
  Linkedin,
  MailPlus,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { LogoBW } from "./LogoBW";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    { href: "/terms", label: "Terms and Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    // { href: "/cookie-policy", label: "Cookie Policy" },
    // { href: "/disclaimer", label: "Disclaimer" },
  ];

  return (
    <footer className="w-full bg-primary text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="mb-8 gap-10 md:grid md:grid-cols-3 lg:gap-20">
          <div className="mb-8 md:mb-0">
            <LogoBW />
            <p className="my-4 leading-normal">
              Private Equity Support (PES) is an enterprise support advisory
              consulting firm based in Nairobi, Kenya. Our mission is to
              successfully originate, de-risk, structure, and support Early
              Stage Financing (SME Investment) in Sub-Saharan Africa.
            </p>
          </div>
          <nav className="mb-8 md:mb-0">
            <p className="mb-3 font-semibold uppercase tracking-wider">
              Contact info
            </p>
            <div className="mb-4">
              <span className="flex gap-2">
                <Contact2 className="h-6 w-6" />
                Address:
              </span>
              <p className="mt-1">
                5th Floor, Timau Plaza, Argwings Kodhek Road, <br />
                Nairobi, Kenya.
              </p>
            </div>
            <div className="mb-4">
              <span className="flex gap-2">
                <Phone className="h-6 w-6" />
                Mobile:
              </span>
              <a href="tel:+254 707 151 783" className="mt-1 block hover:underline">
                +254 707 151 783
              </a>
            </div>
            <div className="mb-4">
              <span className="flex gap-2">
                <MailPlus className="h-6 w-6" />
                Email:
              </span>
              <a href="mailto:connect@privateequity-support.com" className="mt-1 block hover:underline">
                connect@privateequity-support.com
              </a>
            </div>
          </nav>
          <nav>
            <p className="mb-3 font-semibold uppercase tracking-wider">
              Legal & Policies
            </p>
            <ul className="space-y-2">
              {policyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between border-t border-gray-100 pt-10 md:flex-row md:items-center">
          <p className="mb-6 text-left text-sm md:mb-0">
            © Copyright {currentYear} Private Equity Support. All Rights
            Reserved.
          </p>
          <div className="flex items-start justify-start space-x-6 md:items-center md:justify-center">
            <a href="https://twitter.com/PrivateEquityAF" className="hover:text-gray-300">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/privateequityea/" className="hover:text-gray-300">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com/company/privateequityaf" className="hover:text-gray-300">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://www.youtube.com/@PrivateEquitySupport/" className="hover:text-gray-300">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/privateequityaf/" className="hover:text-gray-300">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;