const token = localStorage.getItem("jwt");
fetch("https://1163-2806-2f0-a600-ea05-dc54-9c81-c154-aa9a.ngrok-free.app/api.php", {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
})
.then(res => {
    // Ver la respuesta completa antes de procesarla
    console.log("Respuesta completa:", res);

    // Convertir la respuesta a JSON directamente
    return res.json();  // Cambiar text() por json()
})
.then(data => {
    console.log("Usuarios:", data);  // Ahora 'data' debería ser un objeto JSON
})
.catch(error => console.error("Error:", error));
