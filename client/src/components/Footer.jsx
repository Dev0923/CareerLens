import React from 'react';

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/onlydev0923/',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.94 7.5H3.56V20h3.38zM5.25 4a1.94 1.94 0 1 0 0 3.88 1.94 1.94 0 0 0 0-3.88ZM9.5 7.5h3.38v1.7c.5-.82 1.4-1.9 3.36-1.9 2.44 0 4.27 1.6 4.27 5.03V20h-3.38v-6.97c0-1.64-.58-2.76-2.04-2.76-1.2 0-1.9.75-2.21 1.48-.11.27-.14.63-.14 1V20H9.5z" />
      </svg>
    ),
  },
  {
    href: 'https://github.com/Dev0923',
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2.01c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.74.08-.73.08-.73 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.77.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.52.11-3.18 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.66.23 2.88.11 3.18.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.09.8 2.2v3.26c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    href: 'mailto:onlydevgdg@gmail.com',
    label: 'Gmail',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm8 6.15L20 8.5V8a.5.5 0 0 0-.5-.5H4.5A.5.5 0 0 0 4 8v.5zM4 10.73V16a.5.5 0 0 0 .5.5H19.5a.5.5 0 0 0 .5-.5v-5.27l-8 3.91z" />
      </svg>
    ),
  },
  {
    href: 'https://x.com/Dev1085125',
    label: 'Twitter / X',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M16.21 3.5h3.02l-6.6 7.56 7.77 9.44H14.7l-4.22-5.52-4.83 5.52H2.62l7.06-8.05L2.2 3.5h4.5l3.79 4.99z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/dev._in.motion/',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Zm4.25-3.75a1 1 0 1 1 1 1 1 1 0 0 1-1-1Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{
      background: '#000000',
      color: 'white',
      padding: '60px 40px 30px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '50px',
          marginBottom: '50px'
        }}>
          {/* Logo and Description Section */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <img 
                src="/Name.png" 
                alt="CareerLens Logo" 
                style={{ 
                  height: '200px',
                  width: '280px',
                  objectFit: 'contain',
                  display: 'block',
                  paddingLeft: '20px'
                }} 
              />
            </div>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#b8b8c7',
              marginBottom: '25px',
              textAlign: 'justify'
            }}>
              CareerLens is designed to provide intelligent resume analysis and career insights through automated evaluation and structured guidance. The platform focuses on improving resume quality, identifying skill gaps, and offering actionable career roadmaps aligned with industry requirements. All content on this website is copyright-protected and is the property of Resume Analyzer.
            </p>
            
            {/* Social Icons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {socialLinks.map((item) => (
                <a 
                  key={item.href} 
                  href={item.href} 
                  aria-label={item.label} 
                  target="_blank" 
                  rel="noreferrer" 
                  title={item.label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    fill: 'white'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#00B4A8';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ width: '18px', height: '18px' }}>
                    {item.icon}
                  </div>
                </a>
              ))}
            </div>

            {/* Footer Links */}
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              fontSize: '13px'
            }}>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{ paddingLeft: '40px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>Contact with us:</h3>
            
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>For Business Inquiry:</p>
              <a href="mailto:info@CareerLens.com" style={{
                color: '#00B4A8',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✉ devsantoriya818@gmail.com
              </a>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>For Support & Queries:</p>
              <a href="mailto:support@CareerLens.com" style={{
                color: '#00B4A8',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✉ onlydev@gmail.com
              </a>
            </div>

            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Call:</p>
              <a href="tel:+919870330830" style={{
                color: '#00B4A8',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📞 +91 7014934966
              </a>
            </div>
          </div>

          {/* Corporate Address Section */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>Corporate Address:</h3>

            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>India:</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#00B4A8', marginBottom: '5px' }}>Rajasthan:</p>
              <p style={{ fontSize: '13px', color: '#b8b8c7', lineHeight: '1.6' }}>
                B-3, 1th floor Colony Tower,A.G Colony, Jaipur,<br />
                Rajasthan 302015
              </p>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#00B4A8', marginBottom: '5px' }}>Bengaluru:</p>
              <p style={{ fontSize: '13px', color: '#b8b8c7', lineHeight: '1.6' }}>
                Wework Galaxy, 43, Residency Rd, Shanthala<br />
                Nagar, Ashok Nagar, Bengaluru, Karnataka<br />
                560025
              </p>
            </div>

            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>USA:</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#00B4A8', marginBottom: '5px' }}>Michigan:</p>
              <p style={{ fontSize: '13px', color: '#b8b8c7', lineHeight: '1.6' }}>
                2025, Long Lake, Troy, Michigan , 48098- Zip<br />
                Code, (248)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#b8b8c7',
            margin: 0
          }}>
            2026 © All rights reserved by CareerLens
          </p>

          {/* Certification Badges */}
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
          </div>
        </div>
      </div>
    </footer>
  );
}
