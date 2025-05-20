import React, { useEffect, useState, useRef } from "react";
import { useAppState } from "../../appContext";
import { db } from "../../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { DataTable } from "../DataGrid";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AlertDialog from "../AlertDialog";
import AddNewBike from "./AddNewBike";
import BikeDetails from "./Bike Details";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PaletteIcon from "@mui/icons-material/Palette";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { useDebounce } from "../../utils";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { getDatasetAtEvent } from "react-chartjs-2";
import SearchInput from "../common/SearchInput";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Pagination from "@mui/material/Pagination";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const Actions = (props: any) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const [state, dispatch]: any = useAppState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const onDetailsClick = () => {
    setShowDetails(true);
  };
  const onDeleteClick = () => {
    setOpenDialog(true);
  };
  const deleteBike = () => {
    setOpenDialog(false);
    setLoading(true);
    const bikeDoc = doc(db, "bikes", data.registrationId);
    updateDoc(bikeDoc, { isDeleted: true }).then(() => {
      dispatch({
        type: "UPDATE_BIKE",
        payload: {
          key: "allBikes",
          registrationId: data.email,
          updated: { isDeleted: true },
        },
      });
      setLoading(false);
    });
  };
  const onEditClick = () => {
    setOpenEditDialog(true);
  };
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Edit Bike">
        <IconButton
          disabled={loading}
          color="primary"
          onClick={onEditClick}
          size="small"
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Bike">
        <IconButton
          disabled={loading}
          color="error"
          onClick={onDeleteClick}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="View Details">
        <IconButton
          disabled={loading}
          color="info"
          onClick={onDetailsClick}
          size="small"
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>

      {loading && <CircularProgress size={20} />}
      <AlertDialog
        open={openDialog}
        information={"Are you sure you want to delete this bike?"}
        title={"Delete Bike"}
        yesLabel={"Yes"}
        noLabel={"Cancel"}
        yesClicked={deleteBike}
        onClose={() => setOpenDialog(false)}
        noClicked={() => setOpenDialog(false)}
      />
      {openEditDialog && (
        <AddNewBike
          onClose={() => setOpenEditDialog(false)}
          isUpdate={true}
          _bike={data}
          open={openEditDialog}
        />
      )}
      {showDetails && (
        <BikeDetails
          onClose={() => setShowDetails(false)}
          open={showDetails}
          data={data}
        />
      )}
    </Box>
  );
};

const columns: GridColDef[] = [
  {
    field: "registrationId",
    flex: 0.8,
    headerName: "Registration Id",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DirectionsBikeIcon fontSize="small" />
        <Typography>Registration Id</Typography>
      </Box>
    ),
  },
  {
    field: "color",
    headerName: "Color",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PaletteIcon fontSize="small" />
        <Typography>Color</Typography>
      </Box>
    ),
  },
  {
    field: "model",
    headerName: "Model",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DirectionsBikeIcon fontSize="small" />
        <Typography>Model</Typography>
      </Box>
    ),
  },
  {
    field: "location",
    headerName: "Location",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LocationOnIcon fontSize="small" />
        <Typography>Location</Typography>
      </Box>
    ),
  },
  {
    field: "rating",
    headerName: "Rating",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <StarIcon fontSize="small" />
        <Typography>Rating</Typography>
      </Box>
    ),
  },
  {
    renderHeader: () => {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
          <Typography>Actions</Typography>
        </Box>
      );
    },
    field: "action",
    sortable: false,
    disableColumnMenu: true,
    flex: 1.5,
    renderCell: (params) => {
      return <Actions data={params.row} />;
    },
  },
];

