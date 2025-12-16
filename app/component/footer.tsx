import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear(); // Automatically get current year

  return (
    <footer className="w-full bg-gray-700 text-amber-50 text-center py-4 text-lg">
      <p>
        &copy; {currentYear} Getahun. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
