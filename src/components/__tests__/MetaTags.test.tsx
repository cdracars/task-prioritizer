import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import MetaTags from '../MetaTags';

describe('MetaTags', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <HelmetProvider>
        <MetaTags />
      </HelmetProvider>
    );
    expect(container).toBeDefined();
  });

  // Simple snapshot test since direct testing with helmet is complex
  it('matches snapshot with default props', () => {
    const { container } = render(
      <HelmetProvider>
        <MetaTags />
      </HelmetProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with custom props', () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom description for testing',
      canonicalUrl: 'https://example.com/test',
    };

    const { container } = render(
      <HelmetProvider>
        <MetaTags {...customProps} />
      </HelmetProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
