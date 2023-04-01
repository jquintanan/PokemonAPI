import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  fetchPokemonList,
  fetchPokemonData,
  PokemonData,
  fetchPokedexEntry,
} from "./api";
import { useState, useEffect } from "react";
import { Pokemon } from "./components/Pokemon.react";
import { PokemonType } from "./components/PokemonType.react";

function App() {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [filteredPokemonData, setFilteredPokemonData] = useState<PokemonData[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    fetchPokemonList().then((response) => {
      setPokemonList(response.results);
    });
  }, []);

  useEffect(() => {
    Promise.all(
      pokemonList.map((pokemon: any) => {
        const pokemon_id = pokemon.url.split("/").slice(-2, -1)[0];
        return Promise.all([
          fetchPokemonData(pokemon_id),
          fetchPokedexEntry(pokemon_id),
        ]).then(([pokemonData, speciesData]) => {
          console.log(speciesData);
          return {
            ...pokemonData,
            pokedexEntry: speciesData.flavor_text_entries
              .find((entry: any) => entry.language.name === "en")
              .flavor_text.replace("\n", " ")
              .replace("\f", " "),
          };
        });
      })
    ).then((responses) => {
      setPokemonData(responses);
      setFilteredPokemonData(responses);
    });
  }, [pokemonList]);

  useEffect(() => {
    var filteredPokemonDataTemp = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedType !== "") {
      filteredPokemonDataTemp = filteredPokemonDataTemp.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === selectedType)
      );
    }
    setFilteredPokemonData(filteredPokemonDataTemp);
  }, [search, selectedType]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon API Test</h1>
        <div id="search_bar">
          <input
            type="text"
            id="search_input"
            placeholder="Search by name"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <td>Pokedex</td>
                <td>Name</td>
                <td>Dex Entry</td>
                <td>Height</td>
                <td>Weight</td>
                <td>
                  Types
                  <select
                    id="type-select"
                    onChange={handleTypeChange}
                    value={selectedType}
                  >
                    <option value="">All types</option>
                    <option value="normal">Normal</option>
                    <option value="fighting">Fighting</option>
                    <option value="flying">Flying</option>
                    <option value="poison">Poison</option>
                    <option value="ground">Ground</option>
                    <option value="rock">Rock</option>
                    <option value="bug">Bug</option>
                    <option value="ghost">Ghost</option>
                    <option value="steel">Steel</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="electric">Electric</option>
                    <option value="psychic">Psychic</option>
                    <option value="ice">Ice</option>
                    <option value="dragon">Dragon</option>
                    <option value="dark">Dark</option>
                    <option value="fairy">Fairy</option>
                  </select>
                </td>
                <td>Regular</td>
                <td>Shiny</td>
                <td>Profile</td>
              </tr>
            </thead>
            <tbody>
              {filteredPokemonData.map((pokemon) => {
                return (
                  <tr id={`${pokemon.id}`}>
                    <td>{pokemon.id}</td>
                    <td>{pokemon.name}</td>
                    <td>{pokemon.pokedexEntry}</td>
                    <td>{pokemon.height}</td>
                    <td>{pokemon.weight}</td>
                    <td>
                      {pokemon.types.map((type) => {
                        return <PokemonType name={type.type.name} />;
                      })}
                    </td>
                    <td>
                      <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        height={"200px"}
                        width={"200px"}
                      />
                    </td>
                    <td>
                      <img
                        src={pokemon.sprites.front_shiny}
                        alt={pokemon.name}
                        height={"200px"}
                        width={"200px"}
                      />
                    </td>
                    <td>
                      <Pokemon pokemonData={pokemon} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
