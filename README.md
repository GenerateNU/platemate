# PlateMate

PlateMate is helping empower resturants using data driven insights

# Tech Stack

-   The back end is written in Go and uses Fiber as a web framework for efficient routing.
-   The database utilized MongoDB Atlas
-   The front end is React Native written with TypeScript using Expo as a build tool to support both iOS and Android users

# Environment Setup

This guide assumes that you are using Linux/MacOS. **If you are using Windows, please install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).**

Clone the repository by running `git clone https://github.com/GenerateNU/platemate.git`

## NIX Installation (Recommended)

1. [Install Nix](https://zero-to-nix.com/start/install)
    <!-- markdownlint-disable MD013 -->
    ```sh
    curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
    ```
    <!-- markdownlint-enable MD013 -->

-   Type in computer password if prompted
-   Say yes to prompt

2. In a new terminal activate the development environment by running the following:

<!-- markdownlint-disable MD013 -->

```sh
nix develop --impure
```

<!-- markdownlint-enable MD013 -->

### If NIX does not work (Ask TL first)

-   Ask Tech Lead for Help first if Nix is not working
-   If all else fails follow the steps in ManualInstall.md
