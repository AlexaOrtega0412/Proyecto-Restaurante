import { getToken } from './services/token';
import { getUsers } from './services/getusers';

import { ResComponent } from "./components/ResComponent.js";


const usr = document.getElementById('user');
const pwd = document.getElementById('contrasena');
const parrafo = document.getElementById('tokenn');
const userlogged = document.getElementById('userlogged');
const platos = document.getElementById('platos');

const btn = document.getElementById('login');
/**
 * Obtiene valores de usuario y contraseña para realizar el login
 * y muestra el token en pantalla.
 * * @param {string} user
 * * @param {string} pass
 */
btn.addEventListener('click', () => {
    userlogged.textContent = '';
    platos.textContent = '';

    getToken(usr.value, pwd.value);
    let tokenObtenido = JSON.stringify(localStorage.getItem("jwt"));
    parrafo.textContent = `El token es: ${tokenObtenido}`;
    
    const datosGet = getUsers();
    userlogged.textContent = `Usuario: ${datosGet.usuario.nombre} - Perfil: ${datosGet.usuario.perfil}`;
    datosGet.platos.forEach(element => {
        const li = document.createElement('li');
        li.textContent = element.nombre;
        platos.appendChild(li);
    });;
})



// brew install sqlite

// sqlite3 proyIDS.db

// CREATE TABLE usuarios (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     nombre TEXT NOT NULL,
//     clave TEXT NOT NULL,
//     perfil TEXT DEFAULT 'cliente'
// );

// INSERT INTO usuarios (nombre, clave, perfil) VALUES
// ('Carlos', 'clave1234', 'admin'),
// ('Ana', 'clave5678', 'admin'),
// ('Luis', 'clave91011', 'admin'),
// ('Marta', 'clave1213', 'admin'),
// ('Pedro', 'clave1415', 'admin');


// SELECT * FROM usuarios;


// .quit




// CREATE TABLE IF NOT EXISTS platos (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     nombre TEXT NOT NULL,
//     costo REAL NOT NULL,
//     tamano TEXT NOT NULL,
//     url_imagen TEXT NOT NULL
// );

// INSERT INTO platos (nombre, costo, tamano, url_imagen) VALUES
// ('Paella Valenciana', 15.50, 'Grande', 'paella.jpg'),
// ('Spaghetti Bolognese', 13.00, 'Mediano', 'spaghetti.jpg'),
// ('Tacos al Pastor', 7.50, 'Pequeño', 'tacos.jpg'),
// ('Sushi Roll', 18.00, 'Mediano', 'sushi.jpg'),
// ('Burrito de Pollo', 9.00, 'Grande', 'burrito.jpg'),
// ('Ensalada de Atún', 6.00, 'Pequeño', 'ensalada_atun.jpg'),
// ('Ramen', 12.50, 'Mediano', 'ramen.jpg'),
// ('Hamburguesa Vegana', 10.00, 'Grande', 'hamburguesa_vegana.jpg'),
// ('Pasta Carbonara', 14.00, 'Mediano', 'pasta_carbonara.jpg'),
// ('Poke Bowl', 11.50, 'Mediano', 'poke_bowl.jpg');


