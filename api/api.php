<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejar preflight (solicitudes OPTIONS de CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$secretKey = "tu_clave_secreta";
$host = "127.0.0.1";
$dbname = "proyectocells";
$username = "root";
$password = "";

// Conexión a la base de datos
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

// Verificar si la solicitud es POST (login) o GET (requiere token)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Procesar la solicitud POST para login
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["usuario"]) || !isset($data["clave"])) {
        echo json_encode(["error" => "Faltan campos"]);
        exit;
    }

    // Buscar usuario en la base de datos
    $stmt = $pdo->prepare("SELECT id_usuario, usuario, clave FROM usuarios WHERE usuario = ?");
    $stmt->execute([$data["usuario"]]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $data["clave"] === $user["clave"]) {
        // Generar JWT
        $payload = [
            "id" => $user["id_usuario"],
            "usuario" => $user["usuario"],
            "exp" => time() + 3600 // Expira en 1 hora
        ];
        $jwt = JWT::encode($payload, $secretKey, 'HS256');
        echo json_encode(["token" => $jwt]);
    } else {
        echo json_encode(["error" => "Usuario o contraseña incorrectos"]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Verificar el encabezado Authorization (token JWT) para las solicitudes GET
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        // Extraer el token del encabezado Authorization
        list($jwt) = sscanf($authHeader, 'Bearer %s');

        if ($jwt) {
            try {
                // Decodificar el token
                $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));

                // Si el token es válido, procedemos con la lógica de consulta
                // En este caso, obtener los usuarios
                $stmt = $pdo->prepare("SELECT id_usuario, usuario FROM usuarios");
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(["usuarios" => $users]);

            } catch (Exception $e) {
                echo json_encode(["error" => "Token no válido o expirado"]);
            }
        } else {
            echo json_encode(["error" => "Token no proporcionado"]);
        }
    } else {
        echo json_encode(["error" => "No se recibió el encabezado Authorization"]);
    }
} else {
    echo json_encode(["error" => "Método no permitido"]);
};