const MobileBikesTable = ({
  data,
  pageSize = 10,
}: {
  data: any[];
  pageSize?: number;
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
  return (
    <Paper elevation={2} sx={{ p: 0, minWidth: 0 }}>
      <List disablePadding>
        {paginatedData.map((bike, idx) => {
          const globalIdx = (page - 1) * pageSize + idx;
          const isExpanded = expandedIndex === globalIdx;
          return (
            <React.Fragment key={bike.registrationId}>
              <ListItem
                button
                onClick={() => setExpandedIndex(isExpanded ? null : globalIdx)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {/* Avatar with bike icon */}
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: "#1976d2",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  <DirectionsBikeIcon fontSize="small" />
                </Avatar>
                <ListItemText
                  primary={<b>{bike.registrationId}</b>}
                  secondary={bike.model}
                  sx={{ flex: 1 }}
                />
                {isExpanded ? (
                  <KeyboardArrowDownIcon
                    sx={{ transition: "transform 0.2s" }}
                  />
                ) : (
                  <KeyboardArrowRightIcon
                    sx={{ transition: "transform 0.2s" }}
                  />
                )}
              </ListItem>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ px: 4, py: 1, background: "#fafbfc" }}>
                  <Typography variant="body2">
                    <b>Color:</b> {bike.color}
                  </Typography>
                  <Typography variant="body2">
                    <b>Location:</b> {bike.location}
                  </Typography>
                  <Typography variant="body2">
                    <b>Rating:</b> {bike.rating}
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Actions data={bike} />
                  </Box>
                </Box>
              </Collapse>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, val) => {
              setPage(val);
              setExpandedIndex(null);
            }}
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
};

export const Bikes = ({
  showChart = false,
  chartHeight = 260,
  mobilePageSize = 10,
}: {
  showChart?: boolean;
  chartHeight?: number;
  mobilePageSize?: number;
}) => {
  const bikesCollectionRef = collection(db, "bikes");
  const [loading, setLoading] = useState(true);
  const [state, dispatch]: any = useAppState();
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedBikes, setSelectedBikes] = useState<any[]>([]);
  const [showBikesDialog, setShowBikesDialog] = useState(false);
  const [bikeDetails, setBikeDetails] = useState<any>(null);
  const chartRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getBikes = async () => {
      const data = await getDocs(bikesCollectionRef);
      if (data.docs) {
        dispatch({
          type: "SET_PROP",
          payload: {
            key: "allBikes",
            value: data.docs.map((doc: any) => ({ ...doc.data() })),
          },
        });
        setLoading(false);
      }
    };
    getBikes();
  }, []);

  const getFilteredResults = (debouncedSearchTerm: string) => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length <= 0)
      return state.allBikes.filter((u: any) => !u.isDeleted);
    return state.allBikes.filter(
      (u: any) =>
        (!u.isDeleted &&
          u.registrationId
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        u.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        u.color.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        u.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  };

  // Chart data: count bikes per rating range
  const ratingRanges = [
    { label: "0-1", min: 0, max: 1 },
    { label: "1-2", min: 1, max: 2 },
    { label: "2-3", min: 2, max: 3 },
    { label: "3-4", min: 3, max: 4 },
    { label: "4-5", min: 4, max: 5.01 },
  ];
  const chartData = React.useMemo(() => {
    if (!state.allBikes) return [];
    return ratingRanges.map((range, i) => ({
      label: range.label,
      count: state.allBikes.filter((bike) => {
        const rating = Number(bike.rating);
        if (!Number.isFinite(rating)) return false;
        if (i === ratingRanges.length - 1) {
          return !bike.isDeleted && rating >= range.min && rating <= range.max;
        }
        return !bike.isDeleted && rating >= range.min && rating < range.max;
      }).length,
    }));
  }, [state.allBikes]);

  // Chart.js data and options
  const barColors = [
    "#e53935", // 0-1 (red)
    "#fb8c00", // 1-2 (orange)
    "#fdd835", // 2-3 (yellow)
    "#8bc34a", // 3-4 (distinct light green)
    "#388e3c", // 4-5 (dark green)
  ];

  // Memoize barData and barOptions
  const barData = React.useMemo(
    () => ({
      labels: chartData.map((d) => d.label),
      datasets: [
        {
          label: "Bikes",
          data: chartData.map((d) => d.count),
          backgroundColor: barColors,
          borderRadius: 6,
        },
      ],
    }),
    [chartData]
  );

  const barOptions = React.useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Bikes by Rating Range" },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const range = ratingRanges[index];
              const bikesInRange = state.allBikes.filter((bike) => {
                const rating = Number(bike.rating);
                if (!Number.isFinite(rating)) return false;
                if (index === ratingRanges.length - 1) {
                  return (
                    !bike.isDeleted &&
                    rating >= range.min &&
                    rating <= range.max
                  );
                }
                return (
                  !bike.isDeleted && rating >= range.min && rating < range.max
                );
              });
              if (bikesInRange.length === 0) return "No bikes";
              // Build a grid-like string
              let header = "Reg# | Color | Model | Location";
              let rows = bikesInRange.map(
                (b) =>
                  `${b.registrationId} | ${b.color} | ${b.model} | ${b.location}`
              );
              return [header, ...rows];
            },
          },
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "Rating Range" } },
        y: {
          title: { display: true, text: "Count" },
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            callback: function (value) {
              return Number(value).toFixed(0);
            },
          },
        },
      },
    }),
    [state.allBikes]
  );

  return (
    <>
      {showChart && chartData.length > 0 && (
        <Box
          sx={{
            mb: 3,
            width: "100%",
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            height: chartHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bar ref={chartRef} data={barData} options={barOptions} />
        </Box>
      )}
      <Dialog
        open={showBikesDialog}
        onClose={() => setShowBikesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsBikeIcon />
            <Typography variant="h6">Bikes with selected rating</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBikes.length === 0 ? (
            <Typography>No bikes found for this rating.</Typography>
          ) : (
            <Paper elevation={0} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "primary.light" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DirectionsBikeIcon fontSize="small" />
                        Registration Id
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PaletteIcon fontSize="small" />
                        Color
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DirectionsBikeIcon fontSize="small" />
                        Model
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOnIcon fontSize="small" />
                        Location
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <StarIcon fontSize="small" />
                        Rating
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBikes.map((bike, idx) => (
                    <TableRow
                      key={bike.registrationId || idx}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell>{bike.registrationId}</TableCell>
                      <TableCell>{bike.color}</TableCell>
                      <TableCell>{bike.model}</TableCell>
                      <TableCell>{bike.location}</TableCell>
                      <TableCell>{bike.rating}</TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setBikeDetails(bike)}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
      {bikeDetails && (
        <BikeDetails
          onClose={() => setBikeDetails(null)}
          open={!!bikeDetails}
          data={bikeDetails}
        />
      )}
      {!showChart && (
        <>
          {openAddNewDialog && (
            <AddNewBike
              title={"Create New Bike"}
              open={openAddNewDialog}
              onClose={() => setOpenAddNewDialog(false)}
            />
          )}
          <Box sx={{ my: 2, px: { xs: 0, sm: 1 }, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                mb: 3,
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DirectionsBikeIcon />
                  Bikes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddNewDialog(true)}
                  sx={{ ml: 2 }}
                >
                  Add Bike
                </Button>
              </Box>
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bikes..."
                sx={{ width: { xs: "100%", sm: "100%", md: 300 } }}
              />
            </Box>
            {isMobile ? (
              <MobileBikesTable
                data={getFilteredResults(debouncedSearchTerm)}
                pageSize={mobilePageSize}
              />
            ) : (
              <Box
                sx={{ width: "100%", overflowX: "auto", px: { xs: 1, sm: 2 } }}
              >
                <Paper elevation={2} sx={{ p: 2, minWidth: 700 }}>
                  <DataTable
                    data={getFilteredResults(debouncedSearchTerm)}
                    loading={loading}
                    columns={columns}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        </>
      )}
    </>
  );
};
