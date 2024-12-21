import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.copyright}>© 2024 IT Club</p>
        <div style={styles.socialLinks}>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#282c34',
    color: '#fff',
    padding: '10px 0',
    textAlign: 'center',
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  copyright: {
    margin: 0,
    fontSize: '14px',
  },
  socialLinks: {
    marginTop: '10px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 10px',
    fontSize: '16px',
  },
};

export default Footer;
