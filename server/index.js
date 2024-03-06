const {client, createTables,createUser, createProduct,fetchUsers,fetchProducts, createFavorite, fetchFavorites, deleteFavorite} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('morgan')('dev'));

app.get('/api/users', async (req,res,next)=>{
    try{
        res.send(await fetchUsers());
    }

    catch(err){
        next(err);
    }

});
app.get('/api/products', async (req,res,next)=>{
    try{
        res.send(await fetchProducts());
    }

    catch(err){
        next(err);
    }

});
app.get('/api/users/:id/favorites', async (req,res,next)=>{
    try{
        res.send(await fetchFavorites(req.params.id));
    }

    catch(err){
        next(err);
    }

});


app.post('/api/favorite/:product_id/users/:user_id', async(req,res,next)=>{

    try{
        res.status(201).send(await createFavorite({product_id: req.params.product_id, user_id: req.params.user_id}))
    }

    catch(err){

        next(err)
    }

});

app.delete('/api/favorites/:id', async (req,res,next)=>{
    try{
        res.send(await deleteFavorite(req.params.id))
    }

    catch(err){

        next(err);
    }

})
const init = async()=>{
await client.connect();
console.log("connected to database");

await createTables();
console.log("tables created");

const [julie, alec, computer] = await Promise.all([
    createUser({username: 'julie', password: 'password1'}),
    createUser({username: 'alec', password: 'uglyguy23'}),
    createProduct({name:'computer'})
]);

console.log(julie.id);
console.log(alec.id);
console.log(computer.id)

console.log(await fetchUsers());

console.log(await fetchProducts());

const favorites = await Promise.all([
    createFavorite({product_id: computer.id, user_id: julie.id})
])

console.log(await fetchFavorites(julie.id));



const port =  process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));

}

init();
