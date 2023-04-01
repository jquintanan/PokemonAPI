import React from "react";
import { PokemonData } from "../api";
import { PokemonType } from "./PokemonType.react";

interface PokemonFighterProps {
  pokemonData: PokemonData;
  maxStats: { [key: string]: number };
  minStats: { [key: string]: number };
}

export const PokemonFighter: React.FC<PokemonFighterProps> = ({
  pokemonData,
  maxStats,
  minStats,
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
    <div className="Pokemon">
      <h3>
        #{pokemonData.id} {pokemonData.name}
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
      <img src={pokemonData.sprites.front_default} alt="pokemon" />
      <div className="section">
        <h4>Stats</h4>
        <table>
          <tbody>
            {pokemonData.stats.map((stat) => {
              return (
                <tr>
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
    </div>
  );
};
