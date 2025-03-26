<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");  

// Si es una solicitud OPTIONS (preflight), solo devolver una respuesta vacía
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit;}

require_once 'vendor/autoload.php';

use \Firebase\JWT\JWT;

// Función para decodificar el JWT
function decodeJWT($jwt) {
    $key = "clave_secreta"; // Usa tu clave secreta para verificar el token
    try {
        // Intentamos decodificar el JWT
        $decoded = JWT::decode($jwt, $key);  // Solo pasamos el JWT y la clave secreta
        return (object) $decoded;  // Convertimos el resultado en un objeto
    } catch (Exception $e) {
        // Si ocurre un error en la decodificación, capturamos el error
        return ['error' => 'Error en la decodificación del token: ' . $e->getMessage()];
    }
}

// Configuración de la conexión a la base de datos SQLite
$db_file = 'proyIDS.db'; 

// Función para obtener la conexión a la base de datos SQLite
function getDB() {
    global $db_file;
    try {
        $db = new PDO('sqlite:' . $db_file);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Error al conectar a la base de datos: ' . $e->getMessage()]);
        exit;
    }
}

// Verificar el token JWT en la cabecera Authorization
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authorization_header = $_SERVER['HTTP_AUTHORIZATION'];
    $token = str_replace('Bearer ', '', $authorization_header);
    $user = decodeJWT($token);

    if (!$user) {
        echo json_encode(['error' => 'Token inválido o expirado.']);
        exit;
    }
}

// Si la solicitud es POST (login)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->usuario) && isset($data->clave)) {
        $usuario = $data->usuario;
        $clave = $data->clave;

        // Verificación de las credenciales (esto es solo un ejemplo, usa una base de datos en producción)
        if ($usuario === "Juan" && $clave === "clave123") {
            $key = "clave_secreta"; // Usa una clave secreta para firmar el token
            $issuedAt = time();
            $expirationTime = $issuedAt + 3600;  // El token expira en una hora
            $payload = array(
                "iat" => $issuedAt,
                "exp" => $expirationTime,
                "usuario" => $usuario
            );
            // Generar el token
            $token = JWT::encode($payload, $key, 'HS256');
            echo json_encode(["token" => $token]);  // Devolver el token como respuesta
        } else {
            echo json_encode(["error" => "Credenciales incorrectas"]);
        }
    } else {
        echo json_encode(["error" => "Faltan datos de usuario o clave"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Si la solicitud es GET (obtener usuarios), solo responder si el token es válido
    if (isset($user)) {  // Verificar que el token esté decodificado
        // Consultar la tabla de usuarios
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT * FROM usuarios");
            $stmt->execute();
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['usuarios' => $usuarios]);  // Devolver los usuarios como respuesta
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'No autorizado.']);
    }
} else {
    echo json_encode(['error' => 'Método no soportado.']);
}
?>
