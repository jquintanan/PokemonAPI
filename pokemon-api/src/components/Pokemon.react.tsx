import React from "react";
import { PokemonData } from "../api";
import { PokemonType } from "./PokemonType.react";

interface PokemonProps {
  pokemonData: PokemonData;
}

export const Pokemon: React.FC<PokemonProps> = ({ pokemonData }) => {
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
      <p>{pokemonData.pokedexEntry}</p>
      <img src={pokemonData.sprites.front_default} alt="pokemon" />
      <img src={pokemonData.sprites.back_default} alt="pokemon" />
      <img src={pokemonData.sprites.front_shiny} alt="pokemon" />
      <img src={pokemonData.sprites.back_shiny} alt="pokemon" />
      <div className="section">
        <h4>Height and Weight</h4>
        <div>Height: {pokemonData.height}</div>
        <div>Weight: {pokemonData.weight}</div>
      </div>
      <div className="section">
        <h4>Stats</h4>
        {pokemonData.stats.map((stat) => {
          return (
            <div>
              {stat.stat.name}: {stat.base_stat}
            </div>
          );
        })}
      </div>
      <div className="section">
        <h4>Moves</h4>
        {pokemonData.moves.slice(0, 4).map((move) => {
          return <div>{move.move.name}</div>;
        })}
      </div>
    </div>
  );
};
