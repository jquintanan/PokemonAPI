import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { PokemonPokeDexView } from "./components/PokemonPokeDexView.react";
import { PokemonProfileView } from "./components/PokemonProfileView.react";
import { PokemonAllData, fetchAllData } from "./api";
import { PokemonGameView } from "./components/PokemonGameView.react";
import { AboutView } from "./components/AboutView.react";
import { log } from "./PokemonAppLogger";

function App() {
  const [pokemonData, setPokemonData] = useState<PokemonAllData[]>([]);

  useEffect(() => {
    log("site_root");
    fetchAllData().then((response) => {
      setPokemonData(response);
    });
  }, []);

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
