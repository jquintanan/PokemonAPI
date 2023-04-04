import { useEffect, useState } from "react";
import { PokemonData } from "../api";
import { PokemonGameSelectionScreen } from "./PokemonGameSelectionScreen.react";
import { PokemonGameBattleScreen } from "./PokemonGameBattleScreen.react";

interface PokemonGameViewProps {
  pokemonData: PokemonData[];
}

export const PokemonGameView: React.FC<PokemonGameViewProps> = ({
  pokemonData,
}) => {
  console.log("Rendering PokemonGameView");
  const place_holder_pokemon: PokemonData = pokemonData[0];

  type Tab = "selection_screen" | "battle_screen";

  const [tab, setTab] = useState<Tab>("selection_screen");
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData[]>([
    place_holder_pokemon,
  ]);

  //select a random pokemon for the opponent
  function getRandomPokemon() {
    return pokemonData[Math.floor(Math.random() * 20)];
  }

  //Calculate min and max stats
  function getStatsUpperAndLowerBounds(pokemonData: PokemonData[]): {
    maxStats: { [key: string]: number };
    minStats: { [key: string]: number };
  } {
    //find the highest value for each stat among all pokemon and store it in maxStats
    const maxStats: { [key: string]: number } = {
      hp: 0,
      attack: 0,
      defense: 0,
      "special-attack": 0,
      "special-defense": 0,
      speed: 0,
    };

    const minStats: { [key: string]: number } = {
      hp: 999,
      attack: 999,
      defense: 999,
      "special-attack": 999,
      "special-defense": 999,
      speed: 999,
    };

    pokemonData.forEach((pokemon) => {
      pokemon.stats.forEach((stat) => {
        if (stat.base_stat > maxStats[stat.stat.name]) {
          maxStats[stat.stat.name] = stat.base_stat;
        }

        if (stat.base_stat < minStats[stat.stat.name]) {
          minStats[stat.stat.name] = stat.base_stat;
        }
      });
    });

    // console.log(maxStats);
    // console.log(minStats);

    return { maxStats, minStats };
  }

  const { maxStats, minStats } = getStatsUpperAndLowerBounds(pokemonData);

  var screen = <p>Loading selection...</p>;
  switch (tab) {
    case "selection_screen":
      screen = (
        <PokemonGameSelectionScreen
          maxStats={maxStats}
          minStats={minStats}
          pokemonData={pokemonData}
          selectedPokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
        />
      );
      break;
    case "battle_screen":
      screen = (
        <PokemonGameBattleScreen
          maxStats={maxStats}
          minStats={minStats}
          pokemonData={pokemonData}
          selectedPokemon={selectedPokemon}
        />
      );
      break;
  }

  return (
    <div style={{ margin: "20px" }}>
      <h1>Pokemon Battle Game</h1>
      <div style={{ margin: "10px 0px" }}>
        <button
          onClick={() => setTab("selection_screen")}
          className={`GameViewTab ${
            tab === "selection_screen" ? "active" : ""
          }`}
          id="SelectionScreenTab"
        >
          Pokemon Selection
        </button>
        <button
          onClick={() => setTab("battle_screen")}
          className={`GameViewTab ${tab === "battle_screen" ? "active" : ""}`}
          id="BattleScreenTab"
          style={{ backgroundColor: "#FF5959" }}
        >
          Battle!
        </button>
      </div>
      {screen}
    </div>
  );
};
