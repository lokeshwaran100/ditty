use std::collections::HashMap;

#[derive(Debug, Clone)]
struct RealEstateCrowdfundingProject {
    id: u32,
    name: String,
    description: String,
    goal_amount: u32,
    current_amount: u32,
    investors: Vec<String>,
}

impl RealEstateCrowdfundingProject {
    fn new(id: u32, name: String, description: String, goal_amount: u32) -> Self {
        Self {
            id,
            name,
            description,
            goal_amount,
            current_amount: 0,
            investors: Vec::new(),
        }
    }

    fn invest(&mut self, investor: String, amount: u32) {
        self.investors.push(investor);
        self.current_amount += amount;
    }

    fn is_funded(&self) -> bool {
        self.current_amount >= self.goal_amount
    }

    fn get_current_amount(&self) -> u32 {
        self.current_amount
    }

    fn get_investors(&self) -> Vec<String> {
        self.investors.clone()
    }
}

fn main() {
    let mut projects = HashMap::new();

    // Create a new real estate crowdfunding project.
    let project = RealEstateCrowdfundingProject::new(1, "My Real Estate Project", "This is my real estate project.", 100000);

    // Add the project to the map.
    projects.insert(1, project);

    // Invest in the project.
    projects.get_mut(&1).unwrap().invest("Alice", 1000);

    // Check if the project is funded.
    let is_funded = projects.get(&1).unwrap().is_funded();

    // Get the current amount invested in the project.
    let current_amount = projects.get(&1).unwrap().get_current_amount();

    // Get the list of investors in the project.
    let investors = projects.get(&1).unwrap().get_investors();

    println!("Is funded: {}", is_funded);
    println!("Current amount: {}", current_amount);
    println!("Investors: {:?}", investors);
}
