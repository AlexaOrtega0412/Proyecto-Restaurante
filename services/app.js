// brew install sqlite


// sqlite3 proyIDS.db


// CREATE TABLE usuarios (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     nombre TEXT NOT NULL,
//     clave TEXT NOT NULL
// );




// INSERT INTO usuarios (nombre, clave) VALUES
// ('Juan', 'clave123'),
// ('Ana', 'secreta456'),
// ('Luis', 'qwerty789'),
// ('Marta', 'contraseña101'),
// ('Carlos', 'pass2023');


// SELECT * FROM usuarios;


// .quit


CREATE TABLE IF NOT EXISTS platos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    costo REAL NOT NULL,
    tamano TEXT NOT NULL,
    url_imagen TEXT NOT NULL
);

INSERT INTO platos (nombre, costo, tamano, url_imagen) VALUES
('Paella Valenciana', 15.50, 'Grande', 'paella.jpg'),
('Spaghetti Bolognese', 13.00, 'Mediano', 'spaghetti.jpg'),
('Tacos al Pastor', 7.50, 'Pequeño', 'tacos.jpg'),
('Sushi Roll', 18.00, 'Mediano', 'sushi.jpg'),
('Burrito de Pollo', 9.00, 'Grande', 'burrito.jpg'),
('Ensalada de Atún', 6.00, 'Pequeño', 'ensalada_atun.jpg'),
('Ramen', 12.50, 'Mediano', 'ramen.jpg'),
('Hamburguesa Vegana', 10.00, 'Grande', 'hamburguesa_vegana.jpg'),
('Pasta Carbonara', 14.00, 'Mediano', 'pasta_carbonara.jpg'),
('Poke Bowl', 11.50, 'Mediano', 'poke_bowl.jpg');



ALTER TABLE usuarios ADD COLUMN perfil TEXT DEFAULT 'cliente';
