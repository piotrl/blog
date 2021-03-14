import * as React from 'react';

interface AboutContentProps {
}

const AboutContent: React.FunctionComponent<AboutContentProps> = () => {

  return (
    <>
      <p>
        I'm <strong>Piotr</strong> Lewandowski, I'm 🎨 front-end engineer, 🔨 full-stack when needed, a 🐣 duck for
        other developers - helping them to build right things in right way.
        Currently based in beautiful Gdańsk, Poland.
      </p>
      <p>
        Daily, I work at <a href='https://dynatrace.com/'>Dynatrace</a> as Senior Software Engineer and Team Captain of
        Core UI team.
        <br />
        In free time, I'm trainer at <a href='https://infoshareacademy.com/'>infoShare Academy</a> bootcamp. I teach
        JavaScript, Java, HTTP, Design Patterns and Angular.
      </p>
      <p>
        👉 Check my <a href='https://www.linkedin.com/in/piotr--lewandowski/'>résumé</a>, or reach out on <a
        href='https://twitter.com/constjs'>twitter</a> or through <a href='mailto:mail@piotrl.net'>e-mail</a>
      </p>

      <h2>I code</h2>

      <p>
        I'm front-end guy, however I started my career from backend environment. And at the moment, I found my niche in
        developing low-level architecture of Web Applications, barely touching component styling recently.
      </p>
      <p>I'm strict fan of how TypeScript has changed the Web development.</p>
      <p>
        👉 Check my <a href='http://github.com/piotrl'>GitHub</a> and <a
        href='https://stackoverflow.com/users/2757140/piotr-lewandowski'>StackOverflow</a>.
      </p>

      <div id='github-card'
           data-username='piotrl'>
      </div>

      <h2>I speak</h2>

      <p>
        I do deep-dive presentations as developer for developer, sharing lesson learned. Internal ones and public on
        meetups. I tend to avoid conferences though... 20min presentations are not my cup of tea.
      </p>
      <p>
        Outside of speaking myself. I used to organise meetup for IT students, called `PonadProgram` - helping younglings to be attracted by IT and presenting them how it looks in reality.
        We worked for 2 years, having 10 topics covered.
      </p>
      <p>
        👉 Check my <a href='https://speakerdeck.com/piotrl'>Speakerdeck</a>.
      </p>

      <h2>I write</h2>

      <p>
        You might find some of my writings published on Medium, inDpeth or dev.to, <strong>having more than 100 000
        views</strong> together.
        Some of my writing were translated to various languages: <strong>English, Polish, Japanese</strong>.
      </p>

      <p>
        👉 Look around this blog!
      </p>

      <h2>Interviews</h2>
      <p>
        👉 Interview at <a
        href='https://community.dynatrace.com/t5/Community-news/Announcing-the-Employee-Member-of-the-Month-for-August-2020/ba-p/128363'>
        Dynatrace community
      </a>
      </p>
    </>
  );
};

export default AboutContent;
