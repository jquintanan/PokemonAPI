import React from 'react';
import logo from './logo.svg';
import './App.css';
import { fetchPokemonList, fetchPokemonData, PokemonData } from './api';
import {useState, useEffect} from 'react';

function App() {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);

  useEffect(() => {

    fetchPokemonList().then((response) => {
      setPokemonList(response.results);
    }
    
  );
  },[]);

  useEffect(()=>{
    let newPokemonData: PokemonData[] = [];
    Promise.all(pokemonList.map((pokemon:any) => {
      const pokemon_id = pokemon.url.split('/').slice(-2, -1)[0];
      return fetchPokemonData(pokemon_id)
    })).then((responses) => {
      setPokemonData(responses);
    }
    );
  },[pokemonList]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon API Test</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
        <table>
              <thead>
                <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Sprite</td>
                </tr>
              </thead>
              <tbody>
                {pokemonData.map((pokemon) => {

            return <tr id={pokemon.id.toString()}>
              <td>{pokemon.id}</td>
                <td>{pokemon.name}</td>
                  <td><img src={pokemon.sprites.front_default} alt={pokemon.name} height={"200px"} width={"200px"}/></td>
                  </tr>
                  
          })}
          </tbody>
                </table>

          </div>
      </header>
    </div>
  );
}

export default App;
