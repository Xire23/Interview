const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');

app.use(express.static('public'));

// Parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


let customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', contact: '12345678', address: '123 Main St' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', contact: '87654321', address: '456 Elm St' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', contact: '23456789', address: '789 Oak St' },
    { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', contact: '34567890', address: '321 Pine St' },
    { id: 5, name: 'Carol White', email: 'carol.white@example.com', contact: '45678901', address: '654 Maple St' },
    { id: 6, name: 'Eve Davis', email: 'eve.davis@example.com', contact: '56789012', address: '987 Birch St' },
    { id: 7, name: 'Frank Wilson', email: 'frank.wilson@example.com', contact: '67890123', address: '123 Spruce St' },
    { id: 8, name: 'Grace Lee', email: 'grace.lee@example.com', contact: '78901234', address: '456 Cedar St' },
    { id: 9, name: 'Henry Clark', email: 'henry.clark@example.com', contact: '89012345', address: '789 Ash St' },
    { id: 10, name: 'Ivy Martinez', email: 'ivy.martinez@example.com', contact: '90123456', address: '321 Walnut St' }
];


// Home Page
app.get('/', (req, res) => res.render('home', { customers }));

// Search Page
app.get('/search', (req, res) => {
    const query = req.query.searchQuery?.toLowerCase() || '';
    const filteredCustomers = customers.filter(customers =>
        customers.name.toLowerCase().includes(query) ||
        customers.email.toLowerCase().includes(query) ||
        customers.contact.includes(query) ||
        customers.address.toLowerCase().includes(query)
    );

    // Pass filteredCustomers to the view
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
app.get('/add-customer', (req, res) => res.render('form', { customer: null }));

// Add Customer Logic
app.post('/add-customer', (req, res) => {
    const newCustomer = { id: Date.now(), ...req.body };
    customers.push(newCustomer);
    res.redirect('/');
});

// Edit Customer Form
app.get('/edit-customer/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    res.render('form', { customer });
});

// Edit Customer Logic
app.post('/edit-customer/:id', (req, res) => {
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    customers[index] = { id: parseInt(req.params.id), ...req.body };
    res.redirect('/');
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


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
