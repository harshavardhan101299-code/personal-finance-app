import { ExpenseEntry, ExpenseCategory, FinancialGoal, Bill, Investment } from '../types';

export interface CloudData {
  expenses: ExpenseEntry[];
  income: ExpenseEntry[];
  categories: ExpenseCategory[];
  goals: FinancialGoal[];
  bills: Bill[];
  investments: Investment[];
  lastSync: string;
  version: number;
}

export class CloudStorageService {
  private static readonly DRIVE_FOLDER_NAME = 'PersonalFinanceApp';
  private static readonly DATA_FILE_NAME = 'finance_data.json';
  private static readonly MIME_TYPE = 'application/json';

  /**
   * Get or create the app folder in Google Drive
   */
  private static async getOrCreateAppFolder(): Promise<string> {
    try {
      if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
        throw new Error('Google Drive API not available');
      }

      console.log('Searching for existing PersonalFinanceApp folder...');

      // First, try to find existing folder
      const searchResponse = await window.gapi.client.drive.files.list({
        q: `name='${this.DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      console.log('Search response:', searchResponse.result);

      if (searchResponse.result.files && searchResponse.result.files.length > 0) {
        console.log(`Found existing folder: ${searchResponse.result.files[0].name} (ID: ${searchResponse.result.files[0].id})`);
        return searchResponse.result.files[0].id!;
      }

      console.log('No existing folder found, creating new one...');

      // Create new folder if not found
      const folderResponse = await window.gapi.client.drive.files.create({
        resource: {
          name: this.DRIVE_FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id, name',
      });

      console.log(`Created new folder: ${folderResponse.result.name} (ID: ${folderResponse.result.id})`);
      return folderResponse.result.id!;
    } catch (error) {
      console.error('Error getting/creating app folder:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to access Google Drive folder: ${errorMessage}`);
    }
  }

  /**
   * Get or create the data file in the app folder
   */
  private static async getOrCreateDataFile(folderId: string): Promise<string> {
    try {
      if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
        throw new Error('Google Drive API not available');
      }

      console.log(`Searching for existing data file in folder ${folderId}...`);

      // Search for existing data file
      const searchResponse = await window.gapi.client.drive.files.list({
        q: `name='${this.DATA_FILE_NAME}' and parents in '${folderId}' and trashed=false`,
        fields: 'files(id, name)',
      });

      console.log('Data file search response:', searchResponse.result);

      if (searchResponse.result.files && searchResponse.result.files.length > 0) {
        console.log(`Found existing data file: ${searchResponse.result.files[0].name} (ID: ${searchResponse.result.files[0].id})`);
        return searchResponse.result.files[0].id!;
      }

      console.log('No existing data file found, creating new one...');

      // Create new data file if not found
      const initialData = {
        expenses: [],
        income: [],
        categories: [],
        goals: [],
        bills: [],
        investments: [],
        lastSync: new Date().toISOString(),
        version: 1,
      };

      const fileResponse = await window.gapi.client.drive.files.create({
        resource: {
          name: this.DATA_FILE_NAME,
          parents: [folderId],
        },
        media: {
          mimeType: this.MIME_TYPE,
          body: JSON.stringify(initialData, null, 2),
        },
        fields: 'id, name',
      });

      console.log(`Created new data file: ${fileResponse.result.name} (ID: ${fileResponse.result.id})`);
      return fileResponse.result.id!;
    } catch (error) {
      console.error('Error getting/creating data file:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to access data file: ${errorMessage}`);
    }
  }

