import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppState } from "../appContext";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";

const gradient = "linear-gradient(135deg, #1976d2 0%, #6a11cb 100%)";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { logIn } = useUserAuth();
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");
  const [state, dispatch]: any = useAppState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: "EMPTY_STATE" });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await logIn(email, password);
      const docRef = doc(usersCollectionRef, email.toLowerCase());
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? docSnap.data() : null;
      if (!(data === null || data === undefined)) {
        if (data.isDeleted) {
          setError("User does not exist anymore");
          setLoading(false);
          return;
        }
        dispatch({
          type: "SET_PROP",
          payload: { key: "currentUser", value: data },
        });
        localStorage.setItem("role", data.isManager ? "manager" : "user");
        navigate(data.isManager ? "/admin" : "/user");
        setLoading(false);
      } else {
        setLoading(false);
        setError("Error: email not found");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Side */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          background: gradient,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Abstract shapes */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 40,
              bgcolor: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              top: 80,
              left: 60,
              transform: "rotate(-20deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 120,
              height: 30,
              bgcolor: "rgba(255,255,255,0.10)",
              borderRadius: 16,
              top: 200,
              left: 180,
              transform: "rotate(10deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 100,
              height: 24,
              bgcolor: "rgba(255,255,255,0.18)",
              borderRadius: 12,
              bottom: 120,
              left: 100,
              transform: "rotate(-12deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 140,
              height: 32,
              bgcolor: "rgba(255,255,255,0.12)",
              borderRadius: 16,
              bottom: 60,
              left: 220,
              transform: "rotate(8deg)",
            }}
          />
        </Box>
        {/* Welcome Text */}
        <Box sx={{ zIndex: 2, color: "white", px: 8, width: "100%" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}
          >
            Welcome to Bike Rental
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
          >
            Rent your favorite bike and start your journey with us. Fast, easy,
            and reliable.
          </Typography>
        </Box>
      </Grid>
      {/* Right Side */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6fa",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            width: "100%",
            maxWidth: 380,
            boxShadow: "0 8px 32px rgba(60, 72, 88, 0.12)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              mb: 2,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            USER LOGIN
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "#bdbdbd" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, bgcolor: "#f3f6fb", borderRadius: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#bdbdbd" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, bgcolor: "#f3f6fb", borderRadius: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{ color: "#1976d2" }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 14, color: "#888" }}>
                    Remember
                  </Typography>
                }
                sx={{ ml: 0 }}
              />
              <Typography
                component={Link}
                to="#"
                sx={{
                  fontSize: 14,
                  color: "#888",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#1976d2" },
                }}
              >
                Forgot password?
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.2,
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 3,
                background: "linear-gradient(90deg, #1976d2 0%, #6a11cb 100%)",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
                mb: 2,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1565c0 0%, #5e35b1 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "LOGIN"
              )}
            </Button>
            <Typography
              sx={{ textAlign: "center", fontSize: 15, color: "#888" }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#1976d2",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
