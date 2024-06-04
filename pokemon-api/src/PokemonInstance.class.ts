import { PokemonAllData, PokemonStats, ALL_POKEMON_ALL_DATA } from "./api/data";

export interface PokemonInstanceData {
  id: number;
  data: PokemonAllData;
  isShiny: boolean;
  isWild: boolean;
  level: number;
  exp: number;
  current_hp: number;
  stats: PokemonStats;
  ivs: PokemonStats;
  evs: PokemonStats;
  fullyTrainedAchieved: boolean;
}

export default class PokemonInstance implements PokemonInstanceData {
  id: number = 0;
  data: PokemonAllData;
  isShiny: boolean;
  isWild: boolean = true;
  level: number = 1;
  exp: number = 0;
  current_hp: number = 1;
  stats: PokemonStats = {
    hp: 1,
    attack: 1,
    defense: 1,
    special_attack: 1,
    special_defense: 1,
    speed: 1,
  };
  ivs: PokemonStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0,
  };
  evs: PokemonStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0,
  };
  fullyTrainedAchieved: boolean = false;

  constructor(data: PokemonAllData, is_shiny?: boolean, level?: number) {
    this.id = this.gemerateID();
    this.data = data;
    this.isShiny = is_shiny ?? Math.random() < 0.1;
    this.ivs = this.generateIVs();

    this.setLevel(level ?? 1);
  }

  private gemerateID(): number {
    return parseInt(
      Math.ceil(Math.random() * Date.now())
        .toPrecision(16)
        .toString()
        .replace(".", "")
    );
  }

  generateIVs(): PokemonStats {
    return {
      hp: Math.floor(Math.random() * 32),
      attack: Math.floor(Math.random() * 32),
      defense: Math.floor(Math.random() * 32),
      special_attack: Math.floor(Math.random() * 32),
      special_defense: Math.floor(Math.random() * 32),
      speed: Math.floor(Math.random() * 32),
    };
  }

  private getExperienceYieldWhenDefeated(): number {
    return Math.floor(
      (this.data.pokemon_data.base_experience * this.level) / 7
    );
  }

  getTotalExp(): number {
    return this.exp;
  }

  private static getExpNeededForLevel(level: number): number {
    return level ** 3;
  }

  getTotalExpNeededForNextLevel(): number {
    return PokemonInstance.getExpNeededForLevel(this.level + 1);
  }

  getCurrentLevelExp(): number {
    return this.exp - PokemonInstance.getExpNeededForLevel(this.level);
  }

  getCurrentLevelExpGoal(): number {
    return (
      PokemonInstance.getExpNeededForLevel(this.level + 1) -
      PokemonInstance.getExpNeededForLevel(this.level)
    );
  }

  resetHp(): PokemonInstance {
    this.current_hp = this.stats.hp;
    return this;
  }

  faint(): PokemonInstance {
    this.current_hp = 0;
    return this;
  }

  takeDamage(damage: number): PokemonInstance {
    this.current_hp -= damage;
    if (this.current_hp <= 0) {
      this.faint();
    }
    return this;
  }

  private setLevel(level: number): void {
    this.level = level;
    this.setExperience(level ** 3);
    this.resetHp();
  }

  private setExperience(total_exp: number): void {
    this.exp = total_exp;

    //Calculate level up from exp gained
    const new_level = Math.floor(total_exp ** (1 / 3));
    this.level = new_level > this.level ? new_level : this.level;
    this.updateStats();
    this.current_hp = this.stats.hp;
  }

  private updateStats(): void {
    this.stats = PokemonInstance.getStatsFromPokemonDataAndLevelAndIVsAndEVs(
      this.data,
      this.level,
      this.ivs,
      this.evs
    );
  }

  increaseExp(exp: number): void {
    this.exp += exp;
    if (this.exp >= (this.level + 1) ** 3) {
      this.setExperience(this.exp);
      this.resetHp();
    }
  }

  levelUp(): void {
    this.setLevel(this.level + 1);
  }

  private static getStatsFromPokemonDataAndLevelAndIVsAndEVs(
    pokemon: PokemonAllData,
    level: number,
    ivs: PokemonStats,
    evs: PokemonStats
  ): PokemonStats {
    const base_stats = pokemon.base_stats;
    const hp = Math.floor(
      ((2 * base_stats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100 +
        level +
        10
    );

    const calculateStat = (
      base_stat: number,
      iv: number,
      ev: number,
      level: number
    ): number => {
      return Math.floor(
        ((2 * base_stat + iv + Math.floor(ev / 4)) * level) / 100 + 5
      );
    };

    const attack = calculateStat(
      base_stats.attack,
      ivs.attack,
      evs.attack,
      level
    );
    const defense = calculateStat(
      base_stats.defense,
      ivs.defense,
      evs.defense,
      level
    );
    const special_attack = calculateStat(
      base_stats.special_attack,
      ivs.special_attack,
      evs.special_attack,
      level
    );
    const special_defense = calculateStat(
      base_stats.special_defense,
      ivs.special_defense,
      evs.special_defense,
      level
    );
    const speed = calculateStat(base_stats.speed, ivs.speed, evs.speed, level);

    return {
      hp: hp,
      attack: attack,
      defense: defense,
      special_attack: special_attack,
      special_defense: special_defense,
      speed: speed,
    };
  }

  defeatedPokemon(defeated_pokemon: PokemonInstance): void {
    const exp_gained = defeated_pokemon.getExperienceYieldWhenDefeated();
    const ev_gains = defeated_pokemon.data.evs;
    this.addEVs(ev_gains);

    this.increaseExp(exp_gained);
  }

  private addEVs(evs: PokemonStats): void {
    const MAX_TOTAL_EVS = 510;
    const MAX_INDIVIDUAL_EVS = 252;

    //check if total evs is over 510
    const currentTotalEVs =
      this.evs.hp +
      this.evs.attack +
      this.evs.defense +
      this.evs.special_attack +
      this.evs.special_defense +
      this.evs.speed;

    const addedTotalEVs =
      evs.hp +
      evs.attack +
      evs.defense +
      evs.special_attack +
      evs.special_defense +
      evs.speed;

    if (currentTotalEVs + addedTotalEVs > MAX_TOTAL_EVS) {
      //If total evs is over 510, don't add any evs
      //Let user find another pokemon to defeat with the remaining evs
      return;
    }

    //Increase individual evs only until MAX_INDIVIDUAL_EVS
    this.evs.hp = Math.min(this.evs.hp + evs.hp, MAX_INDIVIDUAL_EVS);
    this.evs.attack = Math.min(
      this.evs.attack + evs.attack,
      MAX_INDIVIDUAL_EVS
    );
    this.evs.defense = Math.min(
      this.evs.defense + evs.defense,
      MAX_INDIVIDUAL_EVS
    );
    this.evs.special_attack = Math.min(
      this.evs.special_attack + evs.special_attack,
      MAX_INDIVIDUAL_EVS
    );
    this.evs.special_defense = Math.min(
      this.evs.special_defense + evs.special_defense,
      MAX_INDIVIDUAL_EVS
    );
    this.evs.speed = Math.min(this.evs.speed + evs.speed, MAX_INDIVIDUAL_EVS);

    //Trigger update on stats
    this.updateStats();
  }

  toPokemonInstanceData(): PokemonInstanceData {
    return {
      id: this.id,
      data: this.data,
      isShiny: this.isShiny,
      isWild: this.isWild,
      level: this.level,
      exp: this.exp,
      current_hp: this.current_hp,
      stats: this.stats,
      ivs: this.ivs,
      evs: this.evs,
      fullyTrainedAchieved: this.fullyTrainedAchieved,
    };
  }

  static fromPokemonInstanceData(data: PokemonInstanceData): PokemonInstance {
    const pokemon = new PokemonInstance(data.data, data.isShiny, data.level);
    pokemon.id = data.id;
    pokemon.isWild = data.isWild;
    pokemon.exp = data.exp;
    pokemon.current_hp = data.current_hp;
    pokemon.stats = data.stats;
    pokemon.ivs = data.ivs;
    pokemon.evs = data.evs;
    pokemon.fullyTrainedAchieved = data.fullyTrainedAchieved;
    return pokemon;
  }
}
