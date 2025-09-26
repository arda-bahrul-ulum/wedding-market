import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Tooltip,
  Fab,
  Pagination,
  Stack,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CategoryManagementPage = () => {
  const navigate = useNavigate();

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#1976d2",
    is_active: true,
  });

  // Filter state
  const [filters, setFilters] = useState({
    name: "",
    is_active: "",
  });

  // UI state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Load categories
  const loadCategories = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      });

      const response = await api.get(`/admin/categories?${params}`);

      if (response.data.success) {
        setCategories(response.data.data.categories);
        setPagination({
          page: response.data.data.pagination.page,
          limit: response.data.data.pagination.limit,
          total: response.data.data.pagination.total,
          totalPages: response.data.data.pagination.total_pages,
        });
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      showSnackbar("Gagal memuat data kategori", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load category statistics
  const loadStatistics = async () => {
    try {
      const response = await api.get("/admin/categories/statistics");
      if (response.data.success) {
        // You can use this data for dashboard cards
        console.log("Category statistics:", response.data.data);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      let response;

      if (dialogMode === "create") {
        response = await api.post("/admin/categories", formData);
      } else if (dialogMode === "edit") {
        response = await api.put(
          `/admin/categories/${selectedCategory.id}`,
          formData
        );
      }

      if (response.data.success) {
        showSnackbar(
          dialogMode === "create"
            ? "Kategori berhasil dibuat"
            : "Kategori berhasil diupdate",
          "success"
        );
        setOpenDialog(false);
        loadCategories(pagination.page);
        resetForm();
      } else {
        showSnackbar(response.data.message || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      showSnackbar("Terjadi kesalahan saat menyimpan", "error");
    }
  };

  // Handle delete
  const handleDelete = async (category) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`
      )
    ) {
      try {
        const response = await api.delete(`/admin/categories/${category.id}`);
        if (response.data.success) {
          showSnackbar("Kategori berhasil dihapus", "success");
          loadCategories(pagination.page);
        } else {
          showSnackbar(
            response.data.message || "Gagal menghapus kategori",
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        showSnackbar("Terjadi kesalahan saat menghapus", "error");
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (category) => {
    try {
      const endpoint = category.is_active ? "deactivate" : "activate";
      const response = await api.put(
        `/admin/categories/${category.id}/${endpoint}`
      );

      if (response.data.success) {
        showSnackbar(
          category.is_active
            ? "Kategori berhasil dinonaktifkan"
            : "Kategori berhasil diaktifkan",
          "success"
        );
        loadCategories(pagination.page);
      } else {
        showSnackbar(response.data.message || "Gagal mengubah status", "error");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      showSnackbar("Terjadi kesalahan saat mengubah status", "error");
    }
  };

  // Open dialog
  const openDialogWithMode = (mode, category = null) => {
    setDialogMode(mode);
    setSelectedCategory(category);

    if (mode === "create") {
      resetForm();
    } else if (mode === "edit" || mode === "view") {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "",
        color: category.color || "#1976d2",
        is_active: category.is_active || false,
      });
    }

    setOpenDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#1976d2",
      is_active: true,
    });
  };

  // Show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      name: searchTerm,
    }));
    loadCategories(1);
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    loadCategories(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      name: "",
      is_active: "",
    });
    setSearchTerm("");
    loadCategories(1);
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    loadCategories(page);
  };

  // Load data on component mount
  useEffect(() => {
    loadCategories();
    loadStatistics();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    if (filters.name !== searchTerm) {
      loadCategories(1);
    }
  }, [filters]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <CategoryIcon />
          Master Kategori
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialogWithMode("create")}
          sx={{ borderRadius: 2 }}
        >
          Tambah Kategori
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Kategori
              </Typography>
              <Typography variant="h4">{pagination.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Kategori Aktif
              </Typography>
              <Typography variant="h4" color="success.main">
                {categories.filter((cat) => cat.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Kategori Nonaktif
              </Typography>
              <Typography variant="h4" color="error.main">
                {categories.filter((cat) => !cat.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Halaman
              </Typography>
              <Typography variant="h4">
                {pagination.page} / {pagination.totalPages}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.is_active}
                  onChange={(e) =>
                    handleFilterChange("is_active", e.target.value)
                  }
                  label="Status"
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Nonaktif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  startIcon={<FilterIcon />}
                >
                  Terapkan Filter
                </Button>
                <Button variant="outlined" onClick={clearFilters}>
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => loadCategories(pagination.page)}
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Warna</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Dibuat</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>Memuat data...</Typography>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>Tidak ada data kategori</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {category.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {category.icon && (
                        <Typography variant="h6">{category.icon}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {category.color && (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: category.color,
                            borderRadius: 1,
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.is_active ? "Aktif" : "Nonaktif"}
                        color={category.is_active ? "success" : "error"}
                        size="small"
                        icon={
                          category.is_active ? <ActiveIcon /> : <InactiveIcon />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(category.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Lihat Detail">
                          <IconButton
                            size="small"
                            onClick={() => openDialogWithMode("view", category)}
                            color="info"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => openDialogWithMode("edit", category)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            category.is_active ? "Nonaktifkan" : "Aktifkan"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleStatusToggle(category)}
                            color={category.is_active ? "warning" : "success"}
                          >
                            {category.is_active ? (
                              <InactiveIcon />
                            ) : (
                              <ActiveIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(category)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Card>

      {/* Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create" && "Tambah Kategori Baru"}
          {dialogMode === "edit" && "Edit Kategori"}
          {dialogMode === "view" && "Detail Kategori"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nama Kategori"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deskripsi"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={dialogMode === "view"}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                disabled={dialogMode === "view"}
                placeholder="🎉"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Warna"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    disabled={dialogMode === "view"}
                  />
                }
                label="Status Aktif"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {dialogMode === "view" ? "Tutup" : "Batal"}
          </Button>
          {dialogMode !== "view" && (
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === "create" ? "Buat" : "Update"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagementPage;
