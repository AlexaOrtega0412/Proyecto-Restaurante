const token = localStorage.getItem("jwt");

fetch("https://1163-2806-2f0-a600-ea05-dc54-9c81-c154-aa9a.ngrok-free.app/api.php", {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
})
.then(res => res.json())
.then(data => console.log("Usuarios:", data))
.catch(error => console.error("Error:", error));
