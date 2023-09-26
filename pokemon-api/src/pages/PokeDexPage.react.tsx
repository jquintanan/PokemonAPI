import { useState, useEffect } from "react";
import { PokemonType } from "../components/PokemonType.react";
import { PokemonAllData } from "../api";
import { Link } from "react-router-dom";
import { log } from "../PokemonAppLogger";
import { useSelector } from "react-redux";
import { selectAllPokemonData } from "../state/allPokemonDataSlice";

interface PokeDexPageProps {}

export const PokeDexPage: React.FC<PokeDexPageProps> = ({}) => {
  let pokemonData = useSelector(selectAllPokemonData).allPokemonData;
  useEffect(() => {
    log("pokedex_view");
  }, []);
  const [filteredPokemonData, setFilteredPokemonData] = useState<
    PokemonAllData[]
  >([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    var filteredPokemonDataTemp = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedType !== "") {
      filteredPokemonDataTemp = filteredPokemonDataTemp.filter((pokemon) =>
        pokemon.pokemon_data.types.some(
          (type) => type.type.name === selectedType
        )
      );
    }
    setFilteredPokemonData(filteredPokemonDataTemp);
  }, [search, selectedType, pokemonData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  return (
    <div>
      <table id="pokemon_list">
        <thead>
          <th>Pokedex</th>
          <th>
            Name
            <input
              type="text"
              id="search_input"
              placeholder="Search by name"
              onChange={handleInputChange}
            />
          </th>
          <th>Dex Entry</th>
          <th>Height</th>
          <th>Weight</th>
          <th>
            Types
            <select
              id="type-select"
              onChange={handleTypeChange}
              value={selectedType}
            >
              <option value="">All types</option>
              <option value="bug">Bug</option>
              <option value="dark">Dark</option>
              <option value="dragon">Dragon</option>
              <option value="electric">Electric</option>
              <option value="fairy">Fairy</option>
              <option value="fighting">Fighting</option>
              <option value="fire">Fire</option>
              <option value="flying">Flying</option>
              <option value="ghost">Ghost</option>
              <option value="grass">Grass</option>
              <option value="ground">Ground</option>
              <option value="ice">Ice</option>
              <option value="normal">Normal</option>
              <option value="poison">Poison</option>
              <option value="psychic">Psychic</option>
              <option value="rock">Rock</option>
              <option value="steel">Steel</option>
              <option value="water">Water</option>
            </select>
          </th>
          <th>Regular</th>
          <th>Shiny</th>
        </thead>
        <tbody>
          {filteredPokemonData.map((pokemon) => {
            return (
              <tr id={`${pokemon.id}`}>
                <td>{pokemon.id}</td>
                <td style={{ textTransform: "capitalize" }}>
                  <Link to={`/profile/${pokemon.id}`}>{pokemon.name}</Link>
                </td>
                <td>{pokemon.dex_entry}</td>
                <td>{pokemon.pokemon_data.height}</td>
                <td>{pokemon.pokemon_data.weight}</td>
                <td>
                  {pokemon.pokemon_data.types.map((type) => {
                    return <PokemonType name={type.type.name} />;
                  })}
                </td>
                <td>
                  <img
                    src={pokemon.pokemon_data.sprites.front_default}
                    alt={pokemon.name}
                    height={"200px"}
                    width={"200px"}
                  />
                </td>
                <td>
                  <img
                    src={pokemon.pokemon_data.sprites.front_shiny}
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
  );
};
