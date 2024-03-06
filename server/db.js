const pg = require('pg');
const client = new pg.Client('postgres://localhost/the_acme_store');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const createTables = async()=>{
const SQL = `
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS Favorite;

CREATE TABLE "User" (
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) UNIQUE NOT NULL 
);

CREATE TABLE Product (
id UUID PRIMARY KEY,
name VARCHAR(255)
);

CREATE TABLE Favorite (
id UUID PRIMARY KEY,
product_id UUID REFERENCES Product(id) NOT NULL,
user_id UUID REFERENCES "User"(id) NOT NULL,
CONSTRAINT user_favorite UNIQUE (product_id, user_id)

);
`;

await client.query(SQL);
}

const createUser = async({username,password})=>{
    const SQL = `
    INSERT INTO "User"(id,username,password) VALUES ($1,$2,$3) RETURNING *;
    `;
    
    const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password,5)]);
    return response.rows[0];
    }

const createProduct = async({name})=>{

const SQL = `
INSERT INTO Product(id, name) VALUES ($1,$2) RETURNING *;
`;

const response = await client.query(SQL, [uuid.v4(), name]);
return response.rows[0];
}

const createFavorite = async({product_id, user_id})=>{
const SQL = `
INSERT INTO Favorite (id, product_id, user_id) VALUES ($1,$2,$3) RETURNING *
`
const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);
return response.rows[0];
}
const fetchUsers = async()=>{
const SQL = `
SELECT * FROM "User"
`;
const response = await client.query(SQL);
return response.rows;

}

const deleteFavorite = async(id)=>{
    const SQL = `
    DELETE FROM Favorite
    WHERE id = $1
    `;

    await client.query(SQL, [id]);

}

const fetchProducts = async()=>{
    const SQL = `
    SELECT * FROM Product
    `;
    const response = await client.query(SQL);
    return response.rows;
    
    }
const fetchFavorites = async(id) =>{
    const SQL = `
    SELECT * FROM Favorite
    WHERE user_id = $1
    `;

    const response = await client.query(SQL, [id]);
    return response.rows;
}

module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    deleteFavorite
};