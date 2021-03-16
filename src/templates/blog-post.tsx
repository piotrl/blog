import React from 'react';
import { graphql, Link } from 'gatsby';
import _ from 'lodash';
import Layout from '../components/layout';
import SEO from '../components/seo';
import PostCard from '../components/post-card/post-card';
import PostDetails from '../components/post-details/post-details';
import { IoLogoReddit, IoLogoTwitter } from 'react-icons/io';
import {
  BlogPostAuthor,
  BlogPostComment,
  BlogPostDetailsWrapper,
  BlogPostFooter,
  PostShare,
  PostTags,
  RelatedPostItem,
  RelatedPostItems,
  RelatedPostTitle,
  RelatedPostWrapper,
} from './templates.style';
import AuthorMeta from './blog-post-meta';

const BlogPostTemplate = (props: any) => {
  const post = props.data.markdownRemark;
  const { edges } = props.data.allMarkdownRemark;
  const title = post.frontmatter.title;
  const avatar = props.data.avatar.childImageSharp.fluid;
  const author = post.frontmatter.author;
  const about = props.data.site.siteMetadata.about;

  const twitterDiscussions = `https://mobile.twitter.com/search?q=${encodeURIComponent(title)}`;
  const redditDiscussions = `https://www.reddit.com/search/?q=${encodeURIComponent(title)}`;

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <BlogPostDetailsWrapper>
        <PostDetails
          title={post.frontmatter.title}
          date={post.frontmatter.date}
          preview={
            post.frontmatter.cover == null
              ? null
              : post.frontmatter.cover.childImageSharp.fluid
          }
          description={post.html}
          imagePosition="left"
        />

        <BlogPostFooter
          className={post.frontmatter.cover == null ? 'center' : ''}
        >
          {post.frontmatter.tags == null ? null : (
            <PostTags className="post_tags">
              {post.frontmatter.tags.map((tag: string, index: number) => (
                <Link key={index} to={`/tags/${_.kebabCase(tag)}/`}>
                  {`#${tag}`}
                </Link>
              ))}
            </PostTags>
          )}
          <PostShare>
            <span>Community discussions:</span>
            <a href={twitterDiscussions} target='_blank' rel='noopener noreferrer'>
              <IoLogoTwitter /> on twitter
            </a>
            <a href={redditDiscussions} target='_blank' rel='noopener noreferrer'>
              <IoLogoReddit /> on reddit
            </a>
          </PostShare>
        </BlogPostFooter>
        <BlogPostAuthor>
          <RelatedPostTitle>Author</RelatedPostTitle>
          {avatar && author
            ? <AuthorMeta image={avatar} name={author} description={about} />
            : ''
          }
        </BlogPostAuthor>
        <BlogPostComment
          className={post.frontmatter.cover == null ? 'center' : ''}
        >
        </BlogPostComment>
      </BlogPostDetailsWrapper>

      {edges.length !== 0 && (
        <RelatedPostWrapper>
          <RelatedPostTitle>Related Posts</RelatedPostTitle>
          <RelatedPostItems>
            {edges.map(({ node }: any) => (
              <RelatedPostItem key={node.fields.slug}>
                <PostCard
                  title={node.frontmatter.title || node.fields.slug}
                  url={node.fields.slug}
                  image={
                    node.frontmatter.cover == null
                      ? null
                      : node.frontmatter.cover.childImageSharp.fluid
                  }
                  tags={node.frontmatter.tags}
                />
              </RelatedPostItem>
            ))}
          </RelatedPostItems>
        </RelatedPostWrapper>
      )}
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $tag: [String!]) {
    site {
      siteMetadata {
        siteUrl
        about
      }
    }
    avatar: file(absolutePath: { regex: "/author.jpg/" }) {
      childImageSharp {
        fluid(maxWidth: 210, maxHeight: 210, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "DD MMM, YYYY")
        description
        tags
        author
        cover {
          publicURL
          childImageSharp {
            fluid(maxWidth: 570, maxHeight: 760, quality: 90) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
    allMarkdownRemark(
      limit: 3
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: $tag } }
        fields: { slug: { ne: $slug } }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            tags
            cover {
              publicURL
              childImageSharp {
                fluid(maxWidth: 480, maxHeight: 285, quality: 90) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`;
