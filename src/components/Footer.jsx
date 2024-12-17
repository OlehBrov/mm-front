import React from "react";
import { FooterCartSection } from "./FooterCartSection";
import { useLocation } from "react-router-dom";
import { FooterCartCountSection } from "./FooterCartCountSection";

export const Footer = () => {
    const location = useLocation()
    const cartLocation = location.pathname === "/cart"
  return (
      <footer>
          {!cartLocation && <FooterCartSection />}
          {cartLocation && <FooterCartCountSection/>}
      <div className="footer-contacts-grid">
        <div className="footer-grid-item">
          <p>Гаряча лінія</p>
          <p>0800 123 22 0</p>
        </div>
        <div className="footer-grid-item">
          <p>Технічна підтримка</p>
          <p>0800 123 22 0</p>
        </div>
        <div className="footer-grid-item">
          <p>Відділ продажів</p>
          <p>0800 123 22 0</p>
        </div>
      </div>
    </footer>
  );
};
