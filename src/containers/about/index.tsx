import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import SocialProfile from '../../components/social-profile/social-profile';
import { SocialProfiles } from './style';
import { SocialLinks } from '../home/intro';
import { BlogPostDetailsWrapper } from '../../templates/templates.style';
import AboutContent from './content';
import PostDetails from '../../components/post-details/post-details';

interface AboutProps {
}

const About: React.FunctionComponent<AboutProps> = () => {
  const Data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/about.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 1770, quality: 90) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      speaking: file(absolutePath: { regex: "/speaking.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 570, maxHeight: 760, quality: 90) {
            ...GatsbyImageSharpFluid_withWebp_tracedSVG
          }
        }
      }
      site {
        siteMetadata {
          author
          about
        }
      }
    }
  `);

  const AuthorImage = Data.speaking.childImageSharp.fluid;

  return (
    <>
      <BlogPostDetailsWrapper>
        <PostDetails
          title="Hey there, what’s up?"
          preview={AuthorImage}
          description={<AboutContent />}
          imagePosition='left'
        />
        <SocialProfiles>
          <h3>Contact me on:</h3>
          <SocialProfile items={SocialLinks} />
        </SocialProfiles>
      </BlogPostDetailsWrapper>
    </>
  );
};

export default About;
