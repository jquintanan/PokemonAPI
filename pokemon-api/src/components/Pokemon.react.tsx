import React from "react";
import { PokemonData } from "../api";
import { PokemonType } from "./PokemonType.react";

interface PokemonProps {
  pokemonData: PokemonData;
}

export const Pokemon: React.FC<PokemonProps> = ({ pokemonData }) => {
  return (
    <div>
      <h3>
        #{pokemonData.id} {pokemonData.name}
      </h3>
      <img src={pokemonData.sprites.front_default} alt="pokemon" />
      <img src={pokemonData.sprites.front_shiny} alt="pokemon" />
      <div>
        {pokemonData.types.map((type) => {
          return <PokemonType name={type.type.name} />;
        })}
      </div>
      <p>{pokemonData.pokedexEntry}</p>
      {pokemonData.moves.slice(0, 4).map((move) => {
        return <div>{move.move.name}</div>;
      })}
    </div>
  );
};
