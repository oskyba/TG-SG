const loginForm = document.getElementById('login-form');
const apiUrl = 'https://dummyjson.com/auth/login';

loginForm.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const requestBody = {
    username: formData.get('username'),
    password: formData.get('password')
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
      const username = responseBody.username;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('username', username);
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
