/*
TODO: Separate logic supposed to be run on server vs client
*/

const NUMBER_OF_POKEMON = 151;
const NUMBER_OF_ITEMS = 50;

const POKEMON_LIST_API_URL =
  "https://pokeapi.co/api/v2/pokemon?limit=" + NUMBER_OF_POKEMON;
const ITEM_LIST_API_URL =
  "https://pokeapi.co/api/v2/item?limit=" + NUMBER_OF_ITEMS;

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
    effort: number;
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
  abilities: {
    //TODO: Implement abilities?
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
  base_stats: PokemonStats;
  evs: PokemonStats;
}

interface AllLoadedData {
  all_pokemon_data: PokemonAllData[];
  all_item_data: ItemData[];
}

export async function loadAllData(): Promise<AllLoadedData> {
  const all_pokemon_data = await fetchAllData();
  const all_item_data = await fetchItems();

  return { all_pokemon_data, all_item_data };
}

export function fetchPokemonList(): Promise<PokemonList> {
  return fetch(POKEMON_LIST_API_URL)
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
      const base_stats = getBaseStatsFromPokemonData(pokemon_data);
      const evs = getEVsFromPokemonData(pokemon_data);

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
        base_stats,
        evs,
      };
    })
  );

  updateHabitatsData(all_data);

  ALL_POKEMON_ALL_DATA = all_data;

  return all_data;
}

function fetchPokemonDataURL(url: string): Promise<PokemonData> {
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

function fetchSpeciesDataURL(url: string): Promise<SpeciesData> {
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

function updateHabitatsData(pokemonData: PokemonAllData[]) {
  pokemonData.forEach((pokemon) => {
    const habitat = HABITATS.find(
      (h) => h.name === pokemon.species_data.habitat.name
    );

    if (habitat) {
      habitat.pokemon.push(pokemon);
    }
  });
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

export let ALL_ITEMS_DATA: ItemData[] = [];
export async function fetchItems(): Promise<ItemData[]> {
  if (ALL_ITEMS_DATA.length > 0) {
    return ALL_ITEMS_DATA;
  }

  const all_item_urls: {
    results: { name: string; url: string }[];
  } = await fetch(ITEM_LIST_API_URL).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  });

  const all_item_data = await Promise.all(
    all_item_urls.results.map(async (item) => {
      const item_data = await fetchItemData(item.url);
      return item_data;
    })
  );

  ALL_ITEMS_DATA = all_item_data;

  return all_item_data;
}

function fetchItemData(url: string): Promise<ItemData> {
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

function getBaseStatsFromPokemonData(pokemon_data: PokemonData): PokemonStats {
  const { stats } = pokemon_data;
  const base_stats: PokemonStats = {
    hp: stats[0].base_stat,
    attack: stats[1].base_stat,
    defense: stats[2].base_stat,
    special_attack: stats[3].base_stat,
    special_defense: stats[4].base_stat,
    speed: stats[5].base_stat,
  };

  return base_stats;
}

function getEVsFromPokemonData(pokemon_data: PokemonData): PokemonStats {
  const { stats } = pokemon_data;
  const evs: PokemonStats = {
    hp: stats[0].effort,
    attack: stats[1].effort,
    defense: stats[2].effort,
    special_attack: stats[3].effort,
    special_defense: stats[4].effort,
    speed: stats[5].effort,
  };

  return evs;
}

interface MinMaxStats {
  min: PokemonStats;
  max: PokemonStats;
}

let MIN_MAX_BASE_STATS: MinMaxStats | null = null;
export function getBaseStatsRanges(): MinMaxStats {
  if (MIN_MAX_BASE_STATS) {
    return MIN_MAX_BASE_STATS;
  }
  const pokemonData = ALL_POKEMON_ALL_DATA;
  const all_stats = pokemonData.reduce(
    (acc, { base_stats }) => {
      acc.hp.push(base_stats.hp);
      acc.attack.push(base_stats.attack);
      acc.defense.push(base_stats.defense);
      acc.special_attack.push(base_stats.special_attack);
      acc.special_defense.push(base_stats.special_defense);
      acc.speed.push(base_stats.speed);
      return acc;
    },
    {
      hp: [] as number[],
      attack: [] as number[],
      defense: [] as number[],
      special_attack: [] as number[],
      special_defense: [] as number[],
      speed: [] as number[],
    }
  );

  const minMaxStats: MinMaxStats = {
    min: {
      hp: Math.min(...all_stats.hp),
      attack: Math.min(...all_stats.attack),
      defense: Math.min(...all_stats.defense),
      special_attack: Math.min(...all_stats.special_attack),
      special_defense: Math.min(...all_stats.special_defense),
      speed: Math.min(...all_stats.speed),
    },
    max: {
      hp: Math.max(...all_stats.hp),
      attack: Math.max(...all_stats.attack),
      defense: Math.max(...all_stats.defense),
      special_attack: Math.max(...all_stats.special_attack),
      special_defense: Math.max(...all_stats.special_defense),
      speed: Math.max(...all_stats.speed),
    },
  };

  MIN_MAX_BASE_STATS = minMaxStats;
  return minMaxStats;
}
