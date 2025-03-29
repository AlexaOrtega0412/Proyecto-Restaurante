
export function getToken(user = "Pedro",pass = "clave1415"){
    
   
    const credentials = { usuario: user, clave: pass };
    console.log("Datos enviados para login:", credentials);  // Añadir este log
    
    fetch("http://localhost:4040/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(credentials)
    })
    .then(response => {
        if (!response.ok) { return Promise.reject("Error en la respuesta del servidor"); }
        return response.json();
    })
    .then(data => {
        // console.log("Data recibida:", data);

        if (data.token) {
            console.log("Token recibido:", data.token);            
            localStorage.setItem("jwt", data.token);
            
        } else {
            console.error("Error en login:", data.error || "No se recibió un token");
        }
    })
    .catch(error => console.error("Error en fetch:", error));
}
