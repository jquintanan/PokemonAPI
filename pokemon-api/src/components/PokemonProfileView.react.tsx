import { Link, useParams } from "react-router-dom";

import { PokemonAllData } from "../api/data";
import { useState, useEffect } from "react";
import { Pokemon } from "./Pokemon.react";

interface PokemonProfileViewProps {
  data: PokemonAllData[];
}

export const PokemonProfileView: React.FC<PokemonProfileViewProps> = ({
  data,
}) => {
  const [pokemonData, setPokemonData] = useState<PokemonAllData | null>(null);

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

  return (
    <div>
      <Pokemon pokemonData={pokemonData} />
      <div>
        {pokemonData.id < 2 ? null : (
          <Link
            className="previous_pokemon_button"
            to={`/profile/${pokemonData.id - 1}`}
          >
            Previous
          </Link>
        )}
        {pokemonData.id > 150 ? null : (
          <Link
            className="next_pokemon_button"
            to={`/profile/${pokemonData.id + 1}`}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};
