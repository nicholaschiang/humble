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

# Add a new dependency, ensuring Expo compatibility
[group('core')]
add *FLAGS:
    pnpm expo install {{FLAGS}}

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

# Check components are setup correctly
[group('components')]
check-components:
    pnpm dlx @react-native-reusables/cli@latest doctor

# Add a new component, see https://reactnativereusables.com
[group('components')]
add-component *COMPONENTS:
    pnpm dlx @react-native-reusables/cli@latest add {{COMPONENTS}}

# Login to the Supabase CLI
[group('database')]
login:
    pnpm supabase login

# Link your Supabase project
[group('database')]
link:
    pnpm supabase link

# Generate schema types from the linked project
[group('database')]
gen:
    pnpm supabase gen types typescript --linked --schema public > src/lib/database.types.ts
    pnpm prettier -w src/lib/database.types.ts

# Generate schema types from the local dev database
[group('database')]
gen-local:
    pnpm supabase gen types typescript --local --schema public > src/lib/database.types.ts
    pnpm prettier -w src/lib/database.types.ts
