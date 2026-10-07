import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

/**
 * Component for managing meta tags to improve SEO
 */
const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'Task Prioritizer | Compare Tasks & Decide What’s Next',
  description = 'Compare two tasks at a time to build an ordered to-do list. Import tasks, mark them complete, and export your priorities with this free browser-based task prioritizer.',
  canonicalUrl = 'https://task-prioritizer.dracars.com/',
}) => {
  const socialImageUrl = new URL('social-preview.png', canonicalUrl).href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Task Prioritizer" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta
        property="og:image:alt"
        content="Task Prioritizer: compare tasks to turn a list into a ranked to-do list."
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content="Compare two tasks at a time to build an ordered to-do list."
      />
      <meta name="twitter:image" content={socialImageUrl} />
      <meta
        name="twitter:image:alt"
        content="Task Prioritizer: compare tasks to turn a list into a ranked to-do list."
      />
    </Helmet>
  );
};

export default MetaTags;
