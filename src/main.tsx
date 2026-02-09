import { Devvit, useWebView } from '@devvit/public-api';

Devvit.addCustomPostType({
  name: 'Reddit Oracle',
  description: "Predict today's #1 post on r/popular",
  render: () => {
    const { mount } = useWebView({
      url: 'index.html',
      onMessage: (msg) => {
        console.log('Message from webview:', msg);
      },
    });

    return (
      <button onPress={mount}>Open Reddit Oracle</button>
    );
  },
});

export default Devvit;