import React from "react";
import { PokemonData } from "../api";
import { PokemonType } from "./PokemonType.react";

interface PokemonFighterProps {
  pokemonData: PokemonData;
  maxStats: { [key: string]: number };
  minStats: { [key: string]: number };
  setSelectedPokemon?: ((pokemon: PokemonData[]) => void) | null;
  fighterMode: FighterMode;
  isShiny?: boolean;
}

type FighterMode = "selection" | "battle";

export const PokemonFighter: React.FC<PokemonFighterProps> = ({
  pokemonData,
  maxStats,
  minStats,
  setSelectedPokemon,
  fighterMode,
  isShiny,
}) => {
  // Calculate the percentage of the maximum stat value
  const getStatPercentage = (statName: string, baseStat: number): number => {
    return Math.round(
      ((baseStat - minStats[statName] + 1) /
        (maxStats[statName] - minStats[statName] + 1)) *
        100
    );
  };

  // Generate a style object for the stat bar based on its percentage value
  const getStatBarStyle = (statName: string, baseStat: number) => {
    const percentage = getStatPercentage(statName, baseStat);
    let color: string;
    if (percentage < 10) {
      color = "#DDD"; // gray
    } else if (percentage < 30) {
      color = "#FEA"; // light yellow
    } else if (percentage < 50) {
      color = "#FFA500"; // yellow
    } else if (percentage < 80) {
      color = "#FFA500"; // orange
    } else if (percentage < 90) {
      color = "#F11"; // red
    } else {
      color = "#8B0000"; // dark red
    }
    return {
      width: `${percentage}%`,
      backgroundColor: color,
    };
  };

  return (
    <div
      className="Pokemon"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>
        #{pokemonData.id} {pokemonData.name}
        {isShiny ? " 💎" : ""}
      </h3>

      <div>
        {pokemonData.types.map((type) => {
          return (
            <div className="PokemonType">
              <PokemonType name={type.type.name} />
            </div>
          );
        })}
      </div>
      <img
        src={
          isShiny
            ? pokemonData.sprites.front_shiny
            : pokemonData.sprites.front_default
        }
        alt="pokemon"
      />

      <div className="section">
        <h4>Stats</h4>
        <table>
          <tbody>
            {pokemonData.stats.map((stat) => {
              return (
                <tr style={{ width: "100%" }}>
                  <td className="stat-name">{stat.stat.name}</td>
                  <td className="stat-value">{stat.base_stat}</td>
                  <td className="stat-container">
                    <div
                      className="stat-bar"
                      style={getStatBarStyle(stat.stat.name, stat.base_stat)}
                    ></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {fighterMode === "selection" && (
        <div className="section">
          {setSelectedPokemon && (
            <button onClick={() => setSelectedPokemon([pokemonData])}>
              Select
            </button>
          )}
        </div>
      )}
    </div>
  );
};

PokemonFighter.defaultProps = {
  isShiny: false,
};
