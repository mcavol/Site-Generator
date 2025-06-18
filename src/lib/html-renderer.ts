import type { ContentSection } from '@/types';

interface SiteRenderData {
  title: string;
  metaDescription: string;
  contentSections: ContentSection[];
}

export function renderSiteToHtml(siteData: SiteRenderData): string {
  const sectionsHtml = siteData.contentSections
    .map(
      (section) => `
    <section style="margin-bottom: 2rem; padding: 1.5rem; border: 1px solid #dee2e6; border-radius: 0.5rem; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2 style="font-size: 1.75em; color: #343a40; margin-top:0; margin-bottom: 1rem; font-family: 'Space Grotesk', sans-serif; border-bottom: 2px solid #29ABE2; padding-bottom: 0.5rem;">${section.heading}</h2>
      <p style="font-size: 1em; line-height: 1.7; color: #495057; font-family: 'Inter', sans-serif;">${section.content.replace(/\n/g, '<br />')}</p>
    </section>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${siteData.metaDescription}">
  <title>${siteData.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { 
      font-family: 'Inter', sans-serif; 
      margin: 0; 
      padding: 2rem; 
      background-color: #E5F6FD; /* Theme background */
      color: #212529; /* Theme foreground */
      line-height: 1.6;
    }
    .container { 
      max-width: 960px; 
      margin: 2rem auto; 
      background-color: #ffffff; 
      padding: 2.5rem; 
      border-radius: 0.75rem; 
      box-shadow: 0 8px 16px rgba(0,0,0,0.1); 
    }
    h1 { 
      font-family: 'Space Grotesk', sans-serif; 
      color: #29ABE2; /* Theme primary */
      text-align: center; 
      font-size: 2.8em; 
      margin-bottom: 2.5rem; 
      font-weight: 700;
    }
    /* Styles for sections are mostly inline, but some base can be here */
    section h2 {
      font-weight: 700;
    }
    section p {
      font-weight: 400;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${siteData.title}</h1>
    ${sectionsHtml}
  </div>
</body>
</html>
  `;
}
