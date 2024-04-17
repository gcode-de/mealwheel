import { Select } from "./Styled/Styled";
export default function DietSelector({ dietTypes, onChange, defaultValue }) {
  return (
    <Select
      onChange={(e) => {
        onChange(e.target.value);
      }}
      defaultValue={defaultValue}
    >
      <option value="null">alle Rezepte</option>
      {dietTypes?.map((dietType) => (
        <option value={dietType?.value} key={dietType?.value}>
          {dietType?.label}
        </option>
      ))}
    </Select>
  );
}
