var express = require('express');
const axios = require('axios');
var app = express();

// api default
app.get('/', function (req, res) {
  res.send('The backend is running!');
});

// api get all items 
app.get('/api/items', function (req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); 

    axios.get('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q + '&limit=5')
        .then(function (obj) {
            let products = obj.data.results.map(function (result) {
                let rows = {
                    id: result.id,
                    author: {
                        name: result.title,
                        lastname: result.title
                    },
                    categories: [],
                    items: [
                        {
                            id: "",
                            title: "",
                            price: result.price,
                            picture: result.thumbnail,
                            condition: "",
                            free_shipping: result.shipping.free_shipping
                        }
                    ],
                    address: result.address.state_name
                };
                return rows;
            });
            res.json(products);
        })
        .catch(function (error) {
            res.json({ 'status': false });
        });
});

// api get items by id
app.get('/api/items/:id', function (req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    axios.get('https://api.mercadolibre.com/items/' + req.params.id)
        .then(function (response) {
            let items = response.data;
            axios.get('https://api.mercadolibre.com/items/' + req.params.id + '/description')
                .then(function (response) {
                    let description = response.data;
                    let rows = {
                        author: {
                            name: items.title,
                            lastname: items.subtitle
                        },
                        items: [
                            {
                                id: items.id,
                                title: items.title,
                                price: {
                                    currency: "",
                                    amount: "",
                                    decimals: "",
                                    value: items.price
                                },
                                picture: items.pictures,
                                condition: items.condition,
                                free_shipping: items.shipping.free_shipping,
                                sold_quantity: items.sold_quantity,
                                description: description.plain_text,
                                permalink: items.permalink
                            }
                        ]
                    };
                    res.json(rows);
                })
                .catch(function (error) {
                    res.json({ 'status': false, 'message': 'API Not Found' });
                });
        })
        .catch(function (error) {
            res.json({ 'status': false, 'message': 'API Not Found' });
        });
});

// port listen for backend
app.listen(5000, function () {
    console.log('Backend app listening on port 5000!');
});