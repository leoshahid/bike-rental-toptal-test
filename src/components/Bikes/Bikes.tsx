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
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AlertDialog from "../AlertDialog";
import AddNewBike from "./AddNewBike";
import BikeDetails from "./Bike Details";
import AddIcon from "@mui/icons-material/Add";
import { useDebounce } from "../../utils";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDatasetAtEvent } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
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
    <div>
      <Button disabled={loading} color="primary" onClick={onEditClick}>
        Edit
      </Button>

      <Button disabled={loading} color="warning" onClick={onDeleteClick}>
        Delete
      </Button>
      <Button disabled={loading} color="primary" onClick={onDetailsClick}>
        Details
      </Button>

      {loading && (
        <CircularProgress style={{ height: "25px", width: "25px" }} />
      )}
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
    </div>
  );
};
const columns: GridColDef[] = [
  { field: "registrationId", flex: 0.8, headerName: "Registration Id" },
  { field: "color", headerName: "Color" },
  { field: "model", headerName: "Model" },
  { field: "location", headerName: "Location" },
  { field: "rating", headerName: "Rating" },

  {
    renderHeader: () => {
      return <div style={{ marginLeft: 15 }}>Actions</div>;
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
export const Bikes = ({
  showChart = false,
  chartHeight = 260,
}: {
  showChart?: boolean;
  chartHeight?: number;
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
      {/* Debug output for chartData and ratingRanges */}

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
      {/* Always render the dialog for bikes with selected rating */}
      <Dialog
        open={showBikesDialog}
        onClose={() => setShowBikesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bikes with selected rating</DialogTitle>
        <DialogContent>
          {selectedBikes.length === 0 ? (
            <Typography>No bikes found for this rating.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Registration Id</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedBikes.map((bike, idx) => (
                  <TableRow key={bike.registrationId || idx}>
                    <TableCell>{bike.registrationId}</TableCell>
                    <TableCell>{bike.color}</TableCell>
                    <TableCell>{bike.model}</TableCell>
                    <TableCell>{bike.location}</TableCell>
                    <TableCell>{bike.rating}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => setBikeDetails(bike)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
      {/* Always render BikeDetails dialog for a single bike */}
      {bikeDetails && (
        <BikeDetails
          onClose={() => setBikeDetails(null)}
          open={!!bikeDetails}
          data={bikeDetails}
        />
      )}
      {/* Only render table and add dialog if showChart is false */}
      {!showChart && (
        <>
          {openAddNewDialog && (
            <AddNewBike
              title={"Create New Bike"}
              open={openAddNewDialog}
              onClose={() => setOpenAddNewDialog(false)}
            />
          )}
          <Box style={{ margin: 5, width: "100%" }}>
            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <Box style={{ display: "flex", marginBottom: "10px" }}>
                <h3>Bikes</h3>{" "}
                <Button
                  style={{ marginLeft: "10px" }}
                  endIcon={<AddIcon />}
                  onClick={() => setOpenAddNewDialog(true)}
                >
                  Add Bike
                </Button>
              </Box>
              <TextField
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                value={searchTerm}
                id="outlined-basic"
                label="Search Bike"
                variant="standard"
              />
            </Box>
            <DataTable
              data={getFilteredResults(debouncedSearchTerm)}
              loading={loading}
              columns={columns}
            />{" "}
          </Box>
        </>
      )}
    </>
  );
};
