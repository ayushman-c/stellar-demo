#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Env, String, Vec};

#[contracttype]
pub struct Message {
    pub wallet: String,
    pub text: String,
    pub timestamp: u64,
}

#[contract]
pub struct Guestbook;

#[contractimpl]
impl Guestbook {
    pub fn add_message(env: Env, wallet: String, text: String, timestamp: u64) {
        // Validate message length (max 200 characters)
        if text.len() == 0 {
            panic!("message cannot be empty");
        }
        if text.len() > 200 {
            panic!("message exceeds maximum length of 200 characters");
        }

        // Get existing messages or create new vector
        let mut messages: Vec<Message> = env
            .storage()
            .instance()
            .get(&String::from_str(&env, "messages"))
            .unwrap_or(vec![&env]);

        // Add new message
        messages.push_back(Message {
            wallet,
            text,
            timestamp,
        });

        // Store updated messages
        env.storage()
            .instance()
            .set(&String::from_str(&env, "messages"), &messages);
    }

    pub fn get_messages(env: Env) -> Vec<Message> {
        env.storage()
            .instance()
            .get(&String::from_str(&env, "messages"))
            .unwrap_or(vec![&env])
    }
}
