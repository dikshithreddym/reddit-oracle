import { Devvit, useWebView, useState } from '@devvit/public-api';

Devvit.addCustomPostType({
  name: 'Reddit Oracle',
  description: "Predict today's #1 post on r/popular",
  height: 'tall',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const { mount, unmount } = useWebView({
      url: 'index.html',
      onMessage: (msg) => {
        console.log('Received from webview:', msg);
        if (msg === 'close') {
          unmount();
          setIsOpen(false);
        }
      },
    });

    const handleOpen = () => {
      setIsOpen(true);
      mount();
    };

    return (
      <vstack padding="large" gap="medium" backgroundColor="white" cornerRadius="medium">
        <hstack gap="small" alignment="center middle">
          <text size="xlarge" weight="bold" color="orangered">🔮</text>
          <text size="xlarge" weight="bold" color="orangered">Reddit Oracle</text>
          <text size="xlarge" weight="bold" color="orangered">🔮</text>
        </hstack>
        
        <text size="medium" alignment="center">
          Can you predict the #1 post on r/popular?
        </text>
        
        <text size="small" alignment="center" color="grey">
          Make your prediction before 6 PM ET daily!
        </text>

        <vstack gap="small" alignment="center">
          <hstack gap="small">
            <vstack padding="small" backgroundColor="#FFF3E0" cornerRadius="small">
              <text size="small" weight="bold">🎯 100 pts</text>
              <text size="xsmall">Exact match</text>
            </vstack>
            <vstack padding="small" backgroundColor="#E3F2FD" cornerRadius="small">
              <text size="small" weight="bold">🔥 Streaks</text>
              <text size="xsmall">+10% bonus</text>
            </vstack>
          </hstack>
        </vstack>

        <button appearance="primary" onPress={handleOpen}>
          {isOpen ? 'Playing...' : 'Play Now'}
        </button>
        
        <text size="xsmall" alignment="center" color="grey">
          Reddit Daily Games 2026 Hackathon Entry
        </text>
      </vstack>
    );
  },
});

export default Devvit;