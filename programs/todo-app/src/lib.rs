use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

declare_id!("H1V7y7UgVdFovs7gdbCo4KtsH95LYAiE46Yz1Wvki6fa");

// Program entrypoint
entrypoint!(process_instruction);

// Task structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TodoTask {
    pub id: u64,
    pub content: String,
    pub completed: bool,
}

// List structure to store multiple tasks
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TodoList {
    pub tasks: Vec<TodoTask>,
    pub last_id: u64,
}

// Instruction enum
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TodoInstruction {
    AddTask { content: String },
    DeleteTask { id: u64 },
    ToggleTask { id: u64 },
}

// Program logic
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = TodoInstruction::try_from_slice(instruction_data)?;
    let accounts_iter = &mut accounts.iter();
    
    // Get account info
    let todo_account = next_account_info(accounts_iter)?;
    
    // Verify account ownership
    if todo_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    
    // Load or initialize todo list
    let mut todo_list = if todo_account.data_len() > 0 {
        TodoList::try_from_slice(&todo_account.data.borrow())?
    } else {
        TodoList {
            tasks: Vec::new(),
            last_id: 0,
        }
    };
    
    match instruction {
        TodoInstruction::AddTask { content } => {
            let task = TodoTask {
                id: todo_list.last_id + 1,
                content,
                completed: false,
            };
            todo_list.tasks.push(task);
            todo_list.last_id += 1;
            msg!("Task added successfully!");
        }
        TodoInstruction::DeleteTask { id } => {
            if let Some(index) = todo_list.tasks.iter().position(|task| task.id == id) {
                todo_list.tasks.remove(index);
                msg!("Task deleted successfully!");
            }
        }
        TodoInstruction::ToggleTask { id } => {
            if let Some(task) = todo_list.tasks.iter_mut().find(|task| task.id == id) {
                task.completed = !task.completed;
                msg!("Task status toggled successfully!");
            }
        }
    }
    
    // Serialize and save the updated list
    todo_list.serialize(&mut &mut todo_account.data.borrow_mut()[..])?;
    
    Ok(())
}