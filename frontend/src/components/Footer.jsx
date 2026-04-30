import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div>© 2026 RankMyCV. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact Us</span>
            </div>
        </div>

    );

}

export default Footer;