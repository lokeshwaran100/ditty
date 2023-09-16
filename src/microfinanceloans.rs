use std::collections::HashMap;

#[derive(Debug, Clone)]
struct MicrofinanceLoan {
    id: u32,
    borrower: String,
    amount: u32,
    interest_rate: f32,
    term: u32,
    monthly_payment: f32,
}

impl MicrofinanceLoan {
    fn new(id: u32, borrower: String, amount: u32, interest_rate: f32, term: u32) -> Self {
        let monthly_interest_rate = interest_rate / 12.0;
        let number_of_payments = term * 12;
        let monthly_payment = amount * (monthly_interest_rate * (1.0 + monthly_interest_rate).powf(number_of_payments) / ((1.0 + monthly_interest_rate).powf(number_of_payments) - 1.0));

        Self {
            id,
            borrower,
            amount,
            interest_rate,
            term,
            monthly_payment,
        }
    }
}

fn main() {
    let mut loans = HashMap::new();

    // Create a new microfinance loan.
    let loan = MicrofinanceLoan::new(1, "Alice", 10000, 0.05, 5);

    // Add the loan to the map.
    loans.insert(1, loan);

    // Get the loan by ID.
    let loan = loans.get(&1).unwrap();

    // Print the loan details.
    println!("Loan ID: {}", loan.id);
    println!("Borrower: {}", loan.borrower);
    println!("Amount: {}", loan.amount);
    println!("Interest rate: {}", loan.interest_rate);
    println!("Term: {}", loan.term);
    println!("Monthly payment: {}", loan.monthly_payment);
}
