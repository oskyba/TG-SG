const token = localStorage.getItem('authToken');

console.log(token);
if (!token) {
  window.location.href = 'sinPermisos.html';
}

$(window).unload(function(){
    localStorage.removeItem("authToken"); 
    localStorage.removeItem("username"); 
    sessionStorage.clear(); 
});

const logoutLink = document.getElementById("logout-link");

logoutLink.addEventListener("click", (event) => {
  event.preventDefault(); 
  localStorage.removeItem("authToken"); 
  localStorage.removeItem("username"); 
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