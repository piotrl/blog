import React from 'react';
import Image from 'gatsby-image';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

interface AuthorMetaProps {
  image: any;
  name: string;
  description?: string;
}

export const BlogPostAuthor = styled.div`
  margin: 0 0 0 auto;
  width: 58%;
  max-width: 100%;
  padding-top: 30px;
  @media (max-width: 990px) {
    padding-top: 20px;
    width: 100%;
  }
  &.center {
    margin: 0 auto;
  }
`;

const AuthorWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  padding: 3px;
  border-radius: 50%;
  border: 1px solid ${themeGet('colors.lightBorderColor', '#ededed')};
  flex-shrink: 0;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 50%;
  }
`;

const AuthorDescription = styled.div`
  font-family: ${themeGet('fontFamily.1', "'Poppins', sans-serif")};
  color: ${themeGet('colors.textColor', '#292929')};
  margin-left: 20px;
  font-size: 16px;

  span {
    font-size: 14px;
  }
`;

export const AuthorMeta: React.FunctionComponent<AuthorMetaProps> = (props) => {
  return (
    <AuthorWrapper>
      <Avatar>
        <Image fluid={props.image} alt="author" />
      </Avatar>
      <AuthorDescription>
        Blog by <a href='https://twitter.com/constjs'>{props.name}</a> <br/>
        <span>{props.description}</span>
      </AuthorDescription>
    </AuthorWrapper>
  )
};

export default AuthorMeta;
