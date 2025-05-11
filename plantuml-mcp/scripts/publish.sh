#!/bin/bash

# Publish script for plantuml-mcp package
# This script helps with the release process by ensuring all checks pass
# before publishing to npm

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script directory: $SCRIPT_DIR"

# Change to the parent directory (root of the project)
cd "$SCRIPT_DIR/.."
PROJECT_DIR="$(pwd)"
echo -e "${BLUE}Project directory: $PROJECT_DIR${NC}"

# Function to check if working directory is clean
check_git_status() {
  echo -e "${BLUE}Checking git status...${NC}"
  if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}Error: Working directory not clean. Please commit or stash changes first.${NC}"
    git status
    exit 1
  else
    echo -e "${GREEN}Working directory is clean.${NC}"
  fi
}

# Function to run verification
run_verify() {
  echo -e "${BLUE}Running verification...${NC}"
  
  echo -e "${YELLOW}Running lint...${NC}"
  npm run lint
  if [ $? -ne 0 ]; then
    echo -e "${RED}Lint failed. Please fix the issues and try again.${NC}"
    exit 1
  fi
  
  echo -e "${YELLOW}Running tests...${NC}"
  npm run test
  if [ $? -ne 0 ]; then
    echo -e "${RED}Tests failed. Please fix the issues and try again.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Verification passed.${NC}"
}

# Function to build the package
build_package() {
  echo -e "${BLUE}Building package...${NC}"
  npm run clean
  npm run build
  if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the issues and try again.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Build successful.${NC}"
}

# Function to publish the package
publish_package() {
  local version_type=$1
  
  echo -e "${BLUE}Publishing package with version bump: $version_type${NC}"
  
  # Bump version
  echo -e "${YELLOW}Bumping version...${NC}"
  npm version $version_type
  if [ $? -ne 0 ]; then
    echo -e "${RED}Version bump failed.${NC}"
    exit 1
  fi
  
  # Get the new version
  NEW_VERSION=$(node -p "require('./package.json').version")
  echo -e "${GREEN}New version: $NEW_VERSION${NC}"
  
  # Push to git
  echo -e "${YELLOW}Pushing to git...${NC}"
  git push && git push --tags
  if [ $? -ne 0 ]; then
    echo -e "${RED}Git push failed.${NC}"
    exit 1
  fi
  
  # Publish to npm
  echo -e "${YELLOW}Publishing to npm...${NC}"
  npm publish
  if [ $? -ne 0 ]; then
    echo -e "${RED}Npm publish failed.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Package published successfully: @brainstack/plantuml-mcp@$NEW_VERSION${NC}"
}

# Main script
main() {
  if [ $# -ne 1 ]; then
    echo -e "${RED}Usage: $0 <patch|minor|major>${NC}"
    exit 1
  fi
  
  local version_type=$1
  
  if [[ "$version_type" != "patch" && "$version_type" != "minor" && "$version_type" != "major" ]]; then
    echo -e "${RED}Invalid version type. Use patch, minor, or major.${NC}"
    exit 1
  fi
  
  # Run the steps
  check_git_status
  run_verify
  build_package
  publish_package $version_type
}

# Run the main function
main "$@"
