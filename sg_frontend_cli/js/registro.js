const registerForm = document.getElementById('register-form');
const apiUrl = 'http://20.226.114.247:8080/api/Auth/Register';

registerForm.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const requestBody = {
    usuario: formData.get('username'),
    contraseña: formData.get('password'),
    email: formData.get('email'),
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    telefono: formData.get('telefono')
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
      cargarFeedbackOK();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000); 
    } else {
        cargarFeedbackError(); 
    }
  } catch (error) {
    console.log(error);
  }
});

function cargarFeedbackOK() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function cargarFeedbackError() {
  var x = document.getElementById("snackbarError");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}