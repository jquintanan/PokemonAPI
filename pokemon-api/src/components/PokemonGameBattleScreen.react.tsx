import { useEffect, useState } from "react";
import { PokemonAllData } from "../api/data";
import { PokemonFighter } from "./PokemonFighter.react";
import { calculateTypeMultiplier } from "./PokemonType.react";
import { log } from "../PokemonAppLogger";
import PokemonInstance from "../PokemonInstance.class";
import { useDispatch, useSelector } from "react-redux";
import {
  selecPlayerData,
  setSelectedPokemon,
  increaseMoney,
  defeatedPokemon,
} from "../state/playerDataSlice";

interface PokemonGameBattleScreenProps {
  pokemonData: PokemonAllData[];
}

interface BattleLogEntry {
  time: string;
  message: string;
}

const ALL_POKEMON_LEVEL = 5;

export const PokemonGameBattleScreen: React.FC<PokemonGameBattleScreenProps> = ({
  pokemonData,
}) => {
  const dispatch = useDispatch();
  const playerData = useSelector(selecPlayerData);
  const selectedPokemon = playerData.selectedPokemon;
  const playerItems = playerData.ownedItems;

  useEffect(() => {
    log("battle_screen");
  }, []);
  console.log("Rendering PokemonGame-BattleScreen");

  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [
    opponentInstance,
    setOpponentInstance,
  ] = useState<PokemonInstance | null>();

  const [killStreak, setKillStreak] = useState<number>(0);
  const [shinyKillStreak, setShinyKillStreak] = useState<number>(0);
  const [skips, setSkips] = useState<number>(0);
  const [deathCount, setDeathCount] = useState<number>(0);

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
    const new_opponent = getRandomPokemon();
    // eslint-disable-next-line
    setOpponentInstance(
      new PokemonInstance(
        new_opponent.data,
        new_opponent.isShiny,
        ALL_POKEMON_LEVEL
      )
    );
    //Initialize battle log
    // eslint-disable-next-line
    initializeBattleLog();
    // eslint-disable-next-line
  }, []);

  if (!selectedPokemon) {
    return <div>You don't have any pokemon yet!</div>;
  }

  if (!opponentInstance) {
    return <div>Loading...</div>;
  }

  const playerInstance: PokemonInstance = selectedPokemon;

  const kill_streak_counter_component = (
    <div>
      <h4>Wins 🏆: {killStreak}</h4>
      <h4>Shiny 💎: {shinyKillStreak}</h4>
      <h4>Loses ☠️: {deathCount}</h4>
      <h4>Skips ⏩: {skips}</h4>
    </div>
  );

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
            fighterMode="battle"
            pokemon_instance={playerInstance}
            showHPBar={true}
            showLevel={true}
            showExp={true}
            showType={true}
            showEVs={true}
            showCurrentStats={true}
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
            fighterMode="battle"
            pokemon_instance={opponentInstance}
            showHPBar={true}
            showLevel={true}
            showType={true}
          />
        </div>
        <button
          onClick={() => {
            log("click_next_opponent");
            if (
              opponentInstance.current_hp > 0 &&
              playerInstance.current_hp > 0
            ) {
              setSkips(skips + 1);
            }

            if (playerInstance.current_hp <= 0) {
              console.log("resetting hp for fainted pokemon");
              dispatch(setSelectedPokemon(playerInstance.resetHp()));
            }

            initializeBattleLog();
            setOpponentInstance(
              new PokemonInstance(
                getRandomPokemon().data,
                false,
                ALL_POKEMON_LEVEL
              )
            );
          }}
          style={{ width: "50%", margin: "10px" }}
        >
          {playerInstance.current_hp > 0 ? "Next" : "Revive + Next"}
        </button>
      </div>
    </div>
  );

  function processTurn(
    user: PokemonInstance,
    opponent: PokemonInstance,
    user_attack_type: AttackType
  ) {
    if (!user || !opponent) {
      return;
    }

    const new_battle_log = [...battleLog];

    if (playerInstance.current_hp <= 0) {
      new_battle_log.push(getMessageObject("You are dead!"));
      setBattleLog(new_battle_log);
      return;
    }

    if (opponent.current_hp <= 0) {
      const messages = [
        `${opponent.data.name} is already on the ground, give them a break!`,
        `Looks like ${opponent.data.name} is already defeated. Spare them the extra pain!`,
        `It's over for ${opponent.data.name}. Don't you have better things to do than attack a fainted pokemon?`,
        `You did it! You beat a fainted ${opponent.data.name}. How proud you must be...`,
        `${opponent.data.name} is down and out. There's no need to kick them while they're down!`,
        `Congratulations! You beat a pokemon that was already defeated. How impressive...`,
        `It's not exactly a fair fight when you attack a fainted ${opponent.data.name}, is it?`,
        `No need to keep attacking a fainted ${opponent.data.name}. You've already won!`,
        `We get it, you're strong. But did you really have to attack a fainted ${opponent.data.name}?`,
        `You beat a fainted ${opponent.data.name}. How thrilling!`,
        `${opponent.data.name} is already defeated. Time to move on to bigger challenges!`,
        `Did you really have to attack a pokemon that was already down, ${user.data.name}?`,
        `Congratulations, you won a battle against a fainted ${opponent.data.name}. You must be so proud!`,
        `The battle is already won, ${user.data.name}. No need to attack a fainted pokemon!`,
        `${opponent.data.name} is already down for the count. Why not try battling a conscious opponent next time?`,
        `We know you're strong, ${user.data.name}, but did you really have to attack a fainted ${opponent.data.name}?`,
        `You beat a fainted pokemon. What an achievement, ${user.data.name}!`,
        `Great job, ${user.data.name}. You beat a pokemon that was already defeated. How impressive!`,
        `The battle is already won, ${user.data.name}. You don't need to attack a fainted pokemon!`,
        `${opponent.data.name} is already out of the game. You win!`,
      ];

      const randomIndex = Math.floor(Math.random() * messages.length);
      const message = messages[randomIndex];

      new_battle_log.push(getMessageObject(message));

      setBattleLog(new_battle_log);

      return;
    }

    //Check which pokemon is faster
    const user_speed = user.stats.speed;
    const opponent_speed = opponent.stats.speed;

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
          getMessageObject(`You defeated ${opponent.data.name}!`)
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
            `${playerInstance.data.name} has fainted! You lost the battle!`
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
    user: PokemonInstance,
    opponent: PokemonInstance,
    user_attack_type: AttackType,
    new_battle_log: BattleLogEntry[]
  ): { isOpponentFainted: boolean } {
    new_battle_log.push(
      user_attack_type === "attack"
        ? getMessageObject(`${playerInstance.data.name} used an attack!`)
        : getMessageObject(`${playerInstance.data.name} used a special attack!`)
    );
    //Calculate user action
    const user_base_damage = calculateBaseDamage(
      user,
      opponent,
      user_attack_type
    );
    const user_random_modifier = Math.random() * (1.0 - 0.85) + 0.85; // random modifier between 0.85 and 1.0
    const user_type_multiplier = calculateTypeMultiplier(
      user.data,
      opponent.data
    ); // calculate the type multiplier
    const damage = Math.floor(
      user_base_damage * user_random_modifier * user_type_multiplier
    );

    var damage_text =
      user.data.name +
      " attacked " +
      opponent.data.name +
      " for " +
      damage +
      " damage!";

    if (user_type_multiplier > 1) {
      damage_text += " It's super effective!!!";
      //add an scared emoji to the text
      damage_text += " 😱";
    } else if (user_type_multiplier < 1) {
      damage_text +=
        " It's not very effective...(" + user_type_multiplier + ")";
      //add an emoji to the text
      damage_text += " 😐";
    }

    new_battle_log.push(getMessageObject(damage_text));

    if (opponent.current_hp - damage < 1) {
      setOpponentInstance(opponent.faint());

      //Add money to player
      dispatch(increaseMoney(100));

      dispatch(
        defeatedPokemon({ user_pokemon: user, enemy_pokemon: opponent })
      );

      if (opponent.isShiny) {
        setShinyKillStreak(shinyKillStreak + 1);
      }
      setKillStreak(killStreak + 1);

      return { isOpponentFainted: true };
    } else {
      //setOpponentHP(opponentHP - damage);
      setOpponentInstance(opponent.takeDamage(damage));
      return { isOpponentFainted: false };
    }
  }

  function processOpponentTurn(
    user: PokemonInstance,
    opponent: PokemonInstance,
    new_battle_log: BattleLogEntry[]
  ): { isUserFainted: boolean } {
    //Get opponent action
    const opponent_action = calculateOpponentAction(opponent, user);
    const opponent_base_damage = calculateBaseDamage(
      opponent,
      user,
      opponent_action
    );
    const opponent_random_modifier = Math.random() * (1.0 - 0.85) + 0.85; // random modifier between 0.85 and 1.0
    const opponent_type_multiplier = calculateTypeMultiplier(
      opponent.data,
      user.data
    ); // calculate the type multiplier
    const damage = Math.floor(
      opponent_base_damage * opponent_random_modifier * opponent_type_multiplier
    );

    var damage_text =
      opponent.data.name +
      " attacked " +
      user.data.name +
      " for " +
      damage +
      " damage!";

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

    if (user.current_hp - damage < 1) {
      dispatch(setSelectedPokemon(user.faint()));
      //setPlayerHP(0);
      setDeathCount(deathCount + 1);
      return { isUserFainted: true };
    } else {
      //setPlayerHP(playerHP - damage);
      dispatch(setSelectedPokemon(user.takeDamage(damage)));
      return { isUserFainted: false };
    }
  }

  function calculateOpponentAction(
    opponentData: PokemonInstance,
    defenderData: PokemonInstance
  ): AttackType {
    //Check if opponent attack or special attack
    const opponent_attack = opponentData.stats.attack;
    const opponent_special_attack = opponentData.stats.special_attack;

    const defender_defense = defenderData.stats.defense;
    const defender_special_defense = defenderData.stats.special_defense;

    const attackType: AttackType =
      opponent_attack / defender_defense >
      opponent_special_attack / defender_special_defense
        ? "attack"
        : "special_attack";

    return attackType;
  }

  function calculateBaseDamage(
    attackerData: PokemonInstance,
    defenderData: PokemonInstance,
    attackType: AttackType
  ): number {
    //calculate damage using the input parameters
    const attacker_attack = attackerData.stats.attack;
    const attacker_special_attack = attackerData.stats.special_attack;

    const defender_defense = defenderData.stats.defense;
    const defender_special_defense = defenderData.stats.special_defense;

    const attack =
      attackType === "attack" ? attacker_attack : attacker_special_attack;
    const defense =
      attackType === "attack" ? defender_defense : defender_special_defense;

    const move_power = attack; //for now, the move power is the same as the attack

    const damage = Math.floor(
      (((2.0 * attackerData.level) / 5.0 + 2) *
        move_power *
        (attack / defense)) /
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
            processTurn(playerInstance, opponentInstance, "attack");
          }}
          style={{ width: "40%", maxWidth: "300px" }}
          disabled={playerInstance.current_hp < 1}
        >
          Attack
        </button>
        <button
          onClick={() => {
            log("click_special_attack");
            processTurn(playerInstance, opponentInstance, "special_attack");
          }}
          style={{ width: "40%", maxWidth: "300px" }}
          disabled={playerInstance.current_hp < 1}
        >
          Special Attack
        </button>
        <button style={{ width: "40%", maxWidth: "300px" }} disabled={true}>
          Special Attack 2?
        </button>
      </div>
    </div>
  );

  const items_section = (
    <div className="section">
      <h3 style={{ textAlign: "center" }}>Items</h3>
      {playerItems.length < 0 ? (
        <div>You don't have any items yet!</div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {playerItems.map((item) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={item.item.image} alt={item.item.name} />
              <div>{item.item.name}</div>
            </div>
          ))}
        </div>
      )}
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
      {items_section}
      {battle_log}
    </div>
  );
};
