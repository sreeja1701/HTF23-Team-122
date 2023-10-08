// Define an object to encapsulate the application data and functions
const app = {
    expenses: [],
    totalAmount: 0,
    budget: 0,
    categorySelect: document.getElementById('category-select'),
    amountInput: document.getElementById('amount-input'),
    dateInput: document.getElementById('date-input'),
    addBtn: document.getElementById('add-btn'),
    expensesTableBody: document.getElementById('expense-table-body'),
    totalAmountCell: document.getElementById('total-amount'),
    budgetInput: document.getElementById('budget-input'),
    budgetCell: document.getElementById('budget-amount'),
    startDateInput: document.getElementById('start-date'),
    endDateInput: document.getElementById('end-date'),
    filterBtn: document.getElementById('filter-btn'),
    categorySummary: document.getElementById('category-summary'),

    // Initialize the app
    init: function () {
        this.addBtn.addEventListener('click', this.addExpense.bind(this));
        this.filterBtn.addEventListener('click', this.filterExpenses.bind(this));
        this.budgetInput.addEventListener('input', this.updateBudget.bind(this));

        // Initially, call the function to set up the table and total amount
        this.updateTable();
        this.updateBudget();
    },

    // Function to add an expense
    addExpense: function () {
        const category = this.categorySelect.value;
        const amount = Number(this.amountInput.value);
        const date = this.dateInput.value;

        if (category === '') {
            alert('Please select a category');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (date === '') {
            alert('Please select a date');
            return;
        }
        this.expenses.push({ category, amount, date });

        this.totalAmount += amount;
        this.totalAmountCell.textContent = this.totalAmount;

        this.updateTable();
        this.updateCategoryBreakdown();
    },

    // Function to update the expenses table
    updateTable: function () {
        // Clear the table first
        this.expensesTableBody.innerHTML = '';

        for (const expense of this.expenses) {
            const newRow = this.expensesTableBody.insertRow();
            const categoryCell = newRow.insertCell();
            const amountCell = newRow.insertCell();
            const dateCell = newRow.insertCell();
            const deleteCell = newRow.insertCell();
            const deleteBtn = document.createElement('button');

            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function () {
                const index = app.expenses.indexOf(expense);
                if (index !== -1) {
                    app.totalAmount -= app.expenses[index].amount;
                    app.totalAmountCell.textContent = app.totalAmount;
                    app.expenses.splice(index, 1);
                    app.updateTable();
                    app.updateCategoryBreakdown();
                }
            });

            categoryCell.textContent = expense.category;
            amountCell.textContent = expense.amount;
            dateCell.textContent = expense.date;
            deleteCell.appendChild(deleteBtn);
        }
    },

    // Function to filter expenses by date range
    filterExpenses: function () {
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);
        const filteredExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
        this.updateTable(filteredExpenses);
    },

    // Function to update the category breakdown
    updateCategoryBreakdown: function () {
        const categoryMap = {};

        // Calculate totals for each category
        for (const expense of this.expenses) {
            if (!categoryMap[expense.category]) {
                categoryMap[expense.category] = 0;
            }
            categoryMap[expense.category] += expense.amount;
        }

        // Update the category summary
        this.categorySummary.innerHTML = '';

        for (const category in categoryMap) {
            const listItem = document.createElement('li');
            listItem.textContent = `${category}: $${categoryMap[category].toFixed(2)}`;
            this.categorySummary.appendChild(listItem);
        }
    },

    // Function to update the budget
    updateBudget: function () {
        this.budget = Number(this.budgetInput.value);
        this.budgetCell.textContent = this.budget.toFixed(2);
    },
};

// Initialize the application
app.init();
