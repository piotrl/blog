import { PageProps } from 'gatsby';
import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Contact from '../containers/contact';

const ContactPage: React.FunctionComponent<PageProps> = () => {
  return (
    <Layout>
      <SEO
        title="Contact me"
      />

      <Contact />
    </Layout>
  );
};

export default ContactPage;
