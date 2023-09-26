const RESELL_DISCOUT_FACTOR = 0.5;

interface InventoryItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    image: string;
    cost: number;
  };
  quantity?: number;
  inStore?: boolean;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  inStore = false,
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
        textTransform: "capitalize",
      }}
      key={"item " + item.id}
    >
      <div>
        <img src={item.image} alt={item.name} />
      </div>
      <div>{item.name.replace("-", " ")}</div>
      {inStore && (
        <div>${item.cost * (quantity ? RESELL_DISCOUT_FACTOR : 1)}</div>
      )}
      {quantity && <div>x{quantity}</div>}
    </div>
  );
};
