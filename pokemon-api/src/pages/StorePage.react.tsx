import { useEffect, useState } from "react";
import { ItemData, PokemonAllData, fetchItems } from "../api";
import { PokemonFighter } from "../components/PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { get } from "http";

interface MarketPageProps {
  selectedPokemon: PokemonAllData[];
}

export const MarketPage: React.FC<MarketPageProps> = ({ selectedPokemon }) => {
  const [items, setItems] = useState<ItemData[]>([]);
  useEffect(() => {
    log("player_profile_screen");
    fetchItems().then((items) => {
      setItems(items);
    });
  }, []);

  console.log("Rendering Market Page");
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

  const shop = (
    <div className="section">
      <h3>Shop</h3>
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
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <h2>Market</h2>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {current_items}
        {shop}
      </div>
    </div>
  );
};
