import React from "react";
import { PokemonAllData } from "../api";

interface PokemonTypeProps {
  name: string;
}

const base_style = {
  padding: "5px",
  borderRadius: "5px",
  //margin: "5px",
  display: "inline-block",
  fontSize: "12px",
  width: "80px",
};

//generate styles based on pokemon type
const specific_style = (name: string) => {
  switch (name) {
    case "normal":
      return {
        backgroundColor: "#A8A878",
        color: "white",
      };
    case "fighting":
      return {
        backgroundColor: "#C03028",
        color: "white",
      };
    case "flying":
      return {
        backgroundColor: "#A890F0",
        color: "white",
      };
    case "poison":
      return {
        backgroundColor: "#A040A0",
        color: "white",
      };
    case "ground":
      return {
        backgroundColor: "#E0C068",
        color: "white",
      };
    case "rock":
      return {
        backgroundColor: "#B8A038",
        color: "white",
      };
    case "bug":
      return {
        backgroundColor: "#A8B820",
        color: "white",
      };
    case "ghost":
      return {
        backgroundColor: "#705898",
        color: "white",
      };
    case "steel":
      return {
        backgroundColor: "#B8B8D0",

        color: "white",
      };
    case "fire":
      return {
        backgroundColor: "#F08030",
        color: "white",
      };
    case "water":
      return {
        backgroundColor: "#6890F0",
        color: "white",
      };
    case "grass":
      return {
        backgroundColor: "#78C850",
        color: "white",
      };
    case "electric":
      return {
        backgroundColor: "#F8D030",
        color: "white",
      };
    case "psychic":
      return {
        backgroundColor: "#F85888",
        color: "white",
      };
    case "ice":
      return {
        backgroundColor: "#98D8D8",
        color: "white",
      };
    case "dragon":
      return {
        backgroundColor: "#7038F8",
        color: "white",
      };
    case "dark":
      return {
        backgroundColor: "#705848",
        color: "white",
      };
    case "fairy":
      return {
        backgroundColor: "#EE99AC",
        color: "white",
      };
    default:
      return {
        backgroundColor: "white",
        color: "black",
      };
  }
};

const TYPE_CHART: { [key: string]: { [key: string]: number } } = {
  normal: {
    rock: 0.5,
    ghost: 0,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5,
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    bug: 2,
    rock: 0.5,
    ghost: 0.5,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 2,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
  },
  dragon: {
    dragon: 2,
  },
};

export function calculateTypeMultiplier(
  attacker: PokemonAllData,
  defender: PokemonAllData
) {
  //Calculate type multiplier using all types of the attacker and defender
  //Usually we only use the type of the attack, but since we dont have a specific attack, we use all types of the attacker
  let multiplier = 1;
  const attackerTypes = attacker.pokemon_data.types.map(
    (type) => type.type.name
  );

  const defenderTypes = defender.pokemon_data.types.map(
    (type) => type.type.name
  );

  for (const attackType of attackerTypes) {
    const chartForAttackType = TYPE_CHART[attackType];
    if (!chartForAttackType) {
      continue;
    }

    for (const defenderType of defenderTypes) {
      const effectiveness = chartForAttackType[defenderType];
      if (!effectiveness) {
        continue;
      }

      if (effectiveness === 0) {
        multiplier *= 0;
      } else if (effectiveness === 0.5) {
        multiplier *= 0.5;
      } else if (effectiveness === 2) {
        multiplier *= 2;
      }
    }
  }

  return multiplier;
}

export const PokemonType: React.FC<PokemonTypeProps> = ({ name }) => {
  //combine styles with generated styles
  const combined_styles = { ...base_style, ...specific_style(name) };
  return <div style={combined_styles}>{name.toUpperCase()}</div>;
};
