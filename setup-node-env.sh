#!/bin/bash

# Setup Node.js environment using nvm
# This script loads nvm and makes Node.js/npm available in the current shell

echo "Setting up Node.js environment..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Check if nvm is loaded
if command -v nvm &> /dev/null; then
    echo "✅ nvm is loaded (version: $(nvm --version))"
    echo "✅ Node.js version: $(node --version)"
    echo "✅ npm version: $(npm --version)"
    echo ""
    echo "Available Node.js versions:"
    nvm list
    echo ""
    echo "🎉 Node.js environment is ready!"
    echo ""
    echo "Useful nvm commands:"
    echo "  nvm install node          # Install latest Node.js"
    echo "  nvm install --lts         # Install latest LTS"
    echo "  nvm install 18.17.0       # Install specific version"
    echo "  nvm use 18.17.0           # Switch to specific version"
    echo "  nvm list                  # List installed versions"
    echo "  nvm list-remote           # List available versions"
else
    echo "❌ Failed to load nvm. Please check your installation."
    exit 1
fi
