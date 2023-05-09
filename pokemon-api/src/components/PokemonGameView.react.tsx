import { useEffect, useState } from "react";
import { PokemonAllData } from "../api";
import { PokemonGameSelectionScreen } from "./PokemonGameSelectionScreen.react";
import { PokemonGameBattleScreen } from "./PokemonGameBattleScreen.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";

interface PokemonGameViewProps {
  pokemonData: PokemonAllData[];
}

export const PokemonGameView: React.FC<PokemonGameViewProps> = ({
  pokemonData,
}) => {
  useEffect(() => {
    log("game_view");
  }, []);
  console.log("Rendering PokemonGameView");
  const place_holder_pokemon: PokemonAllData = pokemonData[0];

  type Tab = "selection_screen" | "battle_screen";

  const [tab, setTab] = useState<Tab>("selection_screen");
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonAllData[]>([
    place_holder_pokemon,
  ]);

  //TODO: Move this function to a util file
  //Calculate min and max stats
  function getStatsUpperAndLowerBounds(
    pokemonData: PokemonAllData[]
  ): {
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
      hp: 999999,
      attack: 999999,
      defense: 999999,
      "special-attack": 999999,
      "special-defense": 999999,
      speed: 999999,
    };

    pokemonData.forEach((pokemon) => {
      const stats_for_level_1 = PokemonInstance.getStatsFromPokemonDataAndLevel(
        pokemon,
        1
      );

      maxStats.hp =
        stats_for_level_1.max_hp > maxStats.hp
          ? stats_for_level_1.max_hp
          : maxStats.hp;
      minStats.hp =
        stats_for_level_1.max_hp < minStats.hp
          ? stats_for_level_1.max_hp
          : minStats.hp;

      maxStats.attack =
        stats_for_level_1.attack > maxStats.attack
          ? stats_for_level_1.attack
          : maxStats.attack;
      minStats.attack =
        stats_for_level_1.attack < minStats.attack
          ? stats_for_level_1.attack
          : minStats.attack;

      maxStats.defense =
        stats_for_level_1.defense > maxStats.defense
          ? stats_for_level_1.defense
          : maxStats.defense;
      minStats.defense =
        stats_for_level_1.defense < minStats.defense
          ? stats_for_level_1.defense
          : minStats.defense;

      maxStats["special-attack"] =
        stats_for_level_1.special_attack > maxStats["special-attack"]
          ? stats_for_level_1.special_attack
          : maxStats["special-attack"];
      minStats["special-attack"] =
        stats_for_level_1.special_attack < minStats["special-attack"]
          ? stats_for_level_1.special_attack
          : minStats["special-attack"];

      maxStats["special-defense"] =
        stats_for_level_1.special_defense > maxStats["special-defense"]
          ? stats_for_level_1.special_defense
          : maxStats["special-defense"];
      minStats["special-defense"] =
        stats_for_level_1.special_defense < minStats["special-defense"]
          ? stats_for_level_1.special_defense
          : minStats["special-defense"];

      maxStats.speed =
        stats_for_level_1.speed > maxStats.speed
          ? stats_for_level_1.speed
          : maxStats.speed;
      minStats.speed =
        stats_for_level_1.speed < minStats.speed
          ? stats_for_level_1.speed
          : minStats.speed;
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
    <div style={{ margin: "10px" }}>
      <div
        style={{
          margin: "0",
          display: "flex",
          flexDirection: "row",
          maxWidth: "400px",
        }}
      >
        <button
          onClick={() => setTab("selection_screen")}
          className={`GameViewTab ${
            tab === "selection_screen" ? "active" : ""
          }`}
          style={{ width: "50%" }}
          id="SelectionScreenTab"
        >
          Pokemon Selection
        </button>
        <button
          onClick={() => setTab("battle_screen")}
          className={`GameViewTab ${tab === "battle_screen" ? "active" : ""}`}
          id="BattleScreenTab"
          style={{
            backgroundColor: "#FF5959",
            width: "50%",
            maxWidth: "400px",
          }}
        >
          Battle!
        </button>
      </div>
      {screen}
    </div>
  );
};
