import React from "react";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  sx?: object;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: 320,
        borderRadius: 4,
        background: "#f5f7fa",
        boxShadow: "0 4px 12px 0 rgba(60,72,88,0.10)",
        border: "2px solid #90caf9",
        px: 2,
        py: 0.5,
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "#1976d2",
        },
        "&:focus-within": {
          borderColor: "#1976d2",
          boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.18)",
        },
        ...sx,
      }}
    >
      <InputAdornment position="start" sx={{ pl: 0, pr: 1 }}>
        <SearchIcon sx={{ color: "#1976d2", fontSize: 22 }} />
      </InputAdornment>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 16,
          flex: 1,
          height: 36,
          padding: 0,
          color: "#222",
        }}
        aria-label={placeholder}
      />
    </Box>
  );
};

export default SearchInput;
