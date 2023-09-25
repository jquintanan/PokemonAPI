import PokemonInstance from "./PokemonInstance.class";

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
//this is a test
//write an interface to hold all the battle data
export interface BattleData {
  pokemon1: PokemonInstance;
  pokemon2: PokemonInstance;
  turn: number;
  winner: number;
  battleLog: string[];
}

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
  abilities: {
    //TODO: Implement abilities
    ability: {
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
  habitat: {
    name: string;
  };
}

export interface PokemonAllData {
  id: number;
  name: string;
  dex_entry: string;
  pokemon_data: PokemonData;
  species_data: SpeciesData;
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

export let ALL_POKEMON_ALL_DATA: PokemonAllData[] = [];
export async function fetchAllData(): Promise<PokemonAllData[]> {
  if (ALL_POKEMON_ALL_DATA.length > 0) {
    return ALL_POKEMON_ALL_DATA;
  }

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

      console.log(species_data.habitat.name);

      return {
        id: id,
        name: pokemon.name,
        dex_entry: dex_entry,
        pokemon_data,
        species_data,
      };
    })
  );

  fillHabitatsData(all_data);

  ALL_POKEMON_ALL_DATA = all_data;

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

export interface HabitatData {
  name: string;
  full_name: string;
  pokemon: PokemonAllData[];
  image: string;
  description: string;
}

export const HABITATS: HabitatData[] = [
  {
    name: "grassland",
    full_name: "Grassland",
    pokemon: [],
    image: "habitats/Grassland_Habitat.png",
    description:
      " A vast, open plain with gently rolling hills and tall grass that stretches as far as the eye can see. This habitat is home to a variety of Pokémon that thrive in the sunny, temperate climate and feed on the abundant grass and insects.",
  },
  {
    name: "mountain",
    full_name: "Mountain",
    pokemon: [],
    image: "habitats/Mountain_Habitat.png",
    description:
      "A rugged and treacherous landscape of steep cliffs, rocky peaks, and deep valleys. This habitat is home to hardy and resilient Pokémon that have adapted to the harsh conditions, including rock and flying types that can soar through the mountain air.",
  },
  {
    name: "waters-edge",
    full_name: "Water's Edge",
    pokemon: [],
    image: "habitats/Waters-edge_Habitat.png",
    description:
      "A tranquil shoreline where the ocean meets the land, teeming with aquatic Pokémon that swim in the clear, blue waters and bask on the sun-warmed rocks. This habitat is also home to some amphibious and water-resistant Pokémon that can survive both in the water and on land.",
  },
  {
    name: "forest",
    full_name: "Forest",
    pokemon: [],
    image: "habitats/Forest_Habitat.png",
    description:
      "A dense and verdant woodland where shafts of sunlight filter through the leaves and illuminate the forest floor. This habitat is home to a diverse range of Pokémon that hide in the undergrowth, climb trees, and flit between the branches, including bug, grass, and flying types.",
  },
  {
    name: "rough-terrain",
    full_name: "Rough Terrain",
    pokemon: [],
    image: "habitats/Rough-terrain_Habitat.png",
    description:
      "A rugged and challenging landscape of rocky outcrops, steep inclines, and treacherous paths that only the bravest and most determined Pokémon can navigate. This habitat is home to a variety of tough and resilient Pokémon that can withstand the punishing conditions and fight with ferocity.",
  },
  {
    name: "cave",
    full_name: "Cave",
    pokemon: [],
    image: "habitats/Cave_Habitat.png",
    description:
      "A dark and mysterious network of underground tunnels and caverns that wind deep into the earth. This habitat is home to a range of cave-dwelling Pokémon that have adapted to the low light and narrow spaces, including rock, ground, and ghost types.",
  },
  {
    name: "urban",
    full_name: "Urban",
    pokemon: [],
    image: "habitats/Urban_Habitat.png",
    description:
      " A bustling and vibrant cityscape full of towering skyscrapers, busy streets, and flashing neon lights. This habitat is home to a variety of Pokémon that have learned to thrive in the urban environment, including some that have evolved to take advantage of human technology and infrastructure.",
  },
  {
    name: "sea",
    full_name: "Sea",
    pokemon: [],
    image: "habitats/Sea_Habitat.png",
    description:
      " A vast and boundless expanse of open water, dotted with islands and teeming with marine life. This habitat is home to a wide range of aquatic and seafaring Pokémon that swim, dive, and glide through the waves, including some that can even breathe underwater.",
  },
  {
    name: "rare",
    full_name: "Rare",
    pokemon: [],
    image: "habitats/Rare_Habitat.png",
    description:
      "A mysterious and elusive habitat that is seldom seen and even less understood. This habitat is said to be home to some of the rarest and most powerful Pokémon in the world, including legendary and mythical creatures that are the stuff of legends. Only the most skilled and dedicated trainers have any hope of encountering these elusive creatures.",
  },
];

