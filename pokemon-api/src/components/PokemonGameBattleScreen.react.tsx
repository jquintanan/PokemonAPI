import { useEffect, useState } from "react";
import { PokemonData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";
import { PokemonHPBar } from "./PokemonHPBar.react";
import { calculateTypeMultiplier } from "./PokemonType.react";

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
  const [killStreak, setKillStreak] = useState<number>(0);
  const [shinyKillStreak, setShinyKillStreak] = useState<number>(0);

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
    setBattleLog([getMessageObject("Battle Started!")]);
  }

  useEffect(() => {
    //Assign a random pokemon to the opponent using the getTandomPokemon function
    // eslint-disable-next-line
    setOpponentPokemon(getRandomPokemon());
    //Initialize battle log
    // eslint-disable-next-line
    initializeBattleLog();
    // eslint-disable-next-line
  }, []);

  const kill_streak_counter_component = (
    <div>
      <h3>Pokemon Defeated: {killStreak}</h3>
      <h4>Shiny 💎: {shinyKillStreak}</h4>
    </div>
  );

  const current_player_pokemon = selectedPokemon[0];
  const current_opponent_pokemon = opponentPokemon.data;
  // Initialize player and opponent HP based on selected and opponent pokemon stats
  useEffect(() => {
    setPlayerHP(current_player_pokemon.stats[0].base_stat);
    setOpponentHP(current_opponent_pokemon.stats[0].base_stat);
    // eslint-disable-next-line
  }, [selectedPokemon, opponentPokemon]);

  const player_side_style: React.CSSProperties = {
    width: "50%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  var pokemon_selected_for_battle = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <div
        className="playerSide"
        style={{ ...player_side_style, marginRight: "5px" }}
      >
        <h3>You</h3>

        <div className="section">
          <PokemonFighter
            pokemonData={selectedPokemon[0]}
            minStats={minStats}
            maxStats={maxStats}
            fighterMode="battle"
            currentHP={playerHP}
            maxHP={current_player_pokemon.stats[0].base_stat}
          />
        </div>
      </div>
      <div
        className="opponentSide"
        style={{ ...player_side_style, marginLeft: "5px" }}
      >
        <h3>Opponent</h3>
        <div className="section">
          <PokemonFighter
            pokemonData={opponentPokemon.data}
            minStats={minStats}
            maxStats={maxStats}
            fighterMode="battle"
            isShiny={opponentPokemon.isShiny}
            currentHP={opponentHP}
            maxHP={current_opponent_pokemon.stats[0].base_stat}
          />
        </div>
        <button
          onClick={() => {
            initializeBattleLog();
            setOpponentPokemon(getRandomPokemon());
          }}
          style={{ width: "50%", margin: "10px" }}
        >
          Next
        </button>
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
    const new_battle_log = [...battleLog];

    new_battle_log.push(
      type === "attack"
        ? getMessageObject(`${current_player_pokemon.name} used an attack!`)
        : getMessageObject(
            `${current_player_pokemon.name} used a special attack!`
          )
    );

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

      new_battle_log.push(getMessageObject(message));

      setBattleLog(new_battle_log);

      return;
    }

    const attackerStat =
      type === "attack"
        ? attacker.stats[1].base_stat
        : attacker.stats[3].base_stat;
    const defenderStat =
      type === "attack"
        ? attacker.stats[2].base_stat
        : attacker.stats[4].base_stat;
    const basePower = 40; // use a fixed base power if the move doesn't have one

    const random_modifier = Math.random() * (1.0 - 0.85) + 0.85; // random modifier between 0.85 and 1.0
    const type_multiplier = calculateTypeMultiplier(attacker, defender); // calculate the type multiplier

    const damage = Math.floor(
      basePower *
        (attackerStat / defenderStat) *
        random_modifier *
        type_multiplier
    );

    var damage_text =
      current_player_pokemon.name +
      " attacked " +
      current_opponent_pokemon.name +
      " for " +
      damage +
      " damage!";

    if (type_multiplier > 1) {
      damage_text += " It's super effective!!!";
      //add an scared emoji to the text
      damage_text += " 😱";
    } else if (type_multiplier < 1) {
      damage_text += " It's not very effective...";
      //add an emoji to the text
      damage_text += " 😐";
    }

    new_battle_log.push(getMessageObject(damage_text));

    if (opponentHP - damage < 1) {
      setOpponentHP(0);

      if (opponentPokemon.isShiny) {
        setShinyKillStreak(shinyKillStreak + 1);
      }
      setKillStreak(killStreak + 1);
      new_battle_log.push(
        getMessageObject(current_opponent_pokemon.name + " has fainted!")
      );
      new_battle_log.push(getMessageObject("You won the battle!"));
    } else {
      setOpponentHP(opponentHP - damage);
    }

    setBattleLog(new_battle_log);
    return;
  }

  const player_actions = (
    <div className="section">
      <h3 style={{ textAlign: "center" }}>Your Actions</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() =>
            attackOpponent(
              current_player_pokemon,
              current_opponent_pokemon,
              "attack"
            )
          }
          style={{ width: "40%", maxWidth: "300px" }}
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
          style={{ width: "40%", maxWidth: "300px" }}
        >
          Special Attack
        </button>
      </div>
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
      {kill_streak_counter_component}
      {pokemon_selected_for_battle}
      {player_actions}
      {battle_log}
    </div>
  );
};
