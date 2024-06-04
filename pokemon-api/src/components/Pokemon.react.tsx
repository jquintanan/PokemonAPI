import React from "react";
import { PokemonAllData } from "../api/data";
import { PokemonType } from "./PokemonType.react";

interface PokemonProps {
  pokemonData: PokemonAllData;
}

export const Pokemon: React.FC<PokemonProps> = ({ pokemonData }) => {
  return (
    <div className="Pokemon">
      <h3>
        #{pokemonData.id} {pokemonData.name}
      </h3>
      <div>
        {pokemonData.pokemon_data.types.map((type) => {
          return (
            <div className="PokemonType">
              <PokemonType name={type.type.name} />
            </div>
          );
        })}
      </div>
      <p>{pokemonData.dex_entry}</p>
      <img src={pokemonData.pokemon_data.sprites.front_default} alt="pokemon" />
      <img src={pokemonData.pokemon_data.sprites.back_default} alt="pokemon" />
      <img src={pokemonData.pokemon_data.sprites.front_shiny} alt="pokemon" />
      <img src={pokemonData.pokemon_data.sprites.back_shiny} alt="pokemon" />
      <div className="section">
        <h4>Height and Weight</h4>
        <div>Height: {pokemonData.pokemon_data.height}</div>
        <div>Weight: {pokemonData.pokemon_data.weight}</div>
      </div>
      <div className="section">
        <h4>Stats</h4>
        {pokemonData.pokemon_data.stats.map((stat) => {
          return (
            <div>
              {stat.stat.name}: {stat.base_stat}
            </div>
          );
        })}
      </div>
      <div className="section">
        <h4>Moves</h4>
        {pokemonData.pokemon_data.moves.slice(0, 4).map((move) => {
          return <div>{move.move.name}</div>;
        })}
      </div>
    </div>
  );
};
