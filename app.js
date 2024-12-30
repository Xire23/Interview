const express = require('express');
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine
app.set('view engine', 'ejs');

// Sample customers data
let customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', contact: '12345678', address: '123 Main St' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', contact: '87654321', address: '456 Elm St' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', contact: '23456789', address: '789 Oak St' },
];

// Home Page - List of Customers
app.get('/', (req, res) => {
    res.render('home', { customers });
});

// Search Customers
app.get('/search', (req, res) => {
    const query = req.query.searchQuery?.toLowerCase() || '';
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.contact.includes(query) ||
        customer.address.toLowerCase().includes(query)
    );
    res.render('details', { customers: filteredCustomers });
});

// View Customer Details
app.get('/customer/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (customer) {
        res.render('customerDetails', { customer });
    } else {
        res.status(404).send('Customer not found');
    }
});

// Add Customer Form
app.get('/add-customer', (req, res) => {
    res.render('form', { customer: null });
});

// Add Customer Logic
app.post('/add-customer', (req, res) => {
    const newCustomer = { id: Date.now(), ...req.body };
    customers.push(newCustomer);
    res.redirect('/');
});

// Edit Customer Form
app.get('/edit-customer/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (customer) {
        res.render('form', { customer });
    } else {
        res.status(404).send('Customer not found');
    }
});

// Edit Customer Logic
app.post('/edit-customer/:id', (req, res) => {
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        customers[index] = { id: parseInt(req.params.id), ...req.body };
        res.redirect('/');
    } else {
        res.status(404).send('Customer not found');
    }
});

// Delete Customer
app.get('/delete/:id', (req, res) => {
    const customerIndex = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
        res.redirect('/');
    } else {
        res.status(404).send('Customer not found');
    }
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
