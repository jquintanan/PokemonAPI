import React from "react";

interface PokemonHPBarProps {
  maxHP: number;
  currentHP: number;
}

export const PokemonHPBar: React.FC<PokemonHPBarProps> = ({
  maxHP,
  currentHP,
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>HP</h3>
      <h4>{`${currentHP} / ${maxHP}`}</h4>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "gray",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${Math.round((currentHP / maxHP) * 100)}%`,
            height: "100%",
            backgroundColor: "green",
            borderRadius: "10px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
      </div>
    </div>
  );
};
