{ lib, python3Packages }:
with python3Packages;
buildPythonApplication {
  pname = "demo";
  version = "1.0";

  propagatedBuildInputs = [ pymongo dotenv fastapi uvicorn ];

  src = ./.;
}
