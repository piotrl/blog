import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Image from 'gatsby-image';
import SocialProfile from '../../../components/social-profile/social-profile';
import {
  IntroWrapper,
  IntroImage,
  IntroTitle,
  Desciption,
  IntroInfo,
} from './style';
import {
  IoLogoTwitter,
  IoLogoGithub,
  IoLogoLinkedin,
} from 'react-icons/io';

type IntroProps = {};

export const SocialLinks = [
  {
    icon: <IoLogoLinkedin />,
    url: 'https://www.linkedin.com/in/piotr--lewandowski/',
    tooltip: 'LinkedIn - Piotr Lewandowski',
  },
  {
    icon: <IoLogoTwitter />,
    url: 'https://twitter.com/constjs',
    tooltip: 'Twitter - @constjs',
  },
  {
    icon: <IoLogoGithub />,
    url: 'http://github.com/piotrl',
    tooltip: 'Github - @piotrl',
  },
];

const Intro: React.FunctionComponent<IntroProps> = () => {
  const Data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/author.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 210, maxHeight: 210, quality: 90) {
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

  const { author, about } = Data.site.siteMetadata;
  const AuthorImage = Data.avatar.childImageSharp.fluid;

  return (
    <IntroWrapper>
      <IntroImage>
        <Image fluid={AuthorImage} alt="author" />
      </IntroImage>
      <IntroInfo>
        <IntroTitle>
          Hey! I’m <b>{author}</b>
        </IntroTitle>
        <Desciption>{about} <br /><Link to={'/about'}>👉 Learn more</Link></Desciption>
        <SocialProfile items={SocialLinks} />
      </IntroInfo>
    </IntroWrapper>
  );
};

export default Intro;
