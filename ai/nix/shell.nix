let
  pkgs = import <nixpkgs> {};
  python = pkgs.python3;  # This will use default Python version
in pkgs.mkShell {
  packages = [
    python
    python.pkgs.pip
    python.pkgs.setuptools
    python.pkgs.wheel
    pkgs.stdenv.cc.cc.lib  # For C libraries
    
  ];
  
  shellHook = ''
    # Create virtual environment if it doesn't exist
    if [ ! -d .venv ]; then
      ${python}/bin/python -m venv .venv
    fi
    
    # Activate the virtual environment
    source .venv/bin/activate
    
    export PATH="$PATH:$(pwd)/backend"
    export PYTHONPATH="$(pwd)/backend"
    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [pkgs.stdenv.cc.cc]}:$LD_LIBRARY_PATH
    
    # Install packages if not already installed
    pip install pandas requests numpy torch torchvision torchaudio pymongo python-dotenv openai fastapi uvicorn transformers datasets sentencepiece
  '';
}
