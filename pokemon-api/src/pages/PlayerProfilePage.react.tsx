import { useEffect, useState } from "react";
import { ItemData, PokemonAllData, fetchItems } from "../api";
import { PokemonFighter } from "../components/PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { get } from "http";
import { InventoryItem } from "../components/InventoryItem.react";
import { useSelector, useDispatch } from "react-redux";

import type { RootState } from "../state/store";

//import from profileInfoSlice
import {
  setName,
  setMoney,
  increaseMoney,
  selecPlayerData,
} from "../state/playerDataSlice";

interface PlayerProfilePageProps {
  selectedPokemon: PokemonAllData[];
}

export const PlayerProfilePage: React.FC<PlayerProfilePageProps> = ({
  selectedPokemon,
}) => {
  const dispatch = useDispatch();
  const playerData = useSelector(selecPlayerData);

  console.log("Rendering PokemonGameView-PlayerProfileScreen");

  const player_info = (
    <div className="section">
      <h3>Player Info</h3>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "100px", textAlign: "center" }}>
          <div>
            <img src="pokemon-trainer.jpg" width={"100px"} height={"100px"} />
          </div>
        </div>
        <div>
          <div>Name: {playerData.name}</div>
          <div>Money: ${playerData.money}</div>
        </div>
      </div>
    </div>
  );

  const owned_pokemon = playerData.ownedPokemon;

  const current_team = selectedPokemon.length > 0 &&
    selectedPokemon[0] !== undefined && (
      <div className="section">
        <h3>My Pokemon</h3>
        {owned_pokemon.length === 0 && (
          <div>You don't have any pokemon yet!</div>
        )}
        <div style={{ display: "flex", flexDirection: "row" }}>
          {playerData.ownedPokemon.map((pokemon_instance) => {
            const pokemon = pokemon_instance.data;
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

  const owned_items = playerData.ownedItems;
  const current_items = (
    <div className="section">
      <h3>My Items</h3>
      {owned_items.length === 0 && <div>You don't have any items yet!</div>}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {playerData.ownedItems.map(({ item, amount }) => {
          return (
            <InventoryItem
              item={item}
              key={"item " + item.id}
              quantity={amount}
            />
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
