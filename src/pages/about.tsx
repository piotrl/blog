import { PageProps } from 'gatsby';
import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import About from '../containers/about';

const AboutPage: React.FunctionComponent<PageProps> = () => {
  return (
    <Layout>
      <SEO
        title="About - Piotr Lewandowski"
        description="JavaScript performance-solver at @Dynatrace. JavaScript trouble-maker on my own."
      />

      <About />
    </Layout>
  );
};

export default AboutPage;
