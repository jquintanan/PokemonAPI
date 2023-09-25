import React from "react";
import {
  getStatsUpperAndLowerBounds as getBaseStatsUpperAndLowerBounds,
  PokemonStats,
  getBaseStats,
} from "../api";
import { PokemonType } from "./PokemonType.react";
import { PokemonHPBar } from "./PokemonHPBar.react";
import PokemonInstance from "../PokemonInstance.class";
import { PokemonFighterStatBar } from "./PokemonFigherStatBar.react";

interface PokemonFighterProps {
  pokemon_instance: PokemonInstance;
  fighterMode: FighterMode;
  children?: React.ReactNode;
  showBaseStats?: boolean;
  showCurrentStats?: boolean;
  showHPBar?: boolean;
  showLevel?: boolean;
  showType?: boolean;
}

type FighterMode = "selection" | "battle";

export const PokemonFighter: React.FC<PokemonFighterProps> = ({
  pokemon_instance,
  fighterMode,
  children,
  showBaseStats = false,
  showCurrentStats = false,
  showHPBar = false,
  showLevel = false,
  showType = false,
}) => {
  const minMaxStats = getBaseStatsUpperAndLowerBounds();
  const base_stats: PokemonStats = getBaseStats(pokemon_instance.data);

  return (
    <div
      className="Pokemon"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        flexGrow: 1,
        gap: "10px",
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
      {showType && (
        <div
          className="section"
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
      )}

      <img
        src={
          pokemon_instance.isShiny
            ? pokemon_instance.data.pokemon_data.sprites.front_shiny
            : pokemon_instance.data.pokemon_data.sprites.front_default
        }
        alt="pokemon"
      />

      {showCurrentStats && (
        <div className="section">
          <h4>Current Stats</h4>
          <div style={{ marginTop: "10px" }}>
            Attack: {pokemon_instance.stats.attack}
            <br />
            Defense: {pokemon_instance.stats.defense}
            <br />
            Sp. Attack: {pokemon_instance.stats.special_attack}
            <br />
            Sp. Defense: {pokemon_instance.stats.special_defense}
            <br />
            Speed: {pokemon_instance.stats.speed}
            <br />
            Exp: {pokemon_instance.exp}
          </div>
        </div>
      )}

      {showLevel && (
        <div className="section">
          <h3>Lv. {pokemon_instance.level}</h3>
        </div>
      )}
      {showHPBar && (
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

      {showBaseStats && (
        <div className="section">
          <h4>Base Stats</h4>
          <div style={{ marginTop: "10px" }}>
            <PokemonFighterStatBar
              name={"HP"}
              base={base_stats.hp}
              min={minMaxStats.min.hp}
              max={minMaxStats.max.hp}
            />
            <PokemonFighterStatBar
              name={"Attack"}
              base={base_stats.attack}
              min={minMaxStats.min.attack}
              max={minMaxStats.max.attack}
            />
            <PokemonFighterStatBar
              name={"Defense"}
              base={base_stats.defense}
              min={minMaxStats.min.defense}
              max={minMaxStats.max.defense}
            />
            <PokemonFighterStatBar
              name={"Sp. Attack"}
              base={base_stats.special_attack}
              min={minMaxStats.min.special_attack}
              max={minMaxStats.max.special_attack}
            />
            <PokemonFighterStatBar
              name={"Sp. Defense"}
              base={base_stats.special_defense}
              min={minMaxStats.min.special_defense}
              max={minMaxStats.max.special_defense}
            />
            <PokemonFighterStatBar
              name={"Speed"}
              base={base_stats.speed}
              min={minMaxStats.min.speed}
              max={minMaxStats.max.speed}
            />
          </div>
        </div>
      )}

      {children && <div className="section">{children}</div>}
    </div>
  );
};
