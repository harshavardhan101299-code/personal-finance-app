import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload,
  CloudDownload,
  Sync,
  CloudDone,
  CloudOff,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { UserDataStorage } from '../utils/userDataStorage';

interface SyncStatus {
  isEnabled: boolean;
  lastSync: string | null;
  isSyncing: boolean;
  error: string | null;
}

const CloudSync: React.FC = () => {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isEnabled: false,
    lastSync: null,
    isSyncing: false,
    error: null,
  });

  const userStorage = user ? new UserDataStorage(user.id) : null;

  useEffect(() => {
    if (userStorage) {
      setSyncStatus(prev => ({
        ...prev,
        isEnabled: userStorage.isCloudSyncEnabled(),
      }));
    }
  }, [userStorage]);

  const handleSyncToCloud = async () => {
    if (!userStorage) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const success = await userStorage.syncToCloud();
      if (success) {
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          isSyncing: false,
        }));
      } else {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: 'Failed to sync to cloud. Please try again.',
        }));
      }
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: 'Error syncing to cloud. Please check your connection.',
      }));
    }
  };

  const handleSyncFromCloud = async () => {
    if (!userStorage) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const success = await userStorage.syncFromCloud();
      if (success) {
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          isSyncing: false,
        }));
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: 'No cloud data found or sync failed.',
        }));
      }
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: 'Error syncing from cloud. Please check your connection.',
      }));
    }
  };

  const handleFullSync = async () => {
    if (!userStorage) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const success = await userStorage.fullSync();
      if (success) {
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          isSyncing: false,
        }));
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: 'Sync completed but no changes were made.',
        }));
      }
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: 'Error during sync. Please try again.',
      }));
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!user) {
    return null;
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="h2">
            Cloud Sync
          </Typography>
          <Chip
            icon={syncStatus.isEnabled ? <CloudDone /> : <CloudOff />}
            label={syncStatus.isEnabled ? 'Enabled' : 'Disabled'}
            color={syncStatus.isEnabled ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Sync your financial data to Google Drive to access it from any device or browser.
          Your data will be automatically backed up and synced across all your devices.
        </Typography>

        {syncStatus.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {syncStatus.error}
          </Alert>
        )}

        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          <Tooltip title="Upload your local data to Google Drive">
            <Button
              variant="outlined"
              startIcon={syncStatus.isSyncing ? <CircularProgress size={16} /> : <CloudUpload />}
              onClick={handleSyncToCloud}
              disabled={!syncStatus.isEnabled || syncStatus.isSyncing}
              size="small"
            >
              Upload to Cloud
            </Button>
          </Tooltip>

          <Tooltip title="Download data from Google Drive">
            <Button
              variant="outlined"
              startIcon={syncStatus.isSyncing ? <CircularProgress size={16} /> : <CloudDownload />}
              onClick={handleSyncFromCloud}
              disabled={!syncStatus.isEnabled || syncStatus.isSyncing}
              size="small"
            >
              Download from Cloud
            </Button>
          </Tooltip>

          <Tooltip title="Two-way sync: merge local and cloud data">
            <Button
              variant="contained"
              startIcon={syncStatus.isSyncing ? <CircularProgress size={16} /> : <Sync />}
              onClick={handleFullSync}
              disabled={!syncStatus.isEnabled || syncStatus.isSyncing}
              size="small"
            >
              Full Sync
            </Button>
          </Tooltip>

          <Tooltip title="Refresh sync status">
            <IconButton
              onClick={() => window.location.reload()}
              disabled={syncStatus.isSyncing}
              size="small"
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {syncStatus.lastSync && (
          <Typography variant="caption" color="text.secondary">
            Last sync: {formatLastSync(syncStatus.lastSync)}
          </Typography>
        )}

        {!syncStatus.isEnabled && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Cloud sync is not available. Make sure you're logged in with Google and have granted
            the necessary permissions for Google Drive access.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudSync;
