import { PokemonAllData } from "./api";

interface PokemonInstanceData {
  data: PokemonAllData;
  isShiny: boolean;
  level: number;
  exp: number;
  current_hp: number;
  stats: {
    max_hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
}

export default class PokemonInstance implements PokemonInstanceData {
  id: number = 0;
  data: PokemonAllData;
  isShiny: boolean;
  level: number = 1;
  exp: number = 0;
  current_hp: number = 1;
  stats: {
    max_hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  } = {
    max_hp: 1,
    attack: 1,
    defense: 1,
    special_attack: 1,
    special_defense: 1,
    speed: 1,
  };

  constructor(data: PokemonAllData, is_shiny?: boolean, level?: number) {
    this.id = this.gemerateID();
    this.data = data;
    this.isShiny = is_shiny ?? Math.random() < 0.1;
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

  getExperienceGivenWhenDefeated(): number {
    return (this.data.pokemon_data.base_experience * this.level) / 7;
  }

  getCurrentLevelExp(): number {
    return this.exp - (this.level ^ 3);
  }

  getExperienceNeededToLevelUp(): number {
    return ((this.level + 1) ^ 3) - this.exp;
  }

  resetHp(): PokemonInstance {
    console.log("Resetting HP");
    this.current_hp = this.stats.max_hp;
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
    this.stats = PokemonInstance.getStatsFromPokemonDataAndLevel(
      this.data,
      this.level
    );
    this.current_hp = this.stats.max_hp;
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

  static getStatsFromPokemonDataAndLevel(
    pokemon: PokemonAllData,
    level: number
  ): {
    max_hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  } {
    //level = 5;
    const base_hp = Math.floor(
      pokemon.pokemon_data.stats[0].base_stat * (level / 100) + level + 10
    );
    const attack = Math.floor(
      pokemon.pokemon_data.stats[1].base_stat * 2 * (level / 100) + 5
    );
    const defense = Math.floor(
      pokemon.pokemon_data.stats[2].base_stat * 2 * (level / 100) + 5
    );
    const special_attack = Math.floor(
      pokemon.pokemon_data.stats[3].base_stat * 2 * (level / 100) + 5
    );
    const special_defense = Math.floor(
      pokemon.pokemon_data.stats[4].base_stat * 2 * (level / 100) + 5
    );
    const speed = Math.floor(
      pokemon.pokemon_data.stats[5].base_stat * 2 * (level / 100) + 5
    );

    return {
      max_hp: base_hp,
      attack: attack,
      defense: defense,
      special_attack: special_attack,
      special_defense: special_defense,
      speed: speed,
    };
  }
}
