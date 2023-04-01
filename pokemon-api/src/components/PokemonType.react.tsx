import React from "react";

interface PokemonTypeProps {
  name: string;
}

const base_style = {
  padding: "5px",
  borderRadius: "5px",
  margin: "5px",
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

export const PokemonType: React.FC<PokemonTypeProps> = ({ name }) => {
  //combine styles with generated styles
  const combined_styles = { ...base_style, ...specific_style(name) };
  return <div style={combined_styles}>{name.toUpperCase()}</div>;
};
