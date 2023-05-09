import React from "react";
import { PokemonAllData } from "../api";
import { PokemonType } from "./PokemonType.react";
import { PokemonHPBar } from "./PokemonHPBar.react";
import PokemonInstance from "../PokemonInstance.class";
import { PokemonFighterStatBar } from "./PokemonFigherStatBar.react";

interface PokemonFighterProps {
  pokemon_instance: PokemonInstance;
  maxStats: { [key: string]: number };
  minStats: { [key: string]: number };
  setSelectedPokemon?: ((pokemon: PokemonAllData[]) => void) | null;
  fighterMode: FighterMode;
}

type FighterMode = "selection" | "battle";

export const PokemonFighter: React.FC<PokemonFighterProps> = ({
  pokemon_instance,
  maxStats,
  minStats,
  setSelectedPokemon,
  fighterMode,
}) => {
  const base_stats = PokemonInstance.getStatsFromPokemonDataAndLevel(
    pokemon_instance.data,
    1
  );

  return (
    <div
      className="Pokemon"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        flexGrow: 1,
        //minWidth: "320px",
        //paddingInline: "20px",
        //margin: "-10px",
        //maxWidth: "400px",
        // borderColor: isShiny ? "#B8860B" : "",
        // borderWidth: isShiny ? "2px" : "",
        // padding: isShiny ? "-2px" : "",
      }}
    >
      <h3 className="section" style={{ height: "20px" }}>
        #{pokemon_instance.data.id} {pokemon_instance.data.name}
        {pokemon_instance.isShiny ? " 💎" : ""}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "0",
          margin: "0",
          height: "20px",
        }}
      >
        {pokemon_instance.data.pokemon_data.types.map((type) => {
          return (
            <div className="PokemonType" key={type.type.name}>
              <PokemonType name={type.type.name} />
            </div>
          );
        })}
      </div>
      <img
        src={
          pokemon_instance.isShiny
            ? pokemon_instance.data.pokemon_data.sprites.front_shiny
            : pokemon_instance.data.pokemon_data.sprites.front_default
        }
        alt="pokemon"
      />
      {fighterMode === "selection" && (
        <div className="section">
          <h4>Stats</h4>
          <div style={{ marginTop: "10px" }}>
            <PokemonFighterStatBar
              name={"HP"}
              base={base_stats.max_hp}
              min={minStats["hp"]}
              max={maxStats["hp"]}
            />
            <PokemonFighterStatBar
              name={"Attack"}
              base={base_stats.attack}
              min={minStats["attack"]}
              max={maxStats["attack"]}
            />
            <PokemonFighterStatBar
              name={"Defense"}
              base={base_stats.defense}
              min={minStats["defense"]}
              max={maxStats["defense"]}
            />
            <PokemonFighterStatBar
              name={"Sp. Attack"}
              base={base_stats.special_attack}
              min={minStats["special-attack"]}
              max={maxStats["special-attack"]}
            />
            <PokemonFighterStatBar
              name={"Sp. Defense"}
              base={base_stats.special_defense}
              min={minStats["special-defense"]}
              max={maxStats["special-defense"]}
            />
            <PokemonFighterStatBar
              name={"Speed"}
              base={base_stats.speed}
              min={minStats["speed"]}
              max={maxStats["speed"]}
            />
          </div>
        </div>
      )}
      {fighterMode === "selection" && (
        <div className="section">
          {setSelectedPokemon && (
            <button onClick={() => setSelectedPokemon([pokemon_instance.data])}>
              Select
            </button>
          )}
        </div>
      )}
      {fighterMode === "battle" && (
        <div className="section">
          <h3>Lv. {pokemon_instance.level}</h3>
        </div>
      )}
      {fighterMode === "battle" && (
        <div
          id="hp_bar_container"
          style={{ width: "90%", padding: "0", margin: "0" }}
        >
          <PokemonHPBar
            currentHP={pokemon_instance.current_hp ?? 0}
            maxHP={pokemon_instance.stats.max_hp ?? 0}
          />
        </div>
      )}
    </div>
  );
};
