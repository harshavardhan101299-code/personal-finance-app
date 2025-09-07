import { GOOGLE_CLIENT_ID, GOOGLE_SCOPES, GOOGLE_AUTH_ENDPOINT, REDIRECT_URI } from '../config/googleAuth';
import { CloudStorageService } from './cloudStorageService';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export class GoogleAuthService {
  private static generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private static generateCodeVerifier(): string {
    return this.generateRandomString(128);
  }

  private static async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const uint8Array = new Uint8Array(digest);
    const charCodes = Array.from(uint8Array).map(byte => byte);
    return btoa(String.fromCharCode(...charCodes))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  static async initiateAuth(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const state = this.generateRandomString(32);
    
    // Store code verifier and state in session storage
    sessionStorage.setItem('code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);
    
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    const authUrl = new URL(GOOGLE_AUTH_ENDPOINT);
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', GOOGLE_SCOPES);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    
    window.location.href = authUrl.toString();
  }

  static async handleCallback(code: string, state: string): Promise<GoogleUser | null> {
    try {
      // Verify state
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      const codeVerifier = sessionStorage.getItem('code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      // Exchange code for tokens - try without client_secret first (for SPA)
      const tokenRequestBody = {
        client_id: GOOGLE_CLIENT_ID,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      };
      
      console.log('Token request body:', tokenRequestBody);
      console.log('Client ID being sent:', GOOGLE_CLIENT_ID);
      console.log('Redirect URI being sent:', REDIRECT_URI);
      
      let tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequestBody),
      });

      // If first attempt fails, try with client_secret (for web applications)
      if (!tokenResponse.ok) {
        console.log('First attempt failed, trying with client_secret...');
        const tokenRequestBodyWithSecret = {
          ...tokenRequestBody,
          client_secret: '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', // Your client secret
        };
        
        tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(tokenRequestBodyWithSecret),
        });
      }

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          response: errorText
        });
        throw new Error(`Failed to exchange code for tokens: ${tokenResponse.status} ${tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      
      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      
      // Initialize Google Drive API for cloud storage
      try {
        await this.initializeGoogleAPIs(tokenData.access_token);
      } catch (error) {
        console.warn('Failed to initialize Google Drive API:', error);
        // Don't fail the login if Drive API fails
      }
      
      // Clean up session storage
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('oauth_state');
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        given_name: userData.given_name,
        family_name: userData.family_name,
      };
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return null;
    }
  }

  static isCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && urlParams.has('state');
  }

  /**
   * Initialize Google APIs (Drive API) after successful authentication
   */
  private static async initializeGoogleAPIs(accessToken: string): Promise<void> {
    try {
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
        window.gapi.load('client:auth2', { callback: resolve, onerror: reject });
      });

      // Set the access token
      window.gapi.client.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY || '');
      window.gapi.client.setToken({ access_token: accessToken });

      // Initialize CloudStorageService
      await CloudStorageService.initialize();
      
      console.log('Google APIs initialized successfully');
    } catch (error) {
      console.error('Error initializing Google APIs:', error);
      throw error;
    }
  }
}
