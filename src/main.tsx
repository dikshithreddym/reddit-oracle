import { Devvit, useWebView } from '@devvit/public-api';

Devvit.addCustomPostType({
  name: 'Reddit Oracle',
  description: "Predict today's #1 post on r/popular",
  render: () => {
    const { mount } = useWebView({
      url: 'index.html',
    });

    return (
      <vstack padding="medium" gap="medium">
        <text size="xlarge" weight="bold" color="orangered">Reddit Oracle</text>
        <text size="medium">Predict today's #1 post on r/popular</text>
        <button onPress={mount}>Play Now</button>
      </vstack>
    );
  },
});

export default Devvit;