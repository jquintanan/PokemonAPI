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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "#222",
          borderRadius: "20px",
          padding: "5px",
          marginBottom: "5px",
        }}
      >
        <div style={{ margin: " 0 5px", fontWeight: "bold" }}>HP</div>
        <div
          style={{
            width: "100%",
            height: "20px",
            backgroundColor: "gray",
            borderRadius: "10px",
            position: "relative",
            margin: "0",
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
      <h4 style={{ marginRight: "5px" }}>{`${currentHP} / ${maxHP}`}</h4>
    </div>
  );
};
