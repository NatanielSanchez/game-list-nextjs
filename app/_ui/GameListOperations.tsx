import { getGenres } from "../_lib/apiGenres";
import { getPlatforms } from "../_lib/apiPlatforms";
import { getThemes } from "../_lib/apiThemes";
import InputFilter from "./InputFilter";
import MultiSelectFilter, { MultiSelectOption } from "./MultiSelectFilter";
import Operations from "./Operations";
import SingleSelectFilter, { SingleSelectOption } from "./SingleSelectFilter";

async function GameListOperations() {
  const [platforms, genres, themes] = await Promise.all([getPlatforms(), getGenres(), getThemes()]);

  const platformOptions = platforms?.map((platform) => {
    return {
      value: platform.id.toString(),
      label: platform.name,
      shortLabel: platform.abbreviation,
    } as MultiSelectOption;
  });
  const genreOptions = genres?.map((genre) => {
    return {
      value: genre.id.toString(),
      label: genre.name,
    } as MultiSelectOption;
  });
  const themeOptions = themes?.map((theme) => {
    return {
      value: theme.id.toString(),
      label: theme.name,
    } as MultiSelectOption;
  });

  const sortOptions: SingleSelectOption[] = [
    { label: "Sort by rating count (desc)", value: "total_rating_count desc" },
    { label: "Sort by rating count (asc)", value: "total_rating_count asc" },
    { label: "Sort by name (A-Z)", value: "name desc" },
    { label: "Sort by name (Z-A)", value: "name asc" },
    { label: "Sort by newest", value: "first_release_date desc" },
    { label: "Sort by oldest", value: "first_release_date asc" },
  ];

  return (
    <Operations>
      <InputFilter fieldName="name" />

      <MultiSelectFilter
        fieldName="platforms"
        isSearchable={true}
        placeholder="Search platforms"
        options={platformOptions}
      />
      <MultiSelectFilter fieldName="genres" isSearchable={true} placeholder="Search genres" options={genreOptions} />
      <MultiSelectFilter fieldName="themes" isSearchable={true} placeholder="Search themes" options={themeOptions} />
      <SingleSelectFilter fieldName="sort" isSearchable={false} options={sortOptions} />
    </Operations>
  );
}

export default GameListOperations;
