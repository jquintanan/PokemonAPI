interface AboutViewProps {}

export const AboutView: React.FC<AboutViewProps> = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>About</h1>
      <div className="section">
        <h2>Joel Quintana</h2>
        <p>joelquintana.com</p>
      </div>

      <div className="section">
        <h3>Disclaimer</h3>
        <p>
          This app is not affiliated with, endorsed, sponsored, or specifically
          approved by the Pokémon Company, Nintendo, or any of their
          subsidiaries or affiliates. All Pokémon content, including images and
          names, are the intellectual property of the Pokémon Company, Nintendo,
          and their respective owners. This app is for educational and
          entertainment purposes only and does not intend to infringe on any
          copyrights or trademarks of the Pokémon Company or Nintendo.
        </p>
      </div>
    </div>
  );
};
