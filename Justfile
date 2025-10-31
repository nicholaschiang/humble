# just manual: https://github.com/casey/just

_list:
    @just --list

# Update all dependencies
[group('core')]
upgrade:
    pnpm up --recursive
    pnpm install

# Install all dependencies
[group('core')]
install *FLAGS:
    pnpm install {{FLAGS}}

# Run all enforced linters
[group('core')]
check:
    pnpm lint --fix
    pnpm prettier --check .
    pnpm typecheck

# Run code formatters
[group('core')]
format:
    pnpm prettier -w .

# Start the application
[group('core')]
start:
    pnpm start
