const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';

export interface PokemonData {
    id: number;
  name: string;
  weight: number;
  sprites: {
    front_default: string;
    };
}

export function fetchPokemonList(): Promise<any> {
  return fetch(API_URL)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json()
    })
    // .then((data) => {
    //   return {
    //     count: data.count,
    //     results: data.results,
    //   };
    // })
    .catch((error) => {
        console.error('There was a problem with the network request:', error);
        throw error;
      });
}

export function fetchPokemonData(id: number): Promise<PokemonData> {
    const fetch_data_uri = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  //  console.log(fetch_data_uri);
  return fetch(fetch_data_uri)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    })
    .catch((error) => {
      console.error('There was a problem with the network request:', error);
      throw error;
    });
}