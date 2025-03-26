// import { getToken } from "./token.js";

// getToken();
const token = localStorage.getItem("jwt");
const info = {
    usuario: {},
    platos: []
};

export function getUsers() {
    if (!token) {console.error("Sin token, inicia sesión.");} 
    else {
        fetch("http://localhost:8000/api.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token // Asegúrate de que el token esté guardado
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