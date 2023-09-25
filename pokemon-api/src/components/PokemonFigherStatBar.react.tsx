interface PokemonFighterStatBarProps {
  name: string;
  base: number;
  min: number;
  max: number;
}

export const PokemonFighterStatBar: React.FC<PokemonFighterStatBarProps> = ({
  name,
  base,
  min,
  max,
}): JSX.Element => {
  // Calculate the percentage of the maximum stat value
  const getStatPercentage = (): number => {
    return Math.round(((base - min + 1) / (max - min + 1)) * 100);
  };

  // Generate a style object for the stat bar based on its percentage value
  const getStatBarStyle = () => {
    const percentage = getStatPercentage();
    let color: string;
    if (percentage < 10) {
      color = "#DDD"; // gray
    } else if (percentage < 30) {
      color = "#FEA"; // light yellow
    } else if (percentage < 50) {
      color = "#FFA500"; // yellow
    } else if (percentage < 80) {
      color = "#FFA500"; // orange
    } else if (percentage < 90) {
      color = "#F11"; // red
    } else {
      color = "#8B0000"; // dark red
    }
    return {
      width: `${percentage}%`,
      backgroundColor: color,
    };
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "0",
        margin: "0",
      }}
      key={name}
    >
      <div
        style={{
          width: "45%",
          textAlign: "right",
          margin: "0",
          padding: "0",
          paddingRight: "5px",
          minWidth: "115px",
        }}
      >
        {name}
      </div>
      <div
        style={{
          width: "30px",
          minWidth: "30px",
          textAlign: "right",
          margin: "0",
          padding: "0",
        }}
      >
        {base}
      </div>
      <div
        style={{
          width: "45%",
          margin: "0",
          padding: "0",
          paddingLeft: "10px",
        }}
      >
        <div className="stat-bar" style={getStatBarStyle()}></div>
      </div>
    </div>
  );
};
