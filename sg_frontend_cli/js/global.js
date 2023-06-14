toggleZoomScreen();

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const tokenLogin = sessionStorage.getItem('authToken');

if (!tokenLogin) {
  window.location.href = 'sinPermisos.html';
} 

const logoutLink = document.getElementById("logout-link");

logoutLink.addEventListener("click", (event) => {
  event.preventDefault(); 
  sessionStorage.clear(); 
  window.location.href = "login.html";
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

function cargarFeedbackSystem() {
    var x = document.getElementById("snackbarSystem");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function seleccionarOpcion(listaEstado, valorSeleccionado) {
  for (let i = 0; i < listaEstado.options.length; i++) {
    if (listaEstado.options[i].value === valorSeleccionado) {
      listaEstado.selectedIndex = i;
      break;
    }
  }
}

function toggleZoomScreen() {
  document.body.style.zoom = "80%";
}