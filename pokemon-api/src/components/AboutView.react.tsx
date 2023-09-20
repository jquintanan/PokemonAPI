import { useEffect } from "react";
import { log } from "../PokemonAppLogger";

interface AboutViewProps {}

export const AboutView: React.FC<AboutViewProps> = () => {
  useEffect(() => {
    log("about_view");
  }, []);
  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <h1>About</h1>
      <div className="section">
        <h2>Joel Quintana</h2>
        <p>
          <a
            href="https://www.joelquintana.com"
            target="_blank"
            rel="noreferrer"
          >
            joelquintana.com
          </a>
        </p>
      </div>

      <div className="section">
        <h3>Disclaimer</h3>
        <p>
          We use the{" "}
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            PokeAPI (https://pokeapi.co/)
          </a>{" "}
          to fetch data for this application. The PokeAPI provides a
          comprehensive database of Pokemon-related information, and we are
          grateful for their work in making this data available.
        </p>
        <p>
          This app is not affiliated with, endorsed, sponsored, or specifically
          approved by the Pokémon Company, Nintendo, or any of their
          subsidiaries or affiliates. All Pokémon content, including images and
          names, are the intellectual property of the Pokémon Company, Nintendo,
          and their respective owners. This app is for educational and
          entertainment purposes only and does not intend to infringe on any
          copyrights or trademarks of the Pokémon Company or Nintendo.
        </p>
        <p>Testing...</p>
      </div>
    </div>
  );
};
