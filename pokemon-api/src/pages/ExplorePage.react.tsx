import { PokemonGameExploreScreen } from "../components/PokemonGameExploreScreen.react";

interface ExplorePageProps {}

export const ExplorePage: React.FC<ExplorePageProps> = ({}) => {
  const exploreComponent = <PokemonGameExploreScreen pokemonData={[]} />;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}
    >
      <h2>Explore</h2>
      {exploreComponent}
    </div>
  );
};
