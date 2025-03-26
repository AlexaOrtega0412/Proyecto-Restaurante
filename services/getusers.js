const token = localStorage.getItem("jwt");
fetch("https://1163-2806-2f0-a600-ea05-dc54-9c81-c154-aa9a.ngrok-free.app/api.php", {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
})
.then(res => {
    // Ver la respuesta completa antes de procesarla
    console.log("Respuesta completa:", res);
    return res.text(); // Obtener el cuerpo de la respuesta como texto
})
.then(text => {
    console.log("Cuerpo de la respuesta como texto:", text);

    // Intentar convertir a JSON
    try {
        const data = JSON.parse(text);
        console.log("Usuarios:", data);
    } catch (error) {
        console.error("Error al parsear la respuesta:", error);
    }
})
.catch(error => console.error("Error:", error));
