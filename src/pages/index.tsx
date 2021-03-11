import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/layout';
import PersonalBlog from '../containers/home';
import SEO from '../components/seo';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps extends PageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
      };
    };
  };
}
export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
const IndexPage: React.FC<IndexPageProps> = (props) => {
  const { data } = props;

  return (
    <Layout>
      <SEO
        title="Personal Blog Minimal"
        description={data.site.siteMetadata.description}
      />
      <PersonalBlog />
    </Layout>
  );
};

export default IndexPage;
