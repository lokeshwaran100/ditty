use std::collections::HashMap;

#[derive(Debug, Clone)]
struct ChitFund {
    name: String,
    members: Vec<String>,
    current_pot: u32,
    current_member: String,
}

impl ChitFund {
    fn new(name: String, members: Vec<String>) -> Self {
        Self {
            name,
            members,
            current_pot: 0,
            current_member: members[0].to_string(),
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
            self.current_pot += 100; // Assume each member contributes 100 USD.
        }
    }

    fn receive_payout(&mut self) {
        let payout_amount = self.current_pot;
        self.current_pot = 0;

        // TODO: Implement a mechanism to select the next member to receive the payout.

        // Update the current member.
        self.current_member = self.members[0].to_string();
    }

    fn get_current_pot(&self) -> u32 {
        self.current_pot
    }

    fn get_current_member(&self) -> String {
        self.current_member.to_string()
    }
}

fn main() {
    let mut chit_fund = ChitFund::new(String::from("My Chit Fund"), Vec::from(["Alice", "Bob", "Carol"]));

    chit_fund.contribute();

    // Receive a payout from the chit fund.
    chit_fund.receive_payout();

    println!("Current pot: {}", chit_fund.get_current_pot());
    println!("Current member: {}", chit_fund.get_current_member());
}
