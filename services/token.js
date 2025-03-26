// Realizamos la solicitud para obtener el token con usuario y clave
fetch("https://1163-2806-2f0-a600-ea05-dc54-9c81-c154-aa9a.ngrok-free.app/api.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario: "ZAPA", clave: "akjkszpj" })
})
.then(response => response.json())  // Convertir la respuesta a JSON
.then(data => {
    console.log("Data recibida:", data);  // Ver los datos recibidos

    if (data.token) {
        console.log("Token recibido:", data.token);
        localStorage.setItem("jwt", data.token);  // Guardar el token en localStorage
    } else {
        console.error("Error en login:", data.error);  // Si hay un error
    }
})
.catch(error => console.error("Error en fetch:", error));  // Manejo de errores
