function iniciarSesion() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: username,
            contraseña: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            cargarFeedbackError(); 
        }
    })
    .catch(error => {
            cargarFeedbackError(); 
          });
    }
