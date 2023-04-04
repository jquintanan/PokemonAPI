import { useEffect, useState } from "react";
import { PokemonData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";

interface PokemonGameBattleScreenProps {
  pokemonData: PokemonData[];
  minStats: { [key: string]: number };
  maxStats: { [key: string]: number };
  selectedPokemon: PokemonData[];
}

export const PokemonGameBattleScreen: React.FC<
  PokemonGameBattleScreenProps
> = ({ pokemonData, minStats, maxStats, selectedPokemon }) => {
  console.log("Rendering PokemonGame-BattleScreen");

  const [battleLog, setBattleLog] = useState<
    { time: string; message: string }[]
  >([]);
  const [opponentPokemon, setOpponentPokemon] = useState<{
    data: PokemonData;
    isShiny: boolean;
  }>({ data: pokemonData[0], isShiny: false });
  const [playerHP, setPlayerHP] = useState<number>(0);
  const [opponentHP, setOpponentHP] = useState<number>(0);

  //select a random pokemon for the opponent
  function getRandomPokemon(): { data: PokemonData; isShiny: boolean } {
    return {
      data: pokemonData[Math.floor(Math.random() * (pokemonData.length - 1))],
      isShiny: Math.random() < 0.2,
    };
  }

  function getMessageObject(message: string) {
    return { time: new Date().toLocaleTimeString(), message: message };
  }

  function initializeBattleLog() {
    setBattleLog([
      getMessageObject("Battle Started!"),
      getMessageObject("Select a move to attack the opponent"),
    ]);
  }

  //Assign a random pokemon to the opponent using the getTandomPokemon function
  useEffect(() => {
    setOpponentPokemon(getRandomPokemon());
  }, []);

  //Initialize battle log
  useEffect(() => {
    initializeBattleLog();
  }, []);

  var pokemon_selected_for_battle = (
    <div>
      <div style={{ display: "flex" }}>
        <div
          className="playerSide"
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Your Pokemon</h3>
          {selectedPokemon.map((pokemon) => {
            //show the selected pokemon
            return (
              <PokemonFighter
                pokemonData={selectedPokemon[0]}
                minStats={minStats}
                maxStats={maxStats}
                fighterMode="battle"
              />
            );
          })}
        </div>
        <div
          className="opponentSide"
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Opponent Pokemon</h3>

          <PokemonFighter
            pokemonData={opponentPokemon.data}
            minStats={minStats}
            maxStats={maxStats}
            fighterMode="battle"
            isShiny={opponentPokemon.isShiny}
          />
          <button
            onClick={() => {
              initializeBattleLog();
              setOpponentPokemon(getRandomPokemon());
            }}
            style={{ width: "50%" }}
          >
            Randomize Opponent
          </button>
        </div>
      </div>
    </div>
  );

  const current_player_pokemon = selectedPokemon[0];
  const current_opponent_pokemon = opponentPokemon.data;

  // Initialize player and opponent HP based on selected and opponent pokemon stats
  useEffect(() => {
    setPlayerHP(current_player_pokemon.stats[0].base_stat);
    setOpponentHP(current_opponent_pokemon.stats[0].base_stat);
  }, [selectedPokemon, opponentPokemon]);

  const current_hp = (
    <div className="section" style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ width: "50%", textAlign: "center", padding: "0px 40px" }}>
        <h3>HP</h3>
        <h4>
          {playerHP} /{" "}
          {current_player_pokemon
            ? current_player_pokemon.stats[0].base_stat
            : 0}
        </h4>
        <div
          style={{
            width: "100%",
            height: "20px",
            backgroundColor: "gray",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${Math.round(
                (playerHP / current_player_pokemon.stats[0].base_stat) * 100
              )}%`,
              height: "100%",
              backgroundColor: "green",
              borderRadius: "10px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        </div>
      </div>

      <div style={{ width: "50%", textAlign: "center", padding: "0px 40px" }}>
        <h3>HP</h3>
        <h4>
          {opponentHP} /{" "}
          {current_opponent_pokemon
            ? current_opponent_pokemon.stats[0].base_stat
            : 0}
        </h4>
        <div
          style={{
            width: "100%",
            height: "20px",
            backgroundColor: "gray",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${Math.round(
                (opponentHP / current_opponent_pokemon.stats[0].base_stat) * 100
              )}%`,
              height: "100%",
              backgroundColor: "green",
              borderRadius: "10px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  type AttackType = "attack" | "special_attack";
  //function to attack the opponent and redice their hp
  function attackOpponent(
    attacker: PokemonData,
    defender: PokemonData,
    type: AttackType
  ) {
    const attackerStat =
      type === "attack"
        ? attacker.stats[1].base_stat
        : attacker.stats[3].base_stat;
    const defenderStat =
      type === "attack"
        ? attacker.stats[2].base_stat
        : attacker.stats[4].base_stat;
    const basePower = 40; // use a fixed base power if the move doesn't have one

    const modifier = Math.random() * (1.0 - 0.85) + 0.85; // random modifier between 0.85 and 1.0
    const damage = Math.floor(
      basePower * (attackerStat / defenderStat) * modifier
    );

    console.log(opponentHP);

    if (opponentHP < 1) {
      const messages = [
        `${current_opponent_pokemon.name} is already on the ground, give them a break!`,
        `Looks like ${current_opponent_pokemon.name} is already defeated. Spare them the extra pain!`,
        `It's over for ${current_opponent_pokemon.name}. Don't you have better things to do than attack a fainted pokemon?`,
        `You did it! You beat a fainted ${current_opponent_pokemon.name}. How proud you must be...`,
        `${current_opponent_pokemon.name} is down and out. There's no need to kick them while they're down!`,
        `Congratulations! You beat a pokemon that was already defeated. How impressive...`,
        `It's not exactly a fair fight when you attack a fainted ${current_opponent_pokemon.name}, is it?`,
        `No need to keep attacking a fainted ${current_opponent_pokemon.name}. You've already won!`,
        `We get it, you're strong. But did you really have to attack a fainted ${current_opponent_pokemon.name}?`,
        `You beat a fainted ${current_opponent_pokemon.name}. How thrilling!`,
        `${current_opponent_pokemon.name} is already defeated. Time to move on to bigger challenges!`,
        `Did you really have to attack a pokemon that was already down, ${current_player_pokemon.name}?`,
        `Congratulations, you won a battle against a fainted ${current_opponent_pokemon.name}. You must be so proud!`,
        `The battle is already won, ${current_player_pokemon.name}. No need to attack a fainted pokemon!`,
        `${current_opponent_pokemon.name} is already down for the count. Why not try battling a conscious opponent next time?`,
        `We know you're strong, ${current_player_pokemon.name}, but did you really have to attack a fainted ${current_opponent_pokemon.name}?`,
        `You beat a fainted pokemon. What an achievement, ${current_player_pokemon.name}!`,
        `Great job, ${current_player_pokemon.name}. You beat a pokemon that was already defeated. How impressive!`,
        `The battle is already won, ${current_player_pokemon.name}. You don't need to attack a fainted pokemon!`,
        `${current_opponent_pokemon.name} is already out of the game. You win!`,
      ];

      const randomIndex = Math.floor(Math.random() * messages.length);
      const message = messages[randomIndex];

      setBattleLog([...battleLog, getMessageObject(message)]);

      return;
    }

    if (opponentHP - damage < 1) {
      setOpponentHP(0);
      setBattleLog([
        ...battleLog,
        getMessageObject(
          current_player_pokemon.name +
            " attacked " +
            current_opponent_pokemon.name +
            " for " +
            damage +
            " damage!"
        ),
        getMessageObject(current_opponent_pokemon.name + " has fainted!"),
        getMessageObject("You won the battle!"),
      ]);
      return;
    }

    setOpponentHP(opponentHP - damage);
    setBattleLog([
      ...battleLog,
      getMessageObject(
        current_player_pokemon.name +
          " attacked " +
          current_opponent_pokemon.name +
          " for " +
          damage +
          " damage!"
      ),
    ]);
  }

  const player_actions = (
    <div className="section">
      <h3>Your Actions</h3>
      <button
        onClick={() =>
          attackOpponent(
            current_player_pokemon,
            current_opponent_pokemon,
            "attack"
          )
        }
      >
        Attack
      </button>
      <button
        onClick={() =>
          attackOpponent(
            current_player_pokemon,
            current_opponent_pokemon,
            "special_attack"
          )
        }
      >
        Special Attack
      </button>
    </div>
  );

  const battle_log = (
    <div className="section">
      <h3>Battle log</h3>
      {battleLog
        .slice()
        .reverse()
        .map((log, index) => {
          return <p>{log.time + " : " + log.message}</p>;
        })}
    </div>
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}
    >
      <h2>Battle</h2>
      {pokemon_selected_for_battle}
      {current_hp}
      {player_actions}
      {battle_log}
    </div>
  );
};
