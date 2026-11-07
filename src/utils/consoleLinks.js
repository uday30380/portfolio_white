/**
 * Portfolio Links Console Logger
 * Prints interactive, styled directory of all site routes, anchors, and social links in DevTools.
 */

export const initConsoleLinks = (portfolioData) => {
  if (typeof window === 'undefined') return;

  const currentOrigin = window.location.origin;

  const pages = [
    { Name: 'Home (Portfolio)', URL: `${currentOrigin}/`, Type: 'Page' },
    { Name: 'Resume', URL: `${currentOrigin}/resume`, Type: 'Page' },
    { Name: 'Honors and Certifications', URL: `${currentOrigin}/honors`, Type: 'Page' },
    { Name: 'Blog', URL: `${currentOrigin}/blog`, Type: 'Page' },
    { Name: 'Admin Portal', URL: `${currentOrigin}/admin`, Type: 'Protected' },
    { Name: 'Login', URL: `${currentOrigin}/login`, Type: 'Auth' },
    { Name: 'Sign Up', URL: `${currentOrigin}/signup`, Type: 'Auth' },
  ];

  const sections = [
    { Section: 'Hero', Anchor: `${currentOrigin}/#hero` },
    { Section: 'Selected Work', Anchor: `${currentOrigin}/#work` },
    { Section: 'About & Timeline', Anchor: `${currentOrigin}/#about` },
    { Section: 'Skills', Anchor: `${currentOrigin}/#skills` },
    { Section: 'Honors and Certifications', Anchor: `${currentOrigin}/#honors` },
    { Section: 'Testimonials', Anchor: `${currentOrigin}/#testimonials` },
    { Section: 'Contact', Anchor: `${currentOrigin}/#contact` },
  ];

  const socials = [
    { Platform: 'GitHub', URL: portfolioData?.social?.github || 'https://github.com/uday30380' },
    { Platform: 'LinkedIn', URL: portfolioData?.social?.linkedin || 'https://www.linkedin.com/in/uday-kiran-vempati-9a9972288/' },
    { Platform: 'Instagram', URL: portfolioData?.social?.instagram || 'https://www.instagram.com/uday_kiran_30_/' },
    { Platform: 'Email', URL: `mailto:${portfolioData?.contact?.email || 'udaykiranvempati123@gmail.com'}` },
    { Platform: 'Phone', URL: `tel:${portfolioData?.contact?.phone || '+918019400000'}` },
  ];

  window.__PORTFOLIO_LINKS__ = { pages, sections, socials };
  window.listLinks = () => {
    console.group('Portfolio Navigation Directory');
    console.table(pages);
    console.table(sections);
    console.table(socials);
    console.groupEnd();
  };

  try {
    console.log(
      `%c UDAY KIRAN VEMPATI %c\n` +
      `%c • Portfolio: ${currentOrigin}\n` +
      ` • Total Pages: ${pages.length}\n` +
      ` • Total Sections: ${sections.length}\n` +
      ` • Run window.listLinks() anytime to display tables`,
      'background: #0F766E; color: #ffffff; font-weight: 600; font-size: 12px; padding: 4px 8px; border-radius: 4px;',
      '',
      'color: #4B5F5C; font-size: 11px; line-height: 1.6;'
    );
  } catch {
    // Silent fail in environments without console table styling
  }
};
