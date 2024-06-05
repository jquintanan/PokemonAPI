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
  const [pokemonEvents, setPokemonEvents] = useState<GameEvent[]>([]);
  const [itemEvents, setItemEvents] = useState<GameEvent[]>([]);
  const dispatch = useDispatch();
  const playerData = useSelector(selecPlayerData);
  const eventGenerator = new EventGenerator(dispatch);

  const resetEvents = () => {
    setPokemonEvents([
      eventGenerator.generatePokemonEvent(),
      eventGenerator.generatePokemonEvent(),
      eventGenerator.generatePokemonEvent(),
      eventGenerator.generateItemEvent(),
      eventGenerator.generateItemEvent(),
      eventGenerator.generateItemEvent(),
    ]);
  };

  useEffect(() => {
    log("explore_screen");
    resetEvents();
  }, []);
  console.log("Rendering PokemonGameView-ExploreScreen");

  const eventSelection = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexFlow: "space-between",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {pokemonEvents.map((event, index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px",
                padding: "10px",
                borderWidth: 1,
                borderColor: "white",
                borderStyle: "solid",
                borderRadius: 10,
                width: 200,
                height: 300,
              }}
              key={index}
            >
              <h3>{event.name}</h3>
              <p>{event.event_type.description}</p>
              <img src={event.image_url} />
              <p>{event.description}</p>

              <button
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  color: "white",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "white",
                  backgroundColor: "transparent",
                }}
                onClick={() => {
                  event.eventFunction(playerData);
                  setPokemonEvents([
                    ...pokemonEvents.slice(0, index),
                    eventGenerator.generateRandomEvent(),
                    ...pokemonEvents.slice(index + 1),
                  ]);
                }}
              >
                {event.event_type.actionName}
              </button>
            </div>
          );
        })}
      </div>

      <button
        style={{
          padding: "5px",
          borderRadius: "5px",
          color: "white",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "white",
          backgroundColor: "transparent",
          width: "10%",
        }}
        onClick={() => {
          resetEvents();
        }}
      >
        Reroll
      </button>
    </div>
  );

  const navigation = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        margin: "20px",
        alignItems: "center",
      }}
    >
      <h3>Navigation</h3>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <button
          style={{
            padding: "5px",
            borderRadius: "5px",
            color: "white",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "white",
            backgroundColor: "transparent",
            width: "100%",
            cursor: "not-allowed",
          }}
          disabled={true}
          onClick={() => {
            resetEvents();
          }}
        >
          Go Deeper
        </button>
      </div>
      <button
        style={{
          padding: "5px",
          borderRadius: "5px",
          color: "red",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "red",
          backgroundColor: "transparent",
          cursor: "not-allowed",
        }}
        disabled={true}
      >
        Go back to town
      </button>
    </div>
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}
    >
      <h2>Explore</h2>
      {eventSelection}
      {navigation}
    </div>
  );
};
