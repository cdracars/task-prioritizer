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
  title = 'Task Prioritizer - Organize Your Tasks Effectively',
  description = 'A simple app to help you prioritize your tasks through pairwise comparisons',
  canonicalUrl = 'https://taskprioritizer.app',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${canonicalUrl}/icons/logo512.png`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta
        property="twitter:image"
        content={`${canonicalUrl}/icons/logo512.png`}
      />
    </Helmet>
  );
};

export default MetaTags;
