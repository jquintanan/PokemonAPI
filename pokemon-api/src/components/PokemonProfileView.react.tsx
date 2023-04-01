import { useParams } from "react-router-dom";

import { PokemonData } from "../api";
import { useState, useEffect } from "react";
import { Pokemon } from "./Pokemon.react";

interface PokemonProfileViewProps {
  data: PokemonData[];
}

export const PokemonProfileView: React.FC<PokemonProfileViewProps> = ({
  data,
}) => {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }

    const id_number = parseInt(id);
    const pokemon = data.find((pokemon) => pokemon.id === id_number);

    if (pokemon) {
      setPokemonData(pokemon);
    } else {
      setPokemonData(null);
    }
  }, [id, data]);

  if (pokemonData === null || pokemonData === undefined) {
    return <h1>Loading...</h1>;
  }

  return <Pokemon pokemonData={pokemonData} />;
};
