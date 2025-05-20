import { Box, Grid, Paper, Typography } from "@mui/material";
import { Users } from "../components/Users/Users";
import { Bikes } from "../components/Bikes/Bikes";
import { useAppState } from "../appContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_HEIGHT = 260;

const Admin = () => {
  const [state]: any = useAppState();
  // Compute stats
  const users = state.allUsers?.filter((u: any) => !u.isDeleted) || [];
  const bikes = state.allBikes?.filter((b: any) => !b.isDeleted) || [];
  const managers = users.filter((u: any) => u.isManager);
  const avgRating = bikes.length
    ? (
        bikes.reduce(
          (sum: number, b: any) => sum + (Number(b.rating) || 0),
          0
        ) / bikes.length
      ).toFixed(2)
    : "-";

  // Pie chart data for users by role
  const userRolePieData = {
    labels: ["Managers", "Users"],
    datasets: [
      {
        data: [managers.length, users.length - managers.length],
        backgroundColor: ["#1976d2", "#6a11cb"],
        borderWidth: 1,
      },
    ],
  };

  const userRolePieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Users by Role" },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box
      sx={{
        px: { xs: 1, md: 6 },
        py: { xs: 1, md: 6 },
        background: "#f7fafd",
        minHeight: "100vh",
      }}
    >
      {/* Welcome Banner */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, #1976d2 0%, #6a11cb 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome to the Admin Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Manage users, bikes, and view analytics at a glance.
        </Typography>
      </Paper>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: "linear-gradient(135deg, #f8fbff 0%, #e3f0ff 100%)",
            }}
          >
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: 700 }}>
              {users.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: "linear-gradient(135deg, #fffbe7 0%, #fceabb 100%)",
            }}
          >
            <Typography variant="h6">Total Bikes</Typography>
            <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: 700 }}>
              {bikes.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: "linear-gradient(135deg, #f8fffa 0%, #e0f7fa 100%)",
            }}
          >
            <Typography variant="h6">Avg. Bike Rating</Typography>
            <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: 700 }}>
              {avgRating}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              background: "linear-gradient(135deg, #f7f0ff 0%, #e0c3fc 100%)",
            }}
          >
            <Typography variant="h6">Managers</Typography>
            <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: 700 }}>
              {managers.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              height: CHART_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pie
              data={userRolePieData}
              options={userRolePieOptions}
              width={180}
              height={180}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Bikes showChart chartHeight={CHART_HEIGHT} />
        </Grid>
      </Grid>
      {/* Tables Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Users />
        </Grid>
        <Grid item xs={12} md={6}>
          <Bikes />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin;
