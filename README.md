# Devdock

Welcome to **Devdock**, a revolutionary co-pilot VS Code extension designed to enhance your development experience and reward you for successful deployments.

## Overview

Devdock is an AI-powered extension for the VS Code workspace, tailored for the Starknet ecosystem. It offers the following functionalities:

1. **Token Rewards**: Earn crypto tokens for every successful deployment.
2. **Personalized AI Model**: Fine-tune a model with your code data and retain ownership.
3. **Developmental Assistance**: Get real-time help with your development queries directly in VS Code.

### Additional Features

- **LLM Connectivity**: Connect to both hosted and local Large Language Models (LLMs).
- **Advanced Co-Pilot**: Beyond chat support, it offers in-depth solutions to development questions.
- **Earn Crypto**: Gain STARK tokens for successful contract deployments, declarations, and compilations.

### Unique Proposition

Devdock is the first-of-its-kind "code to earn" AI-powered VS Code extension, specifically designed for the Starknet ecosystem. It simplifies contract deployment, integrates seamlessly with your workflow, and pays you for your successful deployments.

## Features

1. **Web3 Authentication**: Uses Web3Auth with GitHub login for user sign-in and wallet creation.
2. **Integrated Development Environment**: Operates within the VS Code workspace, monitoring terminal activity and file changes.
3. **Real-Time Updates**: Tracks successful deployments, logs code content and errors to the database.
4. **Model Improvement**: Utilizes deployment data to fine-tune models, enhancing the learning curve for new developers.
5. **STARK Token Rewards**: Automatically allocates tokens via the smart contract's "assign" function post-deployment.
6. **Token Management**: Developers can view and claim their earned tokens through Devdock's platform.

## Getting Started

To start using Devdock:

1. **Install Dependencies**: 
   ```bash
   npm install
   # or
   yarn install

2.  **Start the Frontend**:
    
    bash
    
    Copy code
    
    `yarn start` 
    
    This launches the frontend platform where you can track your progress.
    
3.  **Run the Extension**:
    
    -   Navigate to the 'Run and Debug' tab in VS Code.
    -   Start the extension.

You're all set!

## Under the Hood

Here's a brief overview of how Devdock operates:

1.  **User Authentication**: Sign in via Web3Auth with your GitHub account, which also creates your wallet.
2.  **Daily Coding Activity**: Continue your regular coding tasks within the VS Code workspace.
3.  **Monitoring**: Devdock listens to terminal activity and file changes.
4.  **Data Logging**: Logs successful deployments and encountered errors.
5.  **Model Training**: Uses logged data to fine-tune models, making it easier for new developers to learn Cairo and deploy contracts.
6.  **Token Allocation**: After a successful deployment, the smart contract's "assign" function allocates tokens to your account.
7.  **Token Management**: View and claim your tokens on Devdock's platform.

## Conclusion

Devdock not only simplifies the development process but also rewards you for your efforts, making it a valuable tool for developers in the Starknet ecosystem. Let the AI handle the heavy lifting while you focus on designing state-of-the-art contracts and architectures. Happy coding and earning!


                                    +--------------------+
                                    |                    |
                                    |   VS Code          |
                                    |   Extension        |
                                    |                    |
                                    +---------+----------+
                                              |
            +---------------------------------+----------------------------------+
            |                                 |                                  |
    +-------v---------+               +-------v--------+                 +-------v--------+
    |                 |               |                |                 |                |
    |     Chat        |               | Code Completion|                 |  Web3 Login    |
    |                 |               |                |                 |                |
    +-------+---------+               +-------+--------+                 +-------+--------+
            |                                 |                                  |
            |                                 |                                  |
  +---------v------------+         +----------v-------------+        +-----------v------------+
  |                      |         |                        |        |                        |
  |  OpenAI              |         | Ollama API/Codestral   |        |   Web3 OAuth           |
  |                      |         |                        |        |                        |
  +----------+-----------+         +-----------+------------+        +------------+-----------+
             |                                   |                                  |
  +----------v-----------+         +-------------v----------+        +-------------v----------+
  |                      |         |                        |        |                        |
  |  Backend Devdock API |         |   Backend Devdock API  |        |   GitHub Login         |
  |                      |         |                        |        |                        |
  +----------------------+         +------------------------+        +-------------+----------+
                                                                                  |
                                                                                  |
                                                                          +-------v--------+
                                                                          |                |
                                                                          | Starknet Wallet|
                                                                          |     Connect    |
                                                                          |                |
                                                                          +-------+--------+
                                                                                  |
                                                                                  |
  +---------------------+                                                        |
  |                     |                                                        |
  |  Terminal Output    +--------------------------------------------------------+
  |   Monitoring        |                                                        |
  +---------------------+                                                        |
                                                                                  |
                                                                                  |
  +---------------------+                                                        |
  |                     |                                                        |
  |   Data Logging      |                                                        |
  |                     |                                                        |
  +---------------------+                                                        |
                                                                                  |
                                                                                  |
                                                                          +-------v--------+
                                                                          |                |
                                                                          |  Create        |
                                                                          |  Contracts     |
                                                                          |                |
                                                                          +-------+--------+
                                                                                  |
                                                                                  |
  +---------------------+                                                        |
  |                     |                                                        |
  | Trainer Wallet Addr +--------------------------------------------------------+
  |                     |
  +---------------------+
            |
  +---------v----------+
  |                    |
  |  Backend           |
  |                    |
  +--------------------+
            |
  +---------v----------+
  |                    |
  |  Smart Contracts   |
  |  and Token Rewards |
  |                    |
  +---------+----------+
            |
  +---------v----------+
  |                    |
  |  Assign Function   |
  |                    |
  +---------+----------+
            |
  +---------v----------+
  |                    |
  |  STARK Tokens      |
  |                    |
  +--------------------+
