# Setting up Pearl for development on Ubuntu

### System dependencies

## 1. Node Version Manager (NVM)

NVM is a version manager for Node.js, allowing you to switch between different versions of Node.js.

```bash
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
```

## 3. Node.js

```bash
nvm install
nvm use
```

## 4. Yarn

Yarn is the package manager used for dependency management of the Electron app and NextJS frontend.

```bash
npm install --global yarn
```

## 5. Python

Use Python 3.10 for the project.

```bash
sudo apt install python3.10
```

## 6. Pipx

```bash
sudo apt install pipx
```

## 7. Poetry

```bash
pipx install poetry==1.8.5
```

If prompted to add the `poetry` command to your shell's config file, accept the prompt.

### Installing project dependencies

The `install-deps` script will install the dependencies for all parts of the project.
The Electron app, the NextJS frontend, and the Python backend.

```bash
yarn install-deps
```

### Setup the .env file

Duplicate the `.env.example` file and rename it to `.env`.

```bash
cp .env.example .env
```

Then fill in the required environment variables.

- `NODE_ENV` - Set to `development` for development. `production` is only used for production builds built through the release script.
- `FORK_URL` - Set to your desired HTTP RPC endpoint.
- `DEV_RPC` - Set to the same value as `FORK_URL`.

### Run the project

```bash
yarn dev
```
