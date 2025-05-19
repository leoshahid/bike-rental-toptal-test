import React, { useEffect, useState } from "react";
import { useAppState } from "../../appContext";
import { db } from "../../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { DataTable } from "../DataGrid";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AlertDialog from "../AlertDialog";
import AddNewUser from "./AddNewUser";
import UserDetails from "./User Details";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import BadgeIcon from "@mui/icons-material/Badge";
import { useDebounce } from "../../utils";
import { useUserAuth } from "../../context/UserAuthContext";
import SearchInput from "../common/SearchInput";

const Actions = (props: any) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const [state, dispatch]: any = useAppState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useUserAuth();

  const onDeleteClick = () => {
    setOpenDialog(true);
  };
  const onDetailsClick = () => {
    setShowDetails(true);
  };
  const deleteUser = () => {
    setOpenDialog(false);
    setLoading(true);
    const userDoc = doc(db, "users", data.email);
    updateDoc(userDoc, { isDeleted: true }).then(() => {
      dispatch({
        type: "UPDATE_USER",
        payload: {
          key: "allUsers",
          email: data.email,
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
      <Tooltip title="Delete User">
        <IconButton
          disabled={loading || user.email === data.email}
          color="error"
          onClick={onDeleteClick}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit User">
        <IconButton
          disabled={loading}
          color="primary"
          onClick={onEditClick}
          size="small"
        >
          <EditIcon />
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
        information={"Are you sure you want to delete the user?"}
        title={"Delete user"}
        yesLabel={"Yes"}
        noLabel={"Cancel"}
        yesClicked={deleteUser}
        onClose={() => setOpenDialog(false)}
        noClicked={() => setOpenDialog(false)}
      />
      {openEditDialog && (
        <AddNewUser
          onClose={() => setOpenEditDialog(false)}
          isUpdate={true}
          user={data}
          open={openEditDialog}
        />
      )}
      {showDetails && (
        <UserDetails
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
    field: "name",
    flex: 1,
    headerName: "Name",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PersonIcon fontSize="small" />
        <Typography>Name</Typography>
      </Box>
    ),
  },
  {
    field: "email",
    flex: 1,
    headerName: "Email",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EmailIcon fontSize="small" />
        <Typography>Email</Typography>
      </Box>
    ),
  },
  {
    field: "age",
    flex: 0.5,
    headerName: "Age",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CakeIcon fontSize="small" />
        <Typography>Age</Typography>
      </Box>
    ),
  },
  {
    field: "role",
    headerName: "Role",
    renderHeader: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <BadgeIcon fontSize="small" />
        <Typography>Role</Typography>
      </Box>
    ),
    valueGetter: (params: any) => {
      return params.row.isManager ? "Manager" : "User";
    },
  },
  {
    field: "action",
    renderHeader: () => {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
          <Typography>Actions</Typography>
        </Box>
      );
    },
    sortable: false,
    disableColumnMenu: true,
    flex: 1.5,
    renderCell: (params) => {
      return <Actions data={params.row} />;
    },
  },
];

export const Users = () => {
  const usersCollectionRef = collection(db, "users");

  const [loading, setLoading] = useState(true);
  const [state, dispatch]: any = useAppState();
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      if (data.docs) {
        dispatch({
          type: "SET_PROP",
          payload: {
            key: "allUsers",
            value: data.docs.map((doc: any) => ({ ...doc.data() })),
          },
        });
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const getFilteredResults = (debouncedSearchTerm) => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length <= 0)
      return state.allUsers.filter((u: any) => !u.isDeleted);
    return state.allUsers.filter(
      (u: any) =>
        (!u.isDeleted &&
          u.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  };

  return (
    <>
      {openAddNewDialog && (
        <AddNewUser
          title={"Create New User"}
          open={openAddNewDialog}
          onClose={() => setOpenAddNewDialog(false)}
        />
      )}
      <Box sx={{ m: 2, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PersonIcon />
              Users
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddNewDialog(true)}
              sx={{ ml: 2 }}
            >
              Add User
            </Button>
          </Box>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            sx={{ width: 300 }}
          />
        </Box>
        <Paper elevation={2} sx={{ p: 2 }}>
          <DataTable
            data={getFilteredResults(debouncedSearchTerm)}
            loading={loading}
            columns={columns}
          />
        </Paper>
      </Box>
    </>
  );
};
