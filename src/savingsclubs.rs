use std::collections::HashMap;

#[derive(Debug, Clone)]
struct SavingsClub {
    name: String,
    members: Vec<String>,
    current_savings: u32,
    contribution_amount: u32,
    contribution_frequency: String,
}

impl SavingsClub {
    fn new(name: String, members: Vec<String>, contribution_amount: u32, contribution_frequency: String) -> Self {
        Self {
            name,
            members,
            current_savings: 0,
            contribution_amount,
            contribution_frequency,
        }
    }

    fn add_member(&mut self, member: String) {
        self.members.push(member);
    }

    fn remove_member(&mut self, member: String) {
        let index = self.members.iter().position(|m| *m == member).unwrap();
        self.members.remove(index);
    }

    fn contribute(&mut self) {
        for member in &self.members {
            self.current_savings += self.contribution_amount;
        }
    }

    fn withdraw(&mut self, amount: u32) -> Result<(), String> {
        if amount > self.current_savings {
            return Err(String::from("Not enough funds"));
        }

        self.current_savings -= amount;
        Ok(())
    }

    fn get_current_savings(&self) -> u32 {
        self.current_savings
    }
}

fn main() {
    let mut savings_club = SavingsClub::new(String::from("My Savings Club"), Vec::new(), 100, String::from("Monthly"));

    savings_club.add_member(String::from("Alice"));
    savings_club.add_member(String::from("Bob"));
    savings_club.add_member(String::from("Carol"));

    savings_club.contribute();

    // Withdraw 500 USD from the savings club.
    let result = savings_club.withdraw(500);

    if let Err(error) = result {
        println!("Error: {}", error);
    } else {
        println!("Successfully withdrew 500 USD from the savings club.");
    }

    println!("Current savings: {}", savings_club.get_current_savings());
}
