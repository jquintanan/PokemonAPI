import { useEffect, useState } from "react";
import { ItemData, PokemonAllData, fetchItems } from "../api";
import { PokemonFighter } from "../components/PokemonFighter.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { get } from "http";
import { InventoryItem } from "../components/InventoryItem.react";

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
            <InventoryItem
              item={item}
              quantity={Math.floor(9 * Math.random() + 1)}
              inStore={true}
              key={"item " + item.id}
            />
          );
        })}
      </div>
    </div>
  );

  const shop = (
    <div className="section">
      <h3>Shop</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items
          .filter((i) => i.cost > 0)
          .map((item) => {
            return (
              <InventoryItem
                item={item}
                inStore={true}
                key={"item " + item.id}
              />
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
