/**
 * Realiza consulta a la API para obtener información del usuario y los platos.
 * Usa el token almacenado en localStorage para la autorización.
 * @returns {Promise<Object|null>} - Objeto con { usuario, platos } o null en caso de error.
 */
export async function getUsers() {
    const token = localStorage.getItem("jwt");
  
    if (!token) {
      console.error("Sin token, inicia sesión.");
      return null;
    }
  
    try {
      const response = await fetch("http://localhost:4040/api.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
  
      const data = await response.json();
  
      if (data.usuario) {
        console.log("Usuario recibido:", data.usuario);
        console.log("Los platos son:", data.platos);
        return {
          usuario: data.usuario,
          platos: data.platos
        };
      } else {
        console.error("Error al obtener usuario:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return null;
    }
  }
  