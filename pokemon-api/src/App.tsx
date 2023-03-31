import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { fetchPokemonList, fetchPokemonData, PokemonData } from "./api";
import { useState, useEffect } from "react";

function App() {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);

  useEffect(() => {
    fetchPokemonList().then((response) => {
      setPokemonList(response.results);
    });
  }, []);

  useEffect(() => {
    Promise.all(
      pokemonList.map((pokemon: any) => {
        const pokemon_id = pokemon.url.split("/").slice(-2, -1)[0];
        return fetchPokemonData(pokemon_id);
      })
    ).then((responses) => {
      setPokemonData(responses);
    });
  }, [pokemonList]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon API Test</h1>
        <div>
          <table>
            <thead>
              <tr>
                <td>Pokedex</td>
                <td>Name</td>
                <td>Height and Weight</td>
                <td>Regular</td>
                <td>Shiny</td>
              </tr>
            </thead>
            <tbody>
              {pokemonData.map((pokemon) => {
                return (
                  <tr id={`${pokemon.id}`}>
                    <td>{pokemon.id}</td>
                    <td>{pokemon.name}</td>
                    <td>
                      <p>H: {pokemon.height}</p>
                      <p>W: {pokemon.weight}</p>
                    </td>
                    <td>
                      <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        height={"200px"}
                        width={"200px"}
                      />
                      <img
                        src={pokemon.sprites.back_default}
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
                      <img
                        src={pokemon.sprites.back_shiny}
                        alt={pokemon.name}
                        height={"200px"}
                        width={"200px"}
                      />
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
