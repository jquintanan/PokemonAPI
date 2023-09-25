import { useEffect, useState } from "react";
import { PokemonAllData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import {
  selecPlayerData,
  addPokemon,
  removePokemon,
  setSelectedPokemon,
} from "../state/playerDataSlice";
import { useSelector, useDispatch } from "react-redux";

interface PokemonGameSelectionScreenProps {
  pokemonData: PokemonAllData[];
}

const INITIAL_LEVEL_FOR_NEW_POKEMON = 5;

export const PokemonGameSelectionScreen: React.FC<PokemonGameSelectionScreenProps> = ({
  pokemonData,
}) => {
  const dispatch = useDispatch();
  const playerData = useSelector(selecPlayerData);
  const selectedPokemon = playerData.selectedPokemon;
  const [showlAllPokemon, setShowAllPokemon] = useState(false);

  const buyPokemon = (pokemon: PokemonAllData) => {
    console.log("buying pokemon");
    //Add pokemon to player's ownedPokemon
    const pokemon_instance = new PokemonInstance(
      pokemon,
      undefined,
      INITIAL_LEVEL_FOR_NEW_POKEMON
    );
    dispatch(addPokemon(pokemon_instance));

    selectPokemon(pokemon_instance);
  };

  const selectPokemon = (pokemon: PokemonInstance) => {
    console.log("selecting pokemon");
    dispatch(setSelectedPokemon(pokemon));
  };

  useEffect(() => {
    log("selection_screen");
  }, []);
  console.log("Rendering PokemonGameView-SelectionScreen");

  const current_selection = (
    <div className="section">
      <h3>Current Selection</h3>
      {!selectedPokemon ? (
        <div>You don't have any pokemon yet!</div>
      ) : (
        <div
          style={{ width: "100px", textAlign: "center" }}
          key={"current_Selection " + selectedPokemon.id}
        >
          <div>
            <img
              src={
                selectedPokemon.isShiny
                  ? selectedPokemon.data.pokemon_data.sprites.front_shiny
                  : selectedPokemon.data.pokemon_data.sprites.front_default
              }
              alt={selectedPokemon.data.pokemon_data.name}
            />
          </div>
          <div>{selectedPokemon.data.pokemon_data.name}</div>
        </div>
      )}
    </div>
  );

  const owned_pokemon = playerData.ownedPokemon;
  const my_pokemon_section = (
    <div className="section">
      <h3>My Pokemon</h3>
      {owned_pokemon.length === 0 ? (
        <div>You don't have any pokemon yet!</div>
      ) : (
        <div
          className="section"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {playerData.ownedPokemon.map((pokemon_instance) => {
              const pokemon = pokemon_instance.data;
              const style_selected: React.CSSProperties = {
                flexGrow: 1,
                margin: "-5px",
                padding: "15px",
                border: "5px solid red",
                maxWidth: "300px",
              };
              const style_not_selected: React.CSSProperties = {
                flexGrow: 1,
                margin: "0px",
                padding: "15px",
                border: "none",
                maxWidth: "300px",
              };
              return (
                <div
                  key={"index_selection " + pokemon_instance.id}
                  className="border_for_selected"
                  style={
                    selectedPokemon &&
                    selectedPokemon?.id === pokemon_instance.id
                      ? style_selected
                      : style_not_selected
                  }
                >
                  <PokemonFighter
                    fighterMode="selection"
                    pokemon_instance={pokemon_instance}
                    showLevel={true}
                    showType={true}
                    showHPBar={true}
                    showCurrentStats={true}
                    showIVs={true}
                    showExp={true}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          console.log("selecting pokemon");
                          selectPokemon(pokemon_instance);
                        }}
                      >
                        Select
                      </button>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          dispatch(removePokemon(pokemon_instance));
                        }}
                      >
                        🗑️
                      </div>
                    </div>
                  </PokemonFighter>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  let available_for_purchase = pokemonData;
  if (!showlAllPokemon) {
    const favorites = [
      1, //bulbasaur
      4, //charmander
      7, //squirtle
      25, //pikachu
      133, //eevee
    ];

    available_for_purchase = pokemonData.filter((p) => {
      return favorites.includes(p.id);
    });
  }
  const selection_index = (
    <div>
      <h3>Adopt Pokemon</h3>
      Show all{" "}
      <input
        type="checkbox"
        checked={showlAllPokemon}
        onChange={(e) => setShowAllPokemon(e.target.checked)}
      />
      <div
        id="pokemon_menu"
        style={{
          paddingTop: "20px",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {available_for_purchase.map((pokemon) => {
          return (
            <div
              key={"index_selection " + pokemon.id}
              className="border_for_selected"
              style={{
                //width: "100%",
                // minWidth: "250px",
                maxWidth: "300px",
                flexGrow: 1,
                padding: "15px",
              }}
            >
              {/* <div
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor:  "white",
                }}
              >
                Test
              </div> */}
              <PokemonFighter
                fighterMode="selection"
                pokemon_instance={new PokemonInstance(pokemon, false)}
                showBaseStats={true}
                showType={true}
              >
                <button onClick={() => buyPokemon(pokemon)}>Adopt</button>
              </PokemonFighter>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "20px 0px",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      <h2>Select your pokemon:</h2>
      {current_selection}
      {my_pokemon_section}
      {selection_index}
    </div>
  );
};
