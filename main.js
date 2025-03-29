
import "./components/Login.js";
import "./components/ResComponent.js";


const loginComponent = document.querySelector("res-login");

loginComponent.addEventListener("login-success", (event) => {

  loginComponent.style.display = "none";
  
  
  const dashboard = document.createElement("res-component");
  
  
  dashboard.token = event.detail.token;
  dashboard.loggedUser = event.detail.usuario;
  dashboard.platos = event.detail.platos;
  

  document.body.appendChild(dashboard);
});




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


