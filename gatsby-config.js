require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `by Piotr Lewandowski`,
    author: `Piotr`,
    about: `JavaScript performance-solver at @Dynatrace. JavaScript trouble-maker on my own.`,
    description: `A personal blog`,
    siteUrl: `https://piotrl.net`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        minify: false, // Breaks styles if not set to false
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: true,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
            },
          },
          {
            resolve: `gatsby-remark-mermaid`,
          },
          {
            resolve: `gatsby-remark-prismjs`,
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: `gatsby-remark-smartypants`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-transformer-sharp`,
    },
    {
      resolve: `gatsby-plugin-sharp`,
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,//`ADD YOUR TRACKING ID HERE`,
        respectDNT: true
      },
    },
    // {
    //   resolve: `gatsby-plugin-feed`,
    // },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Piotr Lewandowski - Personal Blog`,
        short_name: `constjs`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
    },
    {
      resolve: `gatsby-plugin-react-helmet`,
    },
    {
      resolve: `gatsby-plugin-lodash`,
    },
    // {
    //   resolve: 'gatsby-plugin-mailchimp',
    //   options: {
    //     endpoint: process.env.MAILCHIMP_ENDPOINT, // add your MC list endpoint here; see instructions below
    //   },
    // },
    // {
    //   resolve: `gatsby-source-instagram`,
    //   //add your instagram username, access_token and id below
    //   options: {
    //     username: process.env.INSTAGRAM_USER_NAME_ID,
    //     access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
    //   },
    // },
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        google: {
          families: [
            'Poppins:300,400,500,600,700',
            'Fira Sans:100,300,400,500,600,700',
          ],
        },
      },
    },
  ],
};
