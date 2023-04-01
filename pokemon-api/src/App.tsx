import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { PokemonListView } from "./components/PokemonListView.react";
import { PokemonProfileView } from "./components/PokemonProfileView.react";
import {
  PokemonData,
  fetchPokedexEntry,
  fetchPokemonData,
  fetchPokemonList,
} from "./api";

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
        return Promise.all([
          fetchPokemonData(pokemon_id),
          fetchPokedexEntry(pokemon_id),
        ]).then(([pokemonData, speciesData]) => {
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
    });
  }, [pokemonList]);

  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <div id="app_title_name">
            <img src="pokeball.png" alt="pokeball" id="pokeball_icon" />
            <h1>Pokemon API Test</h1>
          </div>
          <div id="navigation_bar">
            <nav id="site_navigation_bar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/profile/1">Profile</Link>
                </li>
                <li>
                  <Link to="/game">Game</Link>
                </li>

                <li>
                  <Link to="/about">About</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={<PokemonListView pokemonData={pokemonData} />}
          />
          <Route
            path="/game"
            element={
              <div>
                <h1>Game</h1>
                <p>Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div>
                <h1>About</h1>
                <p>Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/profile/:id"
            element={<PokemonProfileView data={pokemonData} />}
          />
          <Route path="*" element={<h1>404: Incorrect Path</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
