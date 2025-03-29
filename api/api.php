<?php

// Configuración de CORS para permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");  

/**
 * Si la solicitud es de tipo OPTIONS, no hacemos nada y salimos.
 */
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit;}

// Cargamos la biblioteca de Firebase JWT
require_once 'vendor/autoload.php';
use \Firebase\JWT\JWT;

/**
 * Decodifica el JWT y verifica su validez.
 */
function decodeJWT($jwt) {
    $key = "clave_secreta"; 
    try {
        // Intentamos decodificar el JWT
        $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));  // Cambia el tercer argumento por un objeto Key
        return $decoded;  // Devuelve el objeto decodificado
    } catch (Exception $e) {return null;}
}

/**
 * Conecta a la base de datos SQLite y devuelve el objeto PDO.
 */
// Configuración de la conexión a la base de datos SQLite
$db_file = 'proyIDS.db'; 
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

/**
 * Manejador de la solicitud POST para autenticar al usuario y generar un token JWT.
 * Manejador de la solicitud GET para obtener el usuario autenticado y los platos.
 */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->usuario) && isset($data->clave)) {
        $usuario = $data->usuario;
        $clave = $data->clave;

        // Verificación de las credenciales en la base de datos
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT * FROM usuarios WHERE nombre = :usuario");
            $stmt->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $stmt->execute();
            $usuarioData = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verificar si el usuario existe y la contraseña es correcta
            if ($usuarioData) {
                // Comparamos las contraseñas en texto plano (sin usar password_verify)
                if ($clave === $usuarioData['clave']) {
                    // Si las credenciales son correctas, generamos el token
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
                } else {echo json_encode(["error" => "Credenciales incorrectas"]);}
            } else {echo json_encode(["error" => "Usuario no encontrado."]);}
        } 
        catch (PDOException $e) {echo json_encode(["error" => "Error al consultar la base de datos: " . $e->getMessage()]);}
    } else {echo json_encode(["error" => "Faltan datos de usuario o clave"]);}
}

// Si la solicitud es GET (obtener usuario), solo responder si el token es válido
elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authorization_header = $_SERVER['HTTP_AUTHORIZATION'];
        $token = str_replace('Bearer ', '', $authorization_header);
        $user = decodeJWT($token);

        // Verificar que el token esté decodificado y contenga la propiedad 'usuario'
        if ($user && isset($user->usuario)) {
            $usuario = $user->usuario;  // Extraemos el usuario del token
        } else {
            echo json_encode(['error' => 'Token inválido o expirado.']);
            exit;
        }

        // Consulta la base de datos para obtener solo el registro del usuario autenticado
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT * FROM usuarios WHERE nombre = :usuario");
            $stmt->bindParam(':usuario', $usuario, PDO::PARAM_STR);
            $stmt->execute();

            $usuarioData = $stmt->fetch(PDO::FETCH_ASSOC);
            // Devolver el usuario como respuesta
            if ($usuarioData) {
                // Consulta para obtener todos los platos
                $stmtPlatos = $db->prepare("SELECT * FROM platos");
                $stmtPlatos->execute();
                $platosData = $stmtPlatos->fetchAll(PDO::FETCH_ASSOC);

                // Devolver el usuario y los platos
                echo json_encode(['usuario' => $usuarioData, 'platos' => $platosData]);
            } else {
                echo json_encode(['error' => 'Usuario no encontrado.']);
            }
        }  
        catch (PDOException $e) {echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);}
    } else {echo json_encode(['error' => 'No autorizado.']);}
} else {echo json_encode(['error' => 'Método no soportado.']);}
?>
