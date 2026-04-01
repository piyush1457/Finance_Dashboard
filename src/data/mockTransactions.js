export const CATEGORIES = {
  FoodAndDining: 'Food & Dining',
  Transport: 'Transport',
  Shopping: 'Shopping',
  Entertainment: 'Entertainment',
  Healthcare: 'Healthcare',
  Salary: 'Salary',
  Freelance: 'Freelance',
  Utilities: 'Utilities',
  Rent: 'Rent',
  Subscriptions: 'Subscriptions',
};

export const PAYMENT_METHODS = {
  UPI: 'UPI',
  Card: 'Card',
  Cash: 'Cash',
  NetBanking: 'Net Banking',
};

export const initialTransactions = [
  // Jan 2025
  { id: '1', date: '2025-01-01', title: 'TechCorp Salary', amount: 85000, category: CATEGORIES.Salary, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '2', date: '2025-01-02', title: 'Apartment Rent', amount: 18000, category: CATEGORIES.Rent, type: 'expense', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '3', date: '2025-01-05', title: 'Amazon Groceries', amount: 3200, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '4', date: '2025-01-10', title: 'Electricity Bill', amount: 1500, category: CATEGORIES.Utilities, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '5', date: '2025-01-15', title: 'Netflix Subscription', amount: 649, category: CATEGORIES.Subscriptions, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '6', date: '2025-01-20', title: 'Uber Ride', amount: 350, category: CATEGORIES.Transport, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '7', date: '2025-01-25', title: 'Zomato Order', amount: 800, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },

  // Feb 2025
  { id: '8', date: '2025-02-01', title: 'TechCorp Salary', amount: 85000, category: CATEGORIES.Salary, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '9', date: '2025-02-03', title: 'Apartment Rent', amount: 18000, category: CATEGORIES.Rent, type: 'expense', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '10', date: '2025-02-08', title: 'Pharmacy', amount: 1200, category: CATEGORIES.Healthcare, type: 'expense', paymentMethod: PAYMENT_METHODS.Cash },
  { id: '11', date: '2025-02-12', title: 'Swiggy Dinner', amount: 950, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '12', date: '2025-02-14', title: 'Valentine Gift', amount: 4500, category: CATEGORIES.Shopping, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '13', date: '2025-02-18', title: 'Freelance Project', amount: 15000, category: CATEGORIES.Freelance, type: 'income', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '14', date: '2025-02-22', title: 'Movie Tickets', amount: 700, category: CATEGORIES.Entertainment, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },

  // Mar 2025
  { id: '15', date: '2025-03-01', title: 'TechCorp Salary', amount: 85000, category: CATEGORIES.Salary, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '16', date: '2025-03-02', title: 'Apartment Rent', amount: 18000, category: CATEGORIES.Rent, type: 'expense', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '17', date: '2025-03-06', title: 'Ola Cab', amount: 480, category: CATEGORIES.Transport, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '18', date: '2025-03-10', title: 'Internet Bill', amount: 999, category: CATEGORIES.Utilities, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '19', date: '2025-03-15', title: 'Spotify Premium', amount: 119, category: CATEGORIES.Subscriptions, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '20', date: '2025-03-20', title: 'Myntra Fashion', amount: 3200, category: CATEGORIES.Shopping, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '21', date: '2025-03-25', title: 'Dentist Visit', amount: 2500, category: CATEGORIES.Healthcare, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },

  // Apr 2025
  { id: '22', date: '2025-04-01', title: 'TechCorp Salary', amount: 85000, category: CATEGORIES.Salary, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '23', date: '2025-04-03', title: 'Apartment Rent', amount: 18000, category: CATEGORIES.Rent, type: 'expense', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '24', date: '2025-04-07', title: 'Freelance Design', amount: 22000, category: CATEGORIES.Freelance, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '25', date: '2025-04-12', title: 'Zomato Lunch', amount: 450, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '26', date: '2025-04-18', title: 'Train Tickets (IRCTC)', amount: 2800, category: CATEGORIES.Transport, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '27', date: '2025-04-24', title: 'Concert Tickets', amount: 5000, category: CATEGORIES.Entertainment, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '28', date: '2025-04-28', title: 'Grofers', amount: 1800, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },

  // May 2025
  { id: '29', date: '2025-05-01', title: 'TechCorp Salary', amount: 85000, category: CATEGORIES.Salary, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '30', date: '2025-05-02', title: 'Apartment Rent', amount: 18000, category: CATEGORIES.Rent, type: 'expense', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '31', date: '2025-05-05', title: 'Blinkit Groceries', amount: 1200, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '32', date: '2025-05-10', title: 'Water & Gas', amount: 800, category: CATEGORIES.Utilities, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '33', date: '2025-05-15', title: 'Netflix Subscription', amount: 649, category: CATEGORIES.Subscriptions, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '34', date: '2025-05-20', title: 'Amazon Echo', amount: 4500, category: CATEGORIES.Shopping, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '35', date: '2025-05-28', title: 'Uber Auto', amount: 150, category: CATEGORIES.Transport, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },

  // Jun 2025
  { id: '36', date: '2025-06-01', title: 'TechCorp Salary', amount: 85000, category: CATEGORIES.Salary, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '37', date: '2025-06-02', title: 'Apartment Rent', amount: 18000, category: CATEGORIES.Rent, type: 'expense', paymentMethod: PAYMENT_METHODS.NetBanking },
  { id: '38', date: '2025-06-06', title: 'Apollo Pharmacy', amount: 650, category: CATEGORIES.Healthcare, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '39', date: '2025-06-11', title: 'Swiggy Weekend', amount: 1100, category: CATEGORIES.FoodAndDining, type: 'expense', paymentMethod: PAYMENT_METHODS.UPI },
  { id: '40', date: '2025-06-15', title: 'Spotify Premium', amount: 119, category: CATEGORIES.Subscriptions, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '41', date: '2025-06-18', title: 'Decathlon Sports', amount: 2200, category: CATEGORIES.Shopping, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '42', date: '2025-06-25', title: 'Flight Tickets MMT', amount: 6500, category: CATEGORIES.Transport, type: 'expense', paymentMethod: PAYMENT_METHODS.Card },
  { id: '43', date: '2025-06-28', title: 'Freelance Bonus', amount: 9000, category: CATEGORIES.Freelance, type: 'income', paymentMethod: PAYMENT_METHODS.NetBanking },
];
