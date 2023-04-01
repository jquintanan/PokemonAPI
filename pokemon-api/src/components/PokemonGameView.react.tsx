import { PokemonData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";

interface PokemonGameViewProps {
  pokemonData: PokemonData[];
}

export const PokemonGameView: React.FC<PokemonGameViewProps> = ({
  pokemonData,
}) => {
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

  console.log(maxStats);
  console.log(minStats);

  return (
    <div>
      <h1>Game View</h1>
      <h2>In progress</h2>

      <div>
        {pokemonData.map((pokemon) => {
          return (
            <PokemonFighter
              pokemonData={pokemon}
              minStats={minStats}
              maxStats={maxStats}
            />
          );
        })}
      </div>
    </div>
  );
};
