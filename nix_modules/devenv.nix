{inputs, ...}: {
  imports = [
    inputs.devenv.flakeModule
  ];
  perSystem = {pkgs, ...}: {
    devenv = {
      modules = [
        inputs.env-help.devenvModule
      ];
      shells.default = {
        enterShell = ''
          printf "\033[0;1;36mPLATEMATE DEVELOPMENT ENVIRONMENT\033[0m\n"
          env-help
        '';

        env-help.enable = true;
        languages = {
          go.enable = true;
          javascript = {
            enable = true;
          };
          nix.enable = true;
          typescript.enable = true;
        };

        packages = with pkgs; [
          nodePackages.eslint
          nodePackages.prettier
          bun
          git
        ];

        scripts = {
          "backend-lint" = {
            description = "Lints backend code.";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              go mod tidy
              go fmt ./...
              go vet ./...
              ${pkgs.golangci-lint}/bin/golangci-lint run ./...
            '';
          };
          "backend-run" = {
            description = "Runs the backend server in development mode.";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go mod tidy" -- go mod tidy
              ${pkgs.rubyPackages.dotenv}/bin/dotenv -i -f ""$DEVENV_ROOT"/.env" -- \
              ${pkgs.watchexec}/bin/watchexec -r -e go -- \
              go run cmd/server/main.go
            '';
          };
          "backend-test" = {
            description = "Tests backend code.";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              go test ./...
            '';
          };
          "database-script" = {
            description = "Runs a script against the connected Database";
            exec = ''
              cd "$DEVENV_ROOT"/backend
              ${pkgs.gum}/bin/gum spin --spinner dot --title "go mod tidy" -- go mod tidy
              ${pkgs.rubyPackages.dotenv}/bin/dotenv -i -f ""$DEVENV_ROOT"/.env" -- \
              go run cmd/db/example/main.go
            '';
          };
          "frontend-lint" = {
            description = "Lints frontend code.";
            exec = ''
              cd "$DEVENV_ROOT"/frontend
              prettier . --write
              ${pkgs.bun}/bin/npm run lint
            '';
          };
          "frontend-run" = {
            description = "Runs the frontend server in development mode.";
            exec = ''
              cd "$DEVENV_ROOT"/frontend
              bunx expo start
            '';
          };
         "frontend-run-wsl" = {
            description = "Runs the frontend server in tunnel mode.";
            exec = ''
              cd "$DEVENV_ROOT"/frontend
              bunx expo start --tunnel
            '';
         };
        "frontend-test" = {
            description = "Runs the frontend tests.";
            exec = ''
              cd "$DEVENV_ROOT"/frontend
              bun run test
            '';
         };
        };
      };
    };
  };
}
