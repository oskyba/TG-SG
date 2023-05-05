const registerForm = document.getElementById('register-form');
const apiUrl = 'https://dummyjson.com/auth/register';

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
      const responseBody = await response.json();
      cargarFeedbackOK();
      window.location.href = "login.html";
    } else {
        cargarFeedbackError(); 
    }
  } catch (error) {
    cargarFeedbackError(); 
  }
});