import { PokemonAllData, PokemonStats } from "./api";

interface PokemonInstanceData {
  data: PokemonAllData;
  isShiny: boolean;
  level: number;
  exp: number;
  current_hp: number;
  stats: PokemonStats;
  ivs: PokemonStats;
}

export default class PokemonInstance implements PokemonInstanceData {
  id: number = 0;
  data: PokemonAllData;
  isShiny: boolean;
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

  constructor(data: PokemonAllData, is_shiny?: boolean, level?: number) {
    this.id = this.gemerateID();
    this.data = data;
    this.isShiny = is_shiny ?? Math.random() < 0.1;
    this.ivs = this.generateIVs();

    this.setLevel(level ?? 1);
  }

  gemerateID(): number {
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

  getExperienceYieldWhenDefeated(): number {
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
    console.log("Resetting HP");
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
    this.stats = PokemonInstance.getStatsFromPokemonDataAndLevelAndIVs(
      this.data,
      this.level,
      this.ivs
    );
    this.current_hp = this.stats.hp;
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

  static getStatsFromPokemonDataAndLevelAndIVs(
    pokemon: PokemonAllData,
    level: number,
    ivs: PokemonStats
  ): PokemonStats {
    const base_stats = pokemon.base_stats;
    const hp = Math.floor(
      ((2 * base_stats.hp + ivs.hp) * level) / 100 + level + 10
    );

    const calculateStat = (
      base_stat: number,
      iv: number,
      level: number
    ): number => {
      return Math.floor(((2 * base_stats.attack + iv) * level) / 100 + 5);
    };
    const attack = calculateStat(base_stats.attack, ivs.attack, level);
    const defense = calculateStat(base_stats.defense, ivs.defense, level);
    const special_attack = calculateStat(
      base_stats.special_attack,
      ivs.special_attack,
      level
    );
    const special_defense = calculateStat(
      base_stats.special_defense,
      ivs.special_defense,
      level
    );
    const speed = calculateStat(base_stats.speed, ivs.speed, level);

    return {
      hp: hp,
      attack: attack,
      defense: defense,
      special_attack: special_attack,
      special_defense: special_defense,
      speed: speed,
    };
  }
}