function fillHabitatsData(pokemonData: PokemonAllData[]) {
  pokemonData.forEach((pokemon) => {
    const habitat = HABITATS.find(
      (habitat) => habitat.name === pokemon.species_data.habitat.name
    );

    if (habitat) {
      habitat.pokemon.push(pokemon);
    }
  });
}

export function getHabitatsData(pokemonData: PokemonAllData[]): HabitatData[] {
  if (HABITATS[0].pokemon.length === 0) {
    fillHabitatsData(pokemonData);
  }

  return HABITATS;
}

export interface ItemData {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  cost: number;
  effect: string;
}

export function fetchItems(): Promise<ItemData[]> {
  return fetch("https://pokeapi.co/api/v2/item?limit=50")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      const items = data.results.map((item: any) => {
        return fetchItemData(item.url);
      });

      return Promise.all(items);
    })
    .catch((error) => {
      console.error("There was a problem with the network request:", error);
      throw error;
    });
}

export function fetchItemData(url: string): Promise<ItemData> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      const item: ItemData = {
        id: data.id,
        name: data.name,
        image: data.sprites.default,
        description: data.effect_entries[0].effect,
        category: data.category.name,
        cost: data.cost,
        effect: data.effect_entries[0].effect,
      };

      return item;
    })
    .catch((error) => {
      console.error("There was a problem with the network request:", error);
      throw error;
    });
}

//Calculate min and max stats
export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

export function getBaseStats(pokemon: PokemonAllData): PokemonStats {
  const base_stats_from_api = pokemon.pokemon_data.stats;
  const base_stats: PokemonStats = {
    hp: base_stats_from_api[0].base_stat,
    attack: base_stats_from_api[1].base_stat,
    defense: base_stats_from_api[2].base_stat,
    special_attack: base_stats_from_api[3].base_stat,
    special_defense: base_stats_from_api[4].base_stat,
    speed: base_stats_from_api[5].base_stat,
  };

  return base_stats;
}

interface MinMaxStats {
  min: PokemonStats;
  max: PokemonStats;
}

let MIN_MAX_BASE_STATS: MinMaxStats | null = null;
export function getStatsUpperAndLowerBounds(): MinMaxStats {
  if (MIN_MAX_BASE_STATS) {
    return MIN_MAX_BASE_STATS;
  }
  const pokemonData = ALL_POKEMON_ALL_DATA;
  //find the highest value for each stat among all pokemon and store it in maxStats
  const minMaxStats: MinMaxStats = {
    min: {
      hp: 9999,
      attack: 9999,
      defense: 9999,
      special_attack: 9999,
      special_defense: 9999,
      speed: 9999,
    },
    max: {
      hp: 0,
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0,
    },
  };

  pokemonData.forEach((pokemon) => {
    const base_stats = getBaseStats(pokemon);

    minMaxStats.max.hp = Math.max(base_stats.hp, minMaxStats.max.hp);
    minMaxStats.max.attack = Math.max(
      base_stats.attack,
      minMaxStats.max.attack
    );
    minMaxStats.max.defense = Math.max(
      base_stats.defense,
      minMaxStats.max.defense
    );
    minMaxStats.max.special_attack = Math.max(
      base_stats.special_attack,
      minMaxStats.max.special_attack
    );
    minMaxStats.max.special_defense = Math.max(
      base_stats.special_defense,
      minMaxStats.max.special_defense
    );
    minMaxStats.max.speed = Math.max(base_stats.speed, minMaxStats.max.speed);

    minMaxStats.min.hp = Math.min(base_stats.hp, minMaxStats.min.hp);
    minMaxStats.min.attack = Math.min(
      base_stats.attack,
      minMaxStats.min.attack
    );
    minMaxStats.min.defense = Math.min(
      base_stats.defense,
      minMaxStats.min.defense
    );
    minMaxStats.min.special_attack = Math.min(
      base_stats.special_attack,
      minMaxStats.min.special_attack
    );
    minMaxStats.min.special_defense = Math.min(
      base_stats.special_defense,
      minMaxStats.min.special_defense
    );
    minMaxStats.min.speed = Math.min(base_stats.speed, minMaxStats.min.speed);
  });

  // console.log(maxStats);
  // console.log(minStats);

  MIN_MAX_BASE_STATS = minMaxStats;
  return minMaxStats;
}
