import { Select } from "@mui/material";

export default function CustomSelect({ value, onChange, children, ...props }) {
  return (
    <Select
      size="small"
      value={value}
      onChange={onChange}
      sx={{
        backgroundColor: "white",
        minWidth: 150,
        borderRadius: "8px",
      }}
      {...props}
    >
      {children}
    </Select>
  );
}
