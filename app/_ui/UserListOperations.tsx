import Filter from "./Filter";
import InputFilter from "./InputFilter";
import Operations from "./Operations";

const UserGameStateFilters = [
  { label: "All", value: "All" },
  { label: "Plan to play", value: "Plan to play" },
  { label: "Completed", value: "Completed" },
  { label: "Dropped", value: "Dropped" },
];

function UserListOperations() {
  return (
    <Operations>
      <InputFilter fieldName="name" />
      <Filter filterField="state" options={UserGameStateFilters} />
    </Operations>
  );
}

export default UserListOperations;
