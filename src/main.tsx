import { Devvit, useWebView } from '@devvit/public-api';

Devvit.addCustomPostType({
  name: 'Reddit Oracle',
  description: "Predict today's #1 post on r/popular",
  height: 'tall',
  render: () => {
    const webview = useWebView({
      url: 'index.html',
    });

    return (
      <vstack padding="medium" gap="medium">
        <text size="xlarge" weight="bold">Reddit Oracle</text>
        <text size="medium">Predict today's #1 post on r/popular</text>
        <button onPress={webview.mount}>Open Game</button>
      </vstack>
    );
  },
});

export default Devvit;