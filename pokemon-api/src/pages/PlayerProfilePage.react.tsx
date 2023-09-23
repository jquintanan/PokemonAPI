import { useEffect, useState } from "react";
import { ItemData, PokemonAllData, fetchItems } from "../api";
import { PokemonFighter } from "../components/PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { get } from "http";

interface PlayerProfilePageProps {
  selectedPokemon: PokemonAllData[];
}

export const PlayerProfilePage: React.FC<PlayerProfilePageProps> = ({
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

  const player_info = (
    <div className="section">
      <h3>Player Info</h3>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "100px", textAlign: "center" }}>
          <div>
            <img
              src="pokemon-trainer.jpg"
              alt="Joel Quintana"
              width={"100px"}
              height={"100px"}
            />
          </div>
          <div>
            <h4>Name</h4>
            Joel Quintana
          </div>
          <div>
            <h4>Money</h4>${99999999999}
          </div>
          <div>
            <h4>Record</h4>
            Wins
            <br />
            Losses
            <br />
            Run away
          </div>
        </div>
      </div>
    </div>
  );

  const current_team = selectedPokemon.length > 0 &&
    selectedPokemon[0] !== undefined && (
      <div className="section">
        <h3>My Pokemon</h3>
        <div style={{ display: "flex", flexDirection: "row" }}>
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
      </div>
    );

  const current_items = (
    <div className="section">
      <h3>My Items</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items.slice(0, 4).map((item) => {
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
              <div>x{Math.floor(9 * Math.random() + 1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <h2>Player Profile</h2>
      {player_info}
      {current_team}
      {current_items}
    </div>
  );
};
