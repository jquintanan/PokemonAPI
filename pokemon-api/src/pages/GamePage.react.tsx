import { useEffect, useState } from "react";
import { PokemonAllData } from "../api";
import { PokemonGameSelectionScreen } from "../components/PokemonGameSelectionScreen.react";
import { PokemonGameBattleScreen } from "../components/PokemonGameBattleScreen.react";
import { log } from "../PokemonAppLogger";
import { PokemonGameExploreScreen } from "../components/PokemonGameExploreScreen.react";

interface GamePageProps {
  pokemonData: PokemonAllData[];
}

export const GamePage: React.FC<GamePageProps> = ({ pokemonData }) => {
  useEffect(() => {
    log("game_view");
  }, []);
  console.log("Rendering PokemonGameView");

  type Tab = "selection_screen" | "battle_screen" | "explore_screen";

  const [tab, setTab] = useState<Tab>("selection_screen");

  var screen = <p>Loading selection...</p>;
  switch (tab) {
    case "selection_screen":
      screen = <PokemonGameSelectionScreen pokemonData={pokemonData} />;
      break;
    case "explore_screen":
      screen = <PokemonGameExploreScreen pokemonData={pokemonData} />;
      break;
    case "battle_screen":
      screen = <PokemonGameBattleScreen pokemonData={pokemonData} />;
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
          onClick={() => setTab("explore_screen")}
          className={`GameViewTab ${tab === "explore_screen" ? "active" : ""}`}
          style={{ width: "50%" }}
          id="ExploreScreenTab"
        >
          Explore
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
