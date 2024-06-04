import { PlayerDataState } from "../state/playerDataSlice";
import { useDispatch } from "react-redux";
import { increaseMoney, addItem } from "../state/playerDataSlice";
import { ItemData, ALL_ITEMS_DATA } from "../api/data";

import { Item } from "firebase/analytics";
import { ALL_POKEMON_ALL_DATA } from "../api/data";

export interface GameEvent {
  type: "item" | "pokemon";
  name: string;
  description: string;
  image_url: string;
  actionName: string;
  eventFunction: (playerData: PlayerDataState) => void;
}

export class EventGenerator {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  generateEvent(type: "item" | "pokemon"): GameEvent {
    if (type === "item") {
      return this.generateItemEvent();
    } else {
      return this.generatePokemonEvent();
    }
  }

  generateRandomEvent(): GameEvent {
    const randomEvent = Math.random();
    if (randomEvent < 0.5) {
      return this.generateItemEvent();
    } else {
      return this.generatePokemonEvent();
    }
  }

  generateItemEvent(): GameEvent {
    const availableItems = ALL_ITEMS_DATA;
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const itemData = availableItems[randomIndex];
    return {
      type: "item",
      name: "Item",
      description: `You found a ${itemData.name}`,
      image_url: itemData.image,
      actionName: "Pick up",
      eventFunction: (playerData: PlayerDataState) => {
        // Add potion to player's inventory
        //playerData.ownedItems.push({ item: potion, amount: 1 });
        this.dispatch(addItem({ item: itemData, amount: 1 }));
      },
    };
  }

  generatePokemonEvent(): GameEvent {
    const availablePokemon = ALL_POKEMON_ALL_DATA;
    const randomIndex = Math.floor(Math.random() * availablePokemon.length);
    const pokemonData = availablePokemon[randomIndex];

    return {
      type: "pokemon",
      name: "Wild Pokemon",
      description: `A wild ${pokemonData.name} appeared!`,
      image_url: pokemonData.pokemon_data.sprites.front_default,
      actionName: "Catch",
      eventFunction: (playerData: PlayerDataState) => {
        // Initialize battle with wild pokemon
      },
    };
  }
}
