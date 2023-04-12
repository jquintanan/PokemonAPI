const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

export interface PokemonListElement {
  name: string;
  url: string;
}

export interface PokemonList {
  count: number;
  next: string;
  previous: string;
  results: PokemonListElement[];
}

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
  species: {
    url: string;
  };
}

export interface SpeciesData {
  pokedexEntry: string;
  base_happiness: number;
  capture_rate: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  id: number;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
}

export interface PokemonAllData {
  id: number;
  name: string;
  dex_entry: string;
  pokemon_data: PokemonData;
  species_data: SpeciesData;
}

export interface PokemonInstance {
  data: PokemonAllData;
  isShiny: boolean;
  level: number;
  max_hp: number;
  current_hp: number;
}

export function fetchPokemonList(): Promise<PokemonList> {
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

export async function fetchAllData(): Promise<PokemonAllData[]> {
  const pokemon_list = await fetchPokemonList();

  const all_data: PokemonAllData[] = await Promise.all(
    pokemon_list.results.map(async (pokemon) => {
      const pokemon_data = await fetchPokemonDataURL(pokemon.url);
      const species_data = await fetchSpeciesDataURL(pokemon_data.species.url);

      const id: number = pokemon_data.id;
      const dex_entry =
        species_data.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace("\n", " ")
          .replace("\f", " ") ?? "";

      return {
        id: id,
        name: pokemon.name,
        dex_entry: dex_entry,
        pokemon_data,
        species_data,
      };
    })
  );

  return all_data;
}

export function fetchPokemonDataURL(url: string): Promise<PokemonData> {
  return fetch(url)
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

export function fetchSpeciesDataURL(url: string): Promise<SpeciesData> {
  return fetch(url)
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

//TODO: Calculate from PokemonAllData instead of calling another webservice
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
