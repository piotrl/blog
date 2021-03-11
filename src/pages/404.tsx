import React from 'react';
import { PageProps } from 'gatsby';
import Navbar from '../components/navbar/navbar';
import ResetCss from '../components/reset-css';
import SEO from '../components/seo';
import NotFound from '../containers/not-found';
import Footer from '../components/footer/footer';

const Error404Page: React.FC<PageProps> = () => {
  return (
    <>
      <ResetCss />
      <Navbar />
      <SEO title="404: Not Found" />
      <NotFound />
      <Footer>
        Copyright &copy; {new Date().getFullYear()}
        <a href="https://redq.io/" target="_blank">
          {' '}
          RedQ, Inc.
        </a>
      </Footer>
    </>
  );
};

export default Error404Page;
