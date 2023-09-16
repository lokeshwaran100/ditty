use std::collections::HashMap;

#[derive(Debug, Clone)]
struct SmallBusinessLoan {
    amount: u32,
    interest_rate: f32,
    term: u32,
    monthly_payment: f32,
}

impl SmallBusinessLoan {
    fn new(amount: u32, interest_rate: f32, term: u32) -> Self {
        let monthly_interest_rate = interest_rate / 12.0;
        let number_of_payments = term * 12;
        let monthly_payment = amount * (monthly_interest_rate * (1.0 + monthly_interest_rate).powf(number_of_payments) / ((1.0 + monthly_interest_rate).powf(number_of_payments) - 1.0));

        Self {
            amount,
            interest_rate,
            term,
            monthly_payment,
        }
    }
}

fn main() {
    let loan = SmallBusinessLoan::new(100000, 0.05, 5);

    println!("Loan amount: {}", loan.amount);
    println!("Interest rate: {}", loan.interest_rate);
    println!("Term: {}", loan.term);
    println!("Monthly payment: {}", loan.monthly_payment);
}
