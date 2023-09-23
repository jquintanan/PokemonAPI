import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { PokeDexPage } from "./pages/PokeDexPage.react";
import { PokemonProfileView } from "./components/PokemonProfileView.react";
import { PokemonAllData, fetchAllData } from "./api";
import { GamePage } from "./pages/GamePage.react";
import { AboutPage } from "./pages/AboutPage.react";
import { log } from "./PokemonAppLogger";
import { PlayerProfilePage } from "./pages/PlayerProfilePage.react";
import { MarketPage } from "./pages/StorePage.react";

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
                  <Link to="/playerprofile">Player Profile</Link>
                </li>
                <li>
                  <Link to="/market">Market</Link>
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
                <PokeDexPage pokemonData={pokemonData} />
              ) : (
                <h1>Loading...</h1>
              )
            }
          />
          <Route
            path="/"
            element={
              pokemonData.length > 0 ? (
                <GamePage pokemonData={pokemonData} />
              ) : (
                <h1>Loading...</h1>
              )
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/profile/:id"
            element={<PokemonProfileView data={pokemonData} />}
          />
          <Route
            path="/playerprofile"
            element={
              <PlayerProfilePage selectedPokemon={pokemonData.slice(0, 9)} />
            }
          />
          <Route
            path="/market"
            element={<MarketPage selectedPokemon={pokemonData.slice(0, 9)} />}
          />
          <Route path="*" element={<h1>404: Incorrect Path</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
