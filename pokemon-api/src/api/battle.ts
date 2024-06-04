import PokemonInstance from "../PokemonInstance.class";

interface PokemonBattleState {
  user: PokemonInstance;
  enemy: PokemonInstance;
}

//Declare enum for actions
enum UserActionType {
  ATTACK = "attack",
  SPECIAL_ATTACK = "special_attack",
  RUN = "run",
}

enum EnemyActionType {
  ATTACK = "attack",
  SPECIAL_ATTACK = "special_attack",
  RUN = "run",
}

type AttackType = "attack" | "special_attack";

export default class PokemonBattle implements PokemonBattleState {
  user: PokemonInstance;
  enemy: PokemonInstance;

  constructor(user: PokemonInstance, enemy: PokemonInstance) {
    this.user = user;
    this.enemy = enemy;
  }

  processTurn(action: UserActionType) {
    const enemyAction = this.chooseEnemyAction();
    const enemy_speed = this.enemy.stats.speed;

    const userAction = action;
    const user_speed = this.user.stats.speed;

    if (userAction == UserActionType.RUN) {
      //User runs away
      //Ignore enemy action
      //End battle
      //Get new wild pokemon?
      console.log("User ran away");
      return;
    }

    if (enemyAction == EnemyActionType.RUN) {
      //Enemy runs away
      //Ignore user action
      //End battle
      //Get new wild pokemon?
      console.log("Enemy ran away");
      return;
    }

    if (user_speed > enemy_speed) {
      //Execute user action first
      this.processUserAction(userAction);
      //Execute enemy action second
      this.processEnemyAction(enemyAction);
    } else if (user_speed < enemy_speed) {
      //Execute enemy action first
      this.processEnemyAction(enemyAction);
      //Execute user action second
      this.processUserAction(userAction);
    } else {
      //If speed is equal, randomly choose who goes first
      const random_number = Math.random();
      if (random_number < 0.5) {
        //Execute user action first
        this.processUserAction(userAction);
        //Execute enemy action second
        this.processEnemyAction(enemyAction);
      } else {
        //Execute enemy action first
        this.processEnemyAction(enemyAction);
        //Execute user action second
        this.processUserAction(userAction);
      }
    }
  }

  processUserAction(action: UserActionType) {
    switch (action) {
      case UserActionType.ATTACK:
        console.log("User attacked");
        break;
      case UserActionType.SPECIAL_ATTACK:
        console.log("User special attacked");
        break;
      case UserActionType.RUN:
        console.log("User ran away");
        break;
    }
  }

  chooseEnemyAction(): EnemyActionType {
    //Adjust percentages to change enemy behavior
    //Change percentage when enemy pokemon is low on health?

    //Change behavior if enemy is wild pokemon
    //Change behavior if enemy is trainer

    const full_health_behaviors: [EnemyActionType, number][] = [
      [EnemyActionType.ATTACK, 0.45],
      [EnemyActionType.SPECIAL_ATTACK, 0.45],
      [EnemyActionType.RUN, 0.1],
    ];

    const low_health_behaviors: [EnemyActionType, number][] = [
      [EnemyActionType.ATTACK, 0.5],
      [EnemyActionType.SPECIAL_ATTACK, 0.5],
      [EnemyActionType.RUN, 0.0],
    ];

    const enemy_health_percentage = this.enemy.current_hp / this.enemy.stats.hp;
    const random_number = Math.random();

    // Decide the behavior set based on enemy's health
    const behavior =
      enemy_health_percentage > 0.5
        ? full_health_behaviors
        : low_health_behaviors;

    let accumulated = 0;

    // Loop through behaviors and check against random number
    let chosen_action: EnemyActionType | null = null;
    for (const [action, percentage] of behavior) {
      accumulated += percentage;
      if (random_number < accumulated) {
        chosen_action = action;
        break;
      }
    }

    // Default action in case something goes wrong (shouldn't happen with correct percentages)
    if (!chosen_action) {
      chosen_action = EnemyActionType.ATTACK;
    }

    // Return the chosen action
    return chosen_action;
  }

  processEnemyAction(action: EnemyActionType) {
    switch (action) {
      case EnemyActionType.ATTACK:
        console.log("Enemy attacked");
        break;
      case EnemyActionType.SPECIAL_ATTACK:
        console.log("Enemy special attacked");
        break;
      case EnemyActionType.RUN:
        console.log("Enemy escaped");
        break;
    }
  }

  static calculateBaseDamage(
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

  static calculateOpponentAction(
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
}
