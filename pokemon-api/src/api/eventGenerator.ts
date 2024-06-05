import { PlayerDataState } from "../state/playerDataSlice";
import { useDispatch } from "react-redux";
import { increaseMoney, addItem } from "../state/playerDataSlice";
import { ItemData, ALL_ITEMS_DATA } from "../api/data";

import { Item } from "firebase/analytics";
import { ALL_POKEMON_ALL_DATA } from "../api/data";

enum GameEventCategory {
  ITEM = "item",
  POKEMON = "pokemon",
}

interface GameEventCategoryData {
  type: GameEventCategory;
  name: string;
  description: string;
  image_url: string;
  actionName: string;
}

const GameEventCategories: Record<GameEventCategory, GameEventCategoryData> = {
  item: {
    type: GameEventCategory.ITEM,
    name: "Item",
    description: "You found an item",
    image_url: "",
    actionName: "Pick up",
  },
  pokemon: {
    type: GameEventCategory.POKEMON,
    name: "Wild Pokemon",
    description: "A wild pokemon appeared",
    image_url: "",
    actionName: "Battle",
  },
};

export interface GameEvent {
  event_type: GameEventCategoryData;
  name: string;
  description: string;
  image_url: string;
  eventFunction: (playerData: PlayerDataState) => void;
}

export class EventGenerator {
  dispatch: any;
  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  generateEvent(type: GameEventCategory): GameEvent {
    if (type === GameEventCategory.ITEM) {
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
      event_type: GameEventCategories.item,
      name: "Item",
      description: itemData.name,
      image_url: itemData.image,
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
      event_type: GameEventCategories.pokemon,
      name: "Wild Pokemon",
      description: pokemonData.name,
      image_url: pokemonData.pokemon_data.sprites.front_default,
      eventFunction: (playerData: PlayerDataState) => {
        // Initialize battle with wild pokemon
      },
    };
  }
}
