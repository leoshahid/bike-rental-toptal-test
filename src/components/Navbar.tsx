import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useAppState } from "../appContext";

const ResponsiveAppBar = (props: any) => {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const role = localStorage.getItem("role");
  const { pages } = props;
  const [state, dispatch]: any = useAppState();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#fff",
        boxShadow: "0 2px 12px 0 rgba(60,72,88,0.10)",
        mx: 0,
        mt: 0,
        px: 2,
        borderRadius: 0,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar
          disableGutters
          sx={{ minHeight: 64, px: 0, justifyContent: "space-between" }}
        >
          {/* Left: Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 220 }}>
            <TwoWheelerIcon sx={{ fontSize: 36, color: "#1976d2", mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 800,
                letterSpacing: ".2rem",
                color: "#1976d2",
                textDecoration: "none",
                textShadow: "none",
              }}
            >
              Bike Rental
            </Typography>
          </Box>

          {/* Center: Nav Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 1,
              ml: 4,
            }}
          >
            {pages.map((page: any) => (
              <Button
                key={page.title}
                onClick={() => navigate(page.route)}
                sx={{
                  my: 2,
                  color: "#1976d2",
                  display: "block",
                  fontWeight: 600,
                  fontSize: 16,
                  px: 2,
                  borderRadius: 2,
                  transition: "background 0.2s, color 0.2s",
                  "&:hover": {
                    background: "#e3f0ff",
                    color: "#1565c0",
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Right: Welcome and Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 4 }}>
            <Typography
              component="span"
              sx={{
                color: "#1976d2",
                fontWeight: 500,
                fontSize: 15,
                letterSpacing: 0.5,
                background: "rgba(25,118,210,0.07)",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                mr: 1,
              }}
            >
              {`Welcome ${role}, ${user.email}`}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                ml: 1,
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                borderColor: "#1976d2",
                color: "#1976d2",
                background: "white",
                "&:hover": {
                  background: "#e3f0ff",
                  borderColor: "#1565c0",
                  color: "#1565c0",
                },
              }}
              onClick={async () => {
                await logOut();
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