  /**
   * Upload data to Google Drive
   */
  static async uploadData(data: CloudData): Promise<void> {
    try {
      if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
        throw new Error('Google Drive API not initialized');
      }

      console.log('Starting data upload to Google Drive...');
      console.log('Data to upload:', {
        expenses: data.expenses.length,
        income: data.income.length,
        categories: data.categories.length,
        goals: data.goals.length,
        bills: data.bills.length,
        investments: data.investments.length,
        lastSync: data.lastSync,
        version: data.version
      });

      const folderId = await this.getOrCreateAppFolder();
      const fileId = await this.getOrCreateDataFile(folderId);

      console.log(`Updating data file ${fileId} with new data...`);

      // Update the data file
      const updateResponse = await window.gapi.client.drive.files.update({
        fileId: fileId,
        media: {
          mimeType: this.MIME_TYPE,
          body: JSON.stringify(data, null, 2),
        },
      });

      console.log('Data uploaded to Google Drive successfully');
      console.log('Update response:', updateResponse.result);
    } catch (error) {
      console.error('Error uploading data to cloud:', error);
      throw error;
    }
  }

  /**
   * Download data from Google Drive
   */
  static async downloadData(): Promise<CloudData | null> {
    try {
      if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
        throw new Error('Google Drive API not initialized');
      }

      const folderId = await this.getOrCreateAppFolder();
      const fileId = await this.getOrCreateDataFile(folderId);

      // Download the file content
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });

      const data = JSON.parse(response.body) as CloudData;
      console.log('Data downloaded from Google Drive successfully');
      return data;
    } catch (error) {
      console.error('Error downloading data from cloud:', error);
      return null;
    }
  }

  /**
   * Check if Google Drive API is available and user is authenticated
   */
  static isAvailable(): boolean {
    // Check if gapi is loaded and Drive API is available
    const hasGapi = !!(window.gapi && window.gapi.client);
    const hasDriveAPI = !!(window.gapi?.client?.drive);
    
    // Check if we have an access token (from OAuth flow)
    const hasAccessToken = !!(window.gapi?.client?.getToken?.()?.access_token);
    
    console.log('Cloud sync availability check:', {
      hasGapi,
      hasDriveAPI,
      hasAccessToken,
      gapiClient: !!window.gapi?.client,
      driveAPI: !!window.gapi?.client?.drive
    });
    
    return hasGapi && hasDriveAPI && hasAccessToken;
  }

  /**
   * Initialize Google Drive API
   */
  static async initialize(): Promise<void> {
    try {
      if (!window.gapi || !window.gapi.client) {
        throw new Error('Google API client not loaded');
      }

      // Load Drive API if not already loaded
      if (!window.gapi.client.drive) {
        await window.gapi.client.load('drive', 'v3');
      }

      console.log('Google Drive API initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Drive API:', error);
      throw error;
    }
  }

  /**
   * Try to reinitialize Google APIs from stored token
   */
  static async reinitializeFromStoredToken(): Promise<boolean> {
    try {
      const storedToken = localStorage.getItem('google_access_token');
      if (!storedToken) {
        console.log('No stored Google access token found');
        return false;
      }

      // Load Google API client if not already loaded
      if (!window.gapi) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Initialize the API client
      await new Promise((resolve, reject) => {
        window.gapi.load('client', { callback: resolve, onerror: reject });
      });

      // Initialize the client with API key and stored token
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      });

      // Set the stored access token
      window.gapi.client.setToken({ access_token: storedToken });

      // Initialize Drive API
      await this.initialize();
      
      console.log('Google APIs reinitialized from stored token successfully');
      return true;
    } catch (error) {
      console.error('Error reinitializing Google APIs from stored token:', error);
      return false;
    }
  }

  /**
   * Merge local and cloud data, keeping the most recent version
   */
  static mergeData(localData: CloudData, cloudData: CloudData): CloudData {
    const localTime = new Date(localData.lastSync).getTime();
    const cloudTime = new Date(cloudData.lastSync).getTime();

    // If cloud data is newer, use it as base and merge local changes
    if (cloudTime > localTime) {
      return {
        ...cloudData,
        lastSync: new Date().toISOString(),
        version: Math.max(localData.version, cloudData.version) + 1,
      };
    }

    // If local data is newer, use it as base
    return {
      ...localData,
      lastSync: new Date().toISOString(),
      version: Math.max(localData.version, cloudData.version) + 1,
    };
  }
}
