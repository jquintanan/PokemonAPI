import { useEffect, useState } from "react";
import { PokemonAllData } from "../api/data";
import { useSelector, useDispatch } from "react-redux";
import { selecPlayerData } from "../state/playerDataSlice";

import { log } from "../PokemonAppLogger";

import { EventGenerator, GameEvent } from "../api/eventGenerator";

interface PokemonGameExploreScreenProps {
  pokemonData: PokemonAllData[];
}

export const PokemonGameExploreScreen: React.FC<PokemonGameExploreScreenProps> = ({
  pokemonData,
}) => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const dispatch = useDispatch();
  const playerData = useSelector(selecPlayerData);
  const eventGenerator = new EventGenerator(dispatch);

  useEffect(() => {
    log("explore_screen");
    setEvents([
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
      eventGenerator.generateRandomEvent(),
    ]);
  }, []);
  console.log("Rendering PokemonGameView-ExploreScreen");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}
    >
      <h2>Explore</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexFlow: "space-between",
        }}
      >
        {events.map((event, index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "10px",
                padding: "10px",
                borderWidth: 1,
                borderColor: "white",
                borderStyle: "solid",
              }}
              key={index}
            >
              <h3>{event.name}</h3>
              <img src={event.image_url} width="100px" height="100px" />
              <p>{event.description}</p>
              <button
                onClick={() => {
                  event.eventFunction(playerData);
                  setEvents([
                    ...events.slice(0, index),
                    eventGenerator.generateRandomEvent(),
                    ...events.slice(index + 1),
                  ]);
                }}
              >
                {event.actionName}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
