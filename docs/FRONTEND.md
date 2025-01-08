### Frontend Setup

**Please set up the backend before proceeding.**

### Configure Environment Variables
```shell
# Make an .env file in the frontend directory using the template in .env.example.
cd frontend && cp ../.env.example .env

# Configure your environment variables in your IDE or using a command line text editor.
vim .env 
```

### Enter the Development Environment
```shell
# Enter the development environment in the root directory.
cd ../ && nix develop --impure
```

### Install Frontend Dependencies
```shell
# Use bun to install frontend dependencies.
cd frontend && bun install
```

### Ensure the backend is running
```shell
# Create *another terminal window* and run the following:
backend-run
```

### Run the frontend
```shell
frontend run
```

Finally, you can scan the QR code with the Expo Go app installed to view a development build with hot reloading.
You can also use iOS/Android simulators to simulate & test the app on your computer.