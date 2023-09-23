import { PokemonAllData } from "../api";

interface InventoryItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    image: string;
    cost: number;
  };
  quantity?: number;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  quantity,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
        width: "100px",
      }}
      key={"item " + item.id}
    >
      <div>
        <img src={item.image} alt={item.name} />
      </div>
      <div>{item.name.replace("-", " ")}</div>
      <div>${quantity ? item.cost / 2 : item.cost}</div>
      {quantity && <div>x{quantity}</div>}
    </div>
  );
};
