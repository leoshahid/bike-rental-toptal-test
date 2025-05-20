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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Pagination from "@mui/material/Pagination";

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

const MobileUsersTable = ({
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
        {paginatedData.map((user, idx) => {
          const globalIdx = (page - 1) * pageSize + idx;
          const isExpanded = expandedIndex === globalIdx;
          return (
            <React.Fragment key={user.email}>
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
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: "#1976d2",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || "?"}
                </Avatar>
                <ListItemText
                  primary={<b>{user.name}</b>}
                  secondary={user.email}
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
                    <b>Age:</b> {user.age}
                  </Typography>
                  <Typography variant="body2">
                    <b>Role:</b> {user.isManager ? "Manager" : "User"}
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Actions data={user} />
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

export const Users = ({ mobilePageSize = 10 }: { mobilePageSize?: number }) => {
  const usersCollectionRef = collection(db, "users");

  const [loading, setLoading] = useState(true);
  const [state, dispatch]: any = useAppState();
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            sx={{ width: { xs: "100%", sm: "100%", md: 300 } }}
          />
        </Box>
        {isMobile ? (
          <MobileUsersTable
            data={getFilteredResults(debouncedSearchTerm)}
            pageSize={mobilePageSize}
          />
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto", px: { xs: 1, sm: 2 } }}>
            <Paper elevation={2} sx={{ p: 2, minWidth: 700 }}>
              <DataTable
                data={getFilteredResults(debouncedSearchTerm)}
                loading={loading}
                columns={columns}
                pageSize={10}
              />
            </Paper>
          </Box>
        )}
      </Box>
    </>
  );
};
