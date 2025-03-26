fetch("https://1163-2806-2f0-a600-ea05-dc54-9c81-c154-aa9a.ngrok-free.app/api.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario: "ZAPA", clave: "akjkszpj" })
})
.then(response => {
    console.log("Response received:", response);  // Ver respuesta completa
    return response.json();  // Convertir la respuesta en JSON
})
.then(data => {
    console.log("Data received:", data);  // Ver los datos que devuelve la API
    if (data.token) {
        console.log("Token recibido:", data.token);
        localStorage.setItem("jwt", data.token);
    } else {
        console.error("Error en login:", data.error);
    }
})
.catch(error => console.error("Error en fetch:", error));
