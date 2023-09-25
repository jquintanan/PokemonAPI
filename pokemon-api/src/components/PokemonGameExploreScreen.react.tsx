import { useEffect } from "react";
import { PokemonAllData, HABITATS } from "../api";

import { log } from "../PokemonAppLogger";

interface PokemonGameExploreScreenProps {
  pokemonData: PokemonAllData[];
}

export const PokemonGameExploreScreen: React.FC<PokemonGameExploreScreenProps> = ({
  pokemonData,
}) => {
  useEffect(() => {
    log("explore_screen");
  }, []);
  console.log("Rendering PokemonGameView-ExploreScreen");

  const regions = (
    <div className="section">
      <div>
        {HABITATS.map((habitat) => {
          return (
            <div
              style={{
                marginBottom: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h3>{habitat.full_name}</h3>
                <img src={habitat.image} width="200px" height="200px" />
                <p style={{ textAlign: "center" }}>{habitat.description}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {habitat.pokemon.map((pokemon) => {
                  return (
                    <div>
                      <img
                        src={pokemon.pokemon_data.sprites.front_default}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}
    >
      <h2>Explore</h2>
      {/* {current_team} */}
      {regions}
    </div>
  );
};
