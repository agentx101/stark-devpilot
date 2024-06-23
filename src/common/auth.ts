import * as vscode from 'vscode'

import * as fs from 'fs'
import * as path from 'path';
import * as auth0  from 'auth0-js';

import { Web3Auth } from '@web3auth/web3auth';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

type AuthCallback = (error: auth0.Auth0ParseHashError | null, result?: auth0.Auth0DecodedHash) => void;
let webViewPanel: vscode.WebviewPanel | undefined = undefined;
let web3auth: Web3Auth;

const envFilePath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFilePath)) {
  require('dotenv').config({ path: envFilePath });
}

const auth0Config = {
    domain: process.env.AUTH0_DOMAIN || '',
    clientId: process.env.AUTH0_CLIENT_ID || '',
    redirectUri: process.env.AUTH0_REDIRECT_URI || ''
}

const webAuth = new auth0.WebAuth({
  domain: auth0Config.domain,
  clientID: auth0Config.clientId,
  redirectUri: auth0Config.redirectUri,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const generateNonce = () => {
  const random = Math.random().toString(36).substring(2, 15);
  return encodeURIComponent(random);
}

const socialLogin = () => {
  //webAuth.authorize();
  const nonce = generateNonce()
  const authUrl = `https://${auth0Config.domain}/authorize?client_id=${auth0Config.clientId}&redirect_uri=${encodeURIComponent(auth0Config.redirectUri)}&response_type=token id_token&scope=openid profile email&nonce=${nonce}`
  vscode.env.openExternal(vscode.Uri.parse(authUrl))
              .then(undefined, error => {
                console.error('Failed to open Auth0 login URL:', error);
                vscode.window.showErrorMessage('Failed to initiate login. Please try again later.');
            })
}

const handleAuthentication = (uri: vscode.Uri) => {
  console.log(uri)
  if (uri.scheme === vscode.env.uriScheme && uri.authority === 'taran.devdock' && uri.path === '/auth/callback') {
    const fragment = uri.fragment;
    const tokenRegex = /access_token=([^&]+)/
    const match = tokenRegex.exec(fragment)
    if (match && match.length > 1) {
      const accessToken = match[1]
      console.log("Access Token:", accessToken)
    }else{
      console.error("No access token found in URI fragment")
    }
  }else{
    console.error("Invalid callback URI")
  }
}

// const getAuthHtml = (authUrl: string): string  => {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta http-equiv="Content-Security-Policy" content="frame-src https://devdock.us.auth0.com/ https://us.auth0.com/ https://auth0.com/;">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Auth0 Login</title>
//     </head>
//     <body>
//         <!-- Your authentication content here -->
//         <iframe src="https://devdock.us.auth0.com/" width="100%" height="100%"></iframe>
//     </body>
//     </html>
//   `;
// }

export { auth0Config, socialLogin, handleAuthentication }

