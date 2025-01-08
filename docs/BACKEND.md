### Backend Setup

**If Nix doesn't work, Slack a TL for help.**

### Configure Environment Variables
```shell
# Make an .env file in the backend directory using the template in .env.example.
cd backend && cp ../.env.example .env

# Configure your environment variables in your IDE or using a command line text editor.
vim .env 
```

### Enter the Development Environment
```shell
nix develop --impure
```

### Install Backend Dependencies
```shell
cd backend && go mod download
```

### Run the backend
```shell
backend-run
```