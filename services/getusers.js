import { getToken } from "./token.js";

const token = localStorage.getItem("jwt");
const info = {
    usuario: {},
    platos: []
};

/**
 * Realiza consulta a token.js para obtener el token de la API
 * y luego realiza una solicitud GET a la API para obtener información del usuario.
 * @returns {Object} info - Arreglo de usuarios y platos 
 */
export function getUsers() {
    if (!token) {console.error("Sin token, inicia sesión.");} 
    else {
        fetch("http://localhost:4040/api.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token 
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.usuario) {
                info.usuario = data.usuario;
                info.platos = data.platos;
                console.log("Usuario recibido:", data.usuario);
                console.log("Los platos son:", data.platos);
                
            } 
            else {console.error("Error al obtener usuario:", data.error);}
        })
        .catch(error => console.error("Error en la solicitud:", error));
    }

    return info;
}