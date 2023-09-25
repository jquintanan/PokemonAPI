import { InventoryItem } from "../components/InventoryItem.react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
//import from profileInfoSlice, add item, and remove item
import { increaseMoney, addItem, removeItem } from "../state/playerDataSlice";
import { useDispatch } from "react-redux";
import { ItemData, ALL_ITEMS_DATA } from "../api";

interface MarketPageProps {}

export const MarketPage: React.FC<MarketPageProps> = ({}) => {
  const profileInfo = useSelector((state: RootState) => state.playerData);
  const all_items = useSelector(
    (state: RootState) => state.allItemData.allItemData
  );
  const user_items = useSelector(
    (state: RootState) => state.playerData.ownedItems
  );
  const dispatch = useDispatch();

  const buyItem = (item: ItemData, amount: number) => {
    if (profileInfo.money >= item.cost) {
      dispatch(increaseMoney(-item.cost));
      dispatch(addItem({ item, amount }));
    }
  };

  const sellItem = (item: ItemData, amount: number) => {
    dispatch(increaseMoney(item.cost));
    dispatch(removeItem({ item, amount }));
  };

  console.log("Rendering Market Page");
  const current_items = (
    <div className="section">
      <h3>My Items</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {user_items.map(({ item, amount }) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
              }}
            >
              <InventoryItem
                item={item}
                quantity={amount}
                inStore={true}
                key={"item " + item.id}
              />
              <button onClick={() => sellItem(item, 1)}>Sell</button>
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
        {ALL_ITEMS_DATA.filter((i) => i.cost > 0).map((item) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
              }}
            >
              <InventoryItem
                item={item}
                inStore={true}
                key={"item " + item.id}
              />
              <button onClick={() => buyItem(item, 1)}>Buy</button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <h2>Market</h2>
      <div>
        <h3>Current Money</h3>
        <div>${profileInfo.money}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {current_items}
        {shop}
      </div>
    </div>
  );
};
