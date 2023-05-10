import { useEffect, useState } from "react";
import { ItemData, PokemonAllData, fetchItems } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { get } from "http";

interface PokemonGamePlayerProfileScreenProps {
  selectedPokemon: PokemonAllData[];
}

export const PokemonGamePlayerProfileScreen: React.FC<PokemonGamePlayerProfileScreenProps> = ({
  selectedPokemon,
}) => {
  const [items, setItems] = useState<ItemData[]>([]);
  useEffect(() => {
    log("player_profile_screen");
    fetchItems().then((items) => {
      setItems(items);
    });
  }, []);
  console.log("Rendering PokemonGameView-PlayerProfileScreen");
  const current_team = selectedPokemon.length > 0 &&
    selectedPokemon[0] !== undefined && (
      <div className="section">
        <h3>Team</h3>
        {selectedPokemon.map((pokemon) => {
          return (
            <div
              style={{ width: "100px", textAlign: "center" }}
              key={"current_Selection " + pokemon.id}
            >
              <div>
                <img
                  src={pokemon.pokemon_data.sprites.front_default}
                  alt={pokemon.name}
                />
              </div>
              <div>{pokemon.name}</div>
            </div>
          );
        })}
      </div>
    );

  const current_items = (
    <div className="section">
      <h3>Items</h3>
      <a>Coming soon...</a>
    </div>
  );

  const shop = (
    <div className="section">
      <h3>Shop</h3>
      <p>Current Money: $999999999</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items.map((item) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "10px",
              }}
              key={"item " + item.id}
            >
              <div>
                <img src={item.image} alt={item.name} />
              </div>
              <div>{item.name}</div>
              <div>Price: ${item.cost}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}
    >
      <h2>Player Profile</h2>
      {current_team}
      {current_items}
      {shop}
    </div>
  );
};
