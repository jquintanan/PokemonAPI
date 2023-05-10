import { useEffect, useState } from "react";
import { HabitatData, PokemonAllData, getHabitatsData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { get } from "http";

interface PokemonGameExploreScreenProps {
  pokemonData: PokemonAllData[];
  selectedPokemon: PokemonAllData[];
}

export const PokemonGameExploreScreen: React.FC<PokemonGameExploreScreenProps> = ({
  pokemonData,
  selectedPokemon,
}) => {
  const [habitatData, setHabitatData] = useState<HabitatData[]>([]);
  useEffect(() => {
    log("explore_screen");
    setHabitatData(getHabitatsData(pokemonData));
  }, []);
  console.log("Rendering PokemonGameView-ExploreScreen");
  const current_team = selectedPokemon.length > 0 &&
    selectedPokemon[0] !== undefined && (
      <div className="section">
        <h3>Team</h3>
        {selectedPokemon.map((pokemon) => {
          return (
            <div
              style={{ width: "100px", textAlign: "center" }}
              key={"current_Selection " + pokemon.id}
            >
              <div>
                <img
                  src={pokemon.pokemon_data.sprites.front_default}
                  alt={pokemon.name}
                />
              </div>
              <div>{pokemon.name}</div>
            </div>
          );
        })}
      </div>
    );

  const regions = (
    <div className="section">
      <div>
        {habitatData.map((habitat) => {
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
