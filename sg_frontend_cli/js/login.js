const loginForm = document.getElementById('login-form');
const apiUrl = 'http://20.226.114.247:8080/api/Auth/Login';

loginForm.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const requestBody = {
    usuario: formData.get('username'),
    contraseña: formData.get('password')
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const responseBody = await response.json();
      const authToken = responseBody.token;
      const username = responseBody.aliasUsr;
      const funcion = responseBody.funcion;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('username', username);
      localStorage.setItem('funcion', funcion);
      window.location.href = "dashboard.html";
    } else {
        cargarFeedbackError(); 
    }
  } catch (error) {
    cargarFeedbackError(); 
  }
});

function cargarFeedbackError() {
    var x = document.getElementById("snackbarError");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
