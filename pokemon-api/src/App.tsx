import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

import { PokemonPokeDexView } from "./components/PokemonPokeDexView.react";
import { PokemonProfileView } from "./components/PokemonProfileView.react";
import {
  PokemonData,
  fetchPokedexEntry,
  fetchPokemonData,
  fetchPokemonList,
} from "./api";
import { PokemonGameView } from "./components/PokemonGameView.react";
import { AboutView } from "./components/AboutView.react";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAOTylCoOrqxdJV117qCJHXsBR9KJv4I5M",
    authDomain: "joelquintana-pokemon-api.firebaseapp.com",
    projectId: "joelquintana-pokemon-api",
    storageBucket: "joelquintana-pokemon-api.appspot.com",
    messagingSenderId: "861732344836",
    appId: "1:861732344836:web:3e328b8911b7cf89e41151",
    measurementId: "G-Y6C84KSC82",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  logEvent(analytics, "page_view");

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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <div id="app_title_name">
            <img src="pokeball.png" alt="pokeball" id="pokeball_icon" />
            <h1 style={{ display: isMobile ? "none" : "" }}>Pokemon TOJO</h1>
          </div>
          <div id="navigation_bar">
            <nav id="site_navigation_bar">
              <ul>
                <li>
                  <Link to="/">Game</Link>
                </li>
                <li>
                  <Link to="/pokedex">PokeDex</Link>
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
            path="/pokedex"
            element={
              pokemonData.length > 0 ? (
                <PokemonPokeDexView pokemonData={pokemonData} />
              ) : (
                <h1>Loading...</h1>
              )
            }
          />
          <Route
            path="/"
            element={
              pokemonData.length > 0 ? (
                <PokemonGameView pokemonData={pokemonData} />
              ) : (
                <h1>Loading...</h1>
              )
            }
          />
          <Route path="/about" element={<AboutView />} />
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
