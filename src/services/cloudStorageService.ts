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

      // First, try to find existing folder
      const searchResponse = await window.gapi.client.drive.files.list({
        q: `name='${this.DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      if (searchResponse.result.files && searchResponse.result.files.length > 0) {
        return searchResponse.result.files[0].id!;
      }

      // Create new folder if not found
      const folderResponse = await window.gapi.client.drive.files.create({
        resource: {
          name: this.DRIVE_FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });

      return folderResponse.result.id!;
    } catch (error) {
      console.error('Error getting/creating app folder:', error);
      throw new Error('Failed to access Google Drive folder');
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

      // Search for existing data file
      const searchResponse = await window.gapi.client.drive.files.list({
        q: `name='${this.DATA_FILE_NAME}' and parents in '${folderId}' and trashed=false`,
        fields: 'files(id, name)',
      });

      if (searchResponse.result.files && searchResponse.result.files.length > 0) {
        return searchResponse.result.files[0].id!;
      }

      // Create new data file if not found
      const fileResponse = await window.gapi.client.drive.files.create({
        resource: {
          name: this.DATA_FILE_NAME,
          parents: [folderId],
        },
        media: {
          mimeType: this.MIME_TYPE,
          body: JSON.stringify({
            expenses: [],
            income: [],
            categories: [],
            goals: [],
            bills: [],
            investments: [],
            lastSync: new Date().toISOString(),
            version: 1,
          }),
        },
        fields: 'id',
      });

      return fileResponse.result.id!;
    } catch (error) {
      console.error('Error getting/creating data file:', error);
      throw new Error('Failed to access data file');
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

      const folderId = await this.getOrCreateAppFolder();
      const fileId = await this.getOrCreateDataFile(folderId);

      // Update the data file
      await window.gapi.client.drive.files.update({
        fileId: fileId,
        media: {
          mimeType: this.MIME_TYPE,
          body: JSON.stringify(data),
        },
      });

      console.log('Data uploaded to Google Drive successfully');
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
    return !!(window.gapi && window.gapi.client && window.gapi.client.drive && window.gapi.auth2?.getAuthInstance()?.isSignedIn?.get());
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
