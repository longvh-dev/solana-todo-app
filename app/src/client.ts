import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { serialize } from 'borsh';
import * as borsh from 'borsh';

// Define instruction layout
class AddTaskInstruction {
  content: string;
  constructor(content: string) {
    this.content = content;
  }
}

class DeleteTaskInstruction {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}

class ToggleTaskInstruction {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}

// Instruction schema
const TodoInstructionSchema = new Map<typeof AddTaskInstruction | typeof DeleteTaskInstruction | typeof ToggleTaskInstruction, any>([
  [
    AddTaskInstruction,
    {
      kind: 'struct',
      fields: [['content', 'string']],
    },
  ],
  [
    DeleteTaskInstruction,
    {
      kind: 'struct',
      fields: [['id', 'u64']],
    },
  ],
  [
    ToggleTaskInstruction,
    {
      kind: 'struct',
      fields: [['id', 'u64']],
    },
  ],
]);

export class TodoClient {
  private connection: Connection;
  private programId: PublicKey;
  private todoAccount: Keypair;

  constructor(
    connection: Connection,
    programId: PublicKey,
    todoAccount?: Keypair
  ) {
    this.connection = connection;
    this.programId = programId;
    this.todoAccount = todoAccount || Keypair.generate();
  }

  async addTask(payer: Keypair, content: string): Promise<string> {
    const instruction = new AddTaskInstruction(content);
    const data = Buffer.from([0, ...serialize(TodoInstructionSchema, instruction)]);

    const instruction_tx = new TransactionInstruction({
      keys: [
        {
          pubkey: this.todoAccount.publicKey,
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: this.programId,
      data,
    });

    const transaction = new Transaction().add(instruction_tx);
    
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer, this.todoAccount]
      );
      return signature;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  }

  async deleteTask(payer: Keypair, id: number): Promise<string> {
    const instruction = new DeleteTaskInstruction(id);
    const data = Buffer.from([1, ...serialize(TodoInstructionSchema, instruction)]);

    const instruction_tx = new TransactionInstruction({
      keys: [
        {
          pubkey: this.todoAccount.publicKey,
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: this.programId,
      data,
    });

    const transaction = new Transaction().add(instruction_tx);
    
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer, this.todoAccount]
      );
      return signature;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }

  async toggleTask(payer: Keypair, id: number): Promise<string> {
    const instruction = new ToggleTaskInstruction(id);
    const data = Buffer.from([2, ...serialize(TodoInstructionSchema, instruction)]);

    const instruction_tx = new TransactionInstruction({
      keys: [
        {
          pubkey: this.todoAccount.publicKey,
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: this.programId,
      data,
    });

    const transaction = new Transaction().add(instruction_tx);
    
    try {
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer, this.todoAccount]
      );
      return signature;
    } catch (err) {
      console.error('Error toggling task:', err);
      throw err;
    }
  }
}