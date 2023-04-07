import { useEffect } from "react";
import { PokemonData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";
import { log } from "../PokemonAppLogger";

interface PokemonGameSelectionScreenProps {
  pokemonData: PokemonData[];
  minStats: { [key: string]: number };
  maxStats: { [key: string]: number };
  selectedPokemon: PokemonData[];
  setSelectedPokemon?: ((pokemon: PokemonData[]) => void) | null;
}

export const PokemonGameSelectionScreen: React.FC<
  PokemonGameSelectionScreenProps
> = ({
  pokemonData,
  minStats,
  maxStats,
  selectedPokemon,
  setSelectedPokemon,
}) => {
  useEffect(() => {
    log("selection_screen");
  }, []);
  console.log("Rendering PokemonGameView-SelectionScreen");
  const current_selection = selectedPokemon.length > 0 &&
    selectedPokemon[0] !== undefined && (
      <div style={{ margin: "10px 0px" }}>
        Current selection:
        {selectedPokemon.map((pokemon) => {
          return (
            <div style={{ width: "100px", textAlign: "center" }}>
              <div>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              </div>
              <div>{pokemon.name}</div>
            </div>
          );
        })}
      </div>
    );

  var selection_index = (
    <div>
      <div
        id="pokemon_menu"
        style={{
          paddingTop: "20px",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {pokemonData.map((pokemon) => {
          return (
            <div
              className="border_for_selected"
              style={{
                //width: "100%",
                // minWidth: "250px",
                // maxWidth: "400px",
                flexGrow: 1,
                margin: selectedPokemon.includes(pokemon) ? "-5px" : "0px",
                padding: "15px",
                //show which pokemon is selected
                border: selectedPokemon.includes(pokemon)
                  ? "5px solid red"
                  : "none",
              }}
            >
              {/* <div
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "white",
                }}
              >
                Test
              </div> */}
              <PokemonFighter
                pokemonData={pokemon}
                minStats={minStats}
                maxStats={maxStats}
                setSelectedPokemon={setSelectedPokemon}
                fighterMode="selection"
              />
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
      <h2>Select your pokemon:</h2>
      {current_selection}
      {selection_index}
    </div>
  );
};
