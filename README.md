# Solana To-Do App

A decentralized To-Do application built on the Solana blockchain. This application allows users to create, toggle, and delete tasks in a decentralized manner.

## Features

- Add new tasks
- Toggle task completion status
- Delete existing tasks
- Persistent storage on Solana blockchain
- Devnet deployment

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Rust](https://rustup.rs/)
- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html)

## Project Structure

```
solana-todo/
├── programs/
│   └── src/
│       └── lib.rs         # Solana program (smart contract)
├── app/
│   ├── src/
│   │   └── client.ts      # Client implementation
│   └── tests/
│       └── todo.test.ts   # Test suite
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/solana-todo.git
cd solana-todo
```

2. Install dependencies:
```bash
npm install
```

3. Build the Solana program:
```bash
cargo build-bpf
```

4. Deploy to devnet:
```bash
solana program deploy ./target/deploy/solana_todo.so
```

5. Update the program ID in `client.ts` and `todo.test.ts` with your deployed program ID.

## Running Tests

```bash
npm test
```

## Usage

1. Connect to Solana devnet:
```bash
solana config set --url devnet
```

2. Create a new keypair:
```bash
solana-keygen new
```

3. Add a new task:
```typescript
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const programId = new PublicKey('your_program_id');
const todoClient = new TodoClient(connection, programId);

// Add a task
await todoClient.addTask(payer, 'Complete Solana tutorial');
```

## Program Instructions

The program supports three main instructions:

1. `AddTask`: Creates a new task with the given content
2. `ToggleTask`: Toggles the completion status of a task
3. `DeleteTask`: Removes a task from the list

## Security Considerations

- The program includes basic ownership checks
- Each transaction requires proper signing
- Account data validation is implemented

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Solana Foundation for their excellent documentation
- The Solana development community

## Support

For support, please open an issue in the GitHub repository or reach out to the maintainers.
