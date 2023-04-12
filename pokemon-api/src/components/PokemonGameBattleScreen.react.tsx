import { useEffect, useState } from "react";
import { PokemonAllData } from "../api";
import { PokemonFighter } from "./PokemonFighter.react";
import { calculateTypeMultiplier } from "./PokemonType.react";
import { log } from "../PokemonAppLogger";

interface PokemonGameBattleScreenProps {
  pokemonData: PokemonAllData[];
  minStats: { [key: string]: number };
  maxStats: { [key: string]: number };
  selectedPokemon: PokemonAllData[];
}

interface BattleLogEntry {
  time: string;
  message: string;
}

const ALL_POKEMON_LEVEL = 100;

export const PokemonGameBattleScreen: React.FC<
  PokemonGameBattleScreenProps
> = ({ pokemonData, minStats, maxStats, selectedPokemon }) => {
  useEffect(() => {
    log("battle_screen");
  }, []);
  console.log("Rendering PokemonGame-BattleScreen");

  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [opponentPokemon, setOpponentPokemon] = useState<{
    data: PokemonAllData;
    isShiny: boolean;
  }>({ data: pokemonData[0], isShiny: false });
  const [playerHP, setPlayerHP] = useState<number>(0);
  const [opponentHP, setOpponentHP] = useState<number>(0);
  const [killStreak, setKillStreak] = useState<number>(0);
  const [shinyKillStreak, setShinyKillStreak] = useState<number>(0);
  const [skips, setSkips] = useState<number>(0);
  const [deathCount, setDeathCount] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);

  //select a random pokemon for the opponent
  function getRandomPokemon(): { data: PokemonAllData; isShiny: boolean } {
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
      <h4>Wins 🏆: {killStreak}</h4>
      <h4>Shiny 💎: {shinyKillStreak}</h4>
      <h4>Loses ☠️: {deathCount}</h4>
      <h4>Skips ⏩: {skips}</h4>
    </div>
  );

  const current_player_pokemon = selectedPokemon[0];
  const current_opponent_pokemon = opponentPokemon.data;
  // Initialize player and opponent HP based on selected and opponent pokemon stats
  useEffect(() => {
    setPlayerHP(current_player_pokemon.pokemon_data.stats[0].base_stat);
    setOpponentHP(current_opponent_pokemon.pokemon_data.stats[0].base_stat);
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
            maxHP={current_player_pokemon.pokemon_data.stats[0].base_stat}
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
            maxHP={current_opponent_pokemon.pokemon_data.stats[0].base_stat}
          />
        </div>
        <button
          onClick={() => {
            log("click_next_opponent");
            if (opponentHP > 0 && playerHP > 0) {
              setSkips(skips + 1);
            }

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

  function processTurn(
    user: PokemonAllData,
    opponent: PokemonAllData,
    user_attack_type: AttackType
  ) {
    const new_battle_log = [...battleLog];

    if (playerHP <= 0) {
      new_battle_log.push(getMessageObject("You are dead!"));
      setBattleLog(new_battle_log);
      return;
    }

    if (opponentHP <= 0) {
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

    //Check which pokemon is faster
    const user_speed = user.pokemon_data.stats[5].base_stat;
    const opponent_speed = opponent.pokemon_data.stats[5].base_stat;

    //If the attacker is faster, attack first
    if (user_speed > opponent_speed) {
      //Calculate damage
      const { isOpponentFainted } = processUserTurn(
        user,
        opponent,
        user_attack_type,
        new_battle_log
      );
      if (isOpponentFainted) {
        new_battle_log.push(
          getMessageObject(`You defeated ${current_opponent_pokemon.name}!`)
        );
        setBattleLog(new_battle_log);
        return;
      }
      processOpponentTurn(user, opponent, new_battle_log);
    } else {
      //Calculate damage
      const { isUserFainted } = processOpponentTurn(
        user,
        opponent,
        new_battle_log
      );
      if (isUserFainted) {
        new_battle_log.push(
          getMessageObject(
            `${current_player_pokemon.name} has fainted! You lost the battle!`
          )
        );
        setBattleLog(new_battle_log);
        return;
      }
      processUserTurn(user, opponent, user_attack_type, new_battle_log);
    }

    setBattleLog(new_battle_log);
    return;
  }

  function processUserTurn(
    user: PokemonAllData,
    opponent: PokemonAllData,
    user_attack_type: AttackType,
    new_battle_log: BattleLogEntry[]
  ): { isOpponentFainted: boolean } {
    new_battle_log.push(
      user_attack_type === "attack"
        ? getMessageObject(`${current_player_pokemon.name} used an attack!`)
        : getMessageObject(
            `${current_player_pokemon.name} used a special attack!`
          )
    );
    //Calculate user action
    const user_base_damage = calculateBaseDamage(
      user,
      opponent,
      user_attack_type,
      ALL_POKEMON_LEVEL
    );
    const user_random_modifier = Math.random() * (1.0 - 0.85) + 0.85; // random modifier between 0.85 and 1.0
    const user_type_multiplier = calculateTypeMultiplier(user, opponent); // calculate the type multiplier
    const damage = Math.floor(
      user_base_damage * user_random_modifier * user_type_multiplier
    );

    var damage_text =
      user.name + " attacked " + opponent.name + " for " + damage + " damage!";

    if (user_type_multiplier > 1) {
      damage_text += " It's super effective!!!";
      //add an scared emoji to the text
      damage_text += " 😱";
    } else if (user_type_multiplier < 1) {
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

      return { isOpponentFainted: true };
    } else {
      setOpponentHP(opponentHP - damage);
      return { isOpponentFainted: false };
    }
  }

  function processOpponentTurn(
    user: PokemonAllData,
    opponent: PokemonAllData,
    new_battle_log: BattleLogEntry[]
  ): { isUserFainted: boolean } {
    //Get opponent action
    const opponent_action = calculateOpponentAction(opponent, user);
    const opponent_base_damage = calculateBaseDamage(
      opponent,
      user,
      opponent_action,
      ALL_POKEMON_LEVEL
    );
    const opponent_random_modifier = Math.random() * (1.0 - 0.85) + 0.85; // random modifier between 0.85 and 1.0
    const opponent_type_multiplier = calculateTypeMultiplier(opponent, user); // calculate the type multiplier
    const damage = Math.floor(
      opponent_base_damage * opponent_random_modifier * opponent_type_multiplier
    );

    var damage_text =
      opponent.name + " attacked " + user.name + " for " + damage + " damage!";

    if (opponent_type_multiplier > 1) {
      damage_text += " It's super effective!!!";
      //add an scared emoji to the text
      damage_text += " 😱";
    } else if (opponent_type_multiplier < 1) {
      damage_text += " It's not very effective...";
      //add an emoji to the text
      damage_text += " 😐";
    }

    new_battle_log.push(getMessageObject(damage_text));

    if (playerHP - damage < 1) {
      setPlayerHP(0);
      setDeathCount(deathCount + 1);
      return { isUserFainted: true };
    } else {
      setPlayerHP(playerHP - damage);
      return { isUserFainted: false };
    }
  }

  function calculateOpponentAction(
    opponentData: PokemonAllData,
    defenderData: PokemonAllData
  ): AttackType {
    //Check if opponent attack or special attack
    const opponent_attack = opponentData.pokemon_data.stats[1].base_stat;
    const opponent_special_attack =
      opponentData.pokemon_data.stats[3].base_stat;

    const defender_defense = defenderData.pokemon_data.stats[2].base_stat;
    const defender_special_defense =
      defenderData.pokemon_data.stats[4].base_stat;

    const attackType: AttackType =
      opponent_attack / defender_defense >
      opponent_special_attack / defender_special_defense
        ? "attack"
        : "special_attack";

    return attackType;
  }

  function calculateBaseDamage(
    attackerData: PokemonAllData,
    defenderData: PokemonAllData,
    attackType: AttackType,
    attackerLevel: number
  ): number {
    //calculate damage using the input parameters
    const attacker_attack = attackerData.pokemon_data.stats[1].base_stat;
    const attacker_special_attack =
      attackerData.pokemon_data.stats[3].base_stat;

    const defender_defense = defenderData.pokemon_data.stats[2].base_stat;
    const defender_special_defense =
      defenderData.pokemon_data.stats[4].base_stat;

    const attack =
      attackType === "attack" ? attacker_attack : attacker_special_attack;
    const defense =
      attackType === "attack" ? defender_defense : defender_special_defense;

    const move_power = attack; //for now, the move power is the same as the attack

    const damage = Math.floor(
      (((2.0 * attackerLevel) / 5.0 + 2) * move_power * (attack / defense)) /
        50.0 +
        2
    );

    return damage;
  }

  type AttackType = "attack" | "special_attack";

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
          onClick={() => {
            log("click_attack");
            processTurn(
              current_player_pokemon,
              current_opponent_pokemon,
              "attack"
            );
          }}
          style={{ width: "40%", maxWidth: "300px" }}
        >
          Attack
        </button>
        <button
          onClick={() => {
            log("click_special_attack");
            processTurn(
              current_player_pokemon,
              current_opponent_pokemon,
              "special_attack"
            );
          }}
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
