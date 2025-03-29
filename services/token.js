/**
 * Realiza una petición POST a la API para obtener un token JWT.
 * El token se almacena en el localStorage del navegador y se retorna.
 * @param {string} user - Nombre del usuario
 * @param {string} pass - Contraseña del usuario
 * @returns {Promise<string|null>} - Token JWT o null en caso de error
 */
export async function getToken(user = "Pedro", pass = "clave1415") {
    const credentials = { usuario: user, clave: pass };
    console.log("Datos enviados para login:", credentials);
  
    try {
      const response = await fetch("http://localhost:4040/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
  
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
  
      const data = await response.json();
  
      if (data.token) {
        console.log("Token recibido:", data.token);
        localStorage.setItem("jwt", data.token);
        return data.token;
      } else {
        console.error("Error en login:", data.error || "No se recibió un token");
        return null;
      }
    } catch (error) {
      console.error("Error en fetch:", error);
      return null;
    }
  }
  