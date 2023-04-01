const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

export interface PokemonData {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
  pokedexEntry: string;
  //add whole new branch to store species related data
}

export function fetchPokemonList(): Promise<any> {
  return fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the network request:", error);
      throw error;
    });
}

export function fetchPokemonData(id: number): Promise<PokemonData> {
  const fetch_data_uri = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  return fetch(fetch_data_uri)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the network request:", error);
      throw error;
    });
}

export function fetchPokedexEntry(id: number): Promise<any> {
  const fetch_data_uri = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  return fetch(fetch_data_uri)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the network request:", error);
      throw error;
    });
}

export function calculateHp(pokemonId: number, level: number): Promise<number> {
  // Make a request to the Pokemon API to get the base stats for the Pokemon
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`)
    .then((response) => response.json())
    .then((data) => {
      // Find the base HP stat for the Pokemon
      const baseStats = data?.stats?.find(
        (stat: any) => stat.stat.name === "hp"
      );
      const baseHp = baseStats?.base_stat ?? 0;

      // Calculate the HP for the Pokemon based on its level and base HP
      const calculatedHp = Math.floor(
        ((2 * baseHp + 31) * level) / 100 + level + 10
      );

      return calculatedHp;
    })
    .catch((error) => {
      console.error(`Error calculating HP for Pokemon ${pokemonId}: ${error}`);
      return 0;
    });
}
