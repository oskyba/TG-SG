const funcionUsr = sessionStorage.getItem('funcion');
if (funcionUsr !== "Gerencia" || funcionUsr !== "Administrador") {
    window.location.href = 'sinPermisos.html';
} else {
    cargarUsuarios();
} 

function limpiarTabla() 
{
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
}

function doSearch()
        {
            const tableReg = document.getElementById('users-table');
            const searchText = document.getElementById('search-users').value.toLowerCase();

            let total = 0;

            for (let i = 1; i < tableReg.rows.length; i++) {
                if (tableReg.rows[i].classList.contains("noSearch")) {
                    continue;
                }
                let found = false;
                const cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                for (let j = 0; j < cellsOfRow.length && !found; j++) {
                    const compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                    if (searchText.length == 0 || compareWith.indexOf(searchText) > -1) {
                        found = true;
                    }
                }
                if (found) {
                    tableReg.rows[i].style.display = '';
                } else {
                    tableReg.rows[i].style.display = 'none';
                }
            }

            const lastTR=tableReg.rows[tableReg.rows.length-1];
            const td=lastTR.querySelector("td");
            lastTR.classList.remove("hide");
            
            if (searchText == "") {
                lastTR.classList.add("hide");
            }
        }

    function cargarUsuarios() 
    { 
        limpiarTabla();
        fetch('http://20.226.114.247:8080/api/Usuarios')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('users-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async usuario => {
                if (usuario.usuario !== "Administrador") {
                    let celdaEstado;

                    if (usuario.estado === "null" || usuario.estado === null || usuario.estado === "Deshabilitado" || usuario.estado === "estado 1") {
                        celdaEstado = '<button class="btn btn-secondary btn-sm" onclick="habilitarUsuario(this)">Habilitar</button>';
                    } else {
                        celdaEstado = `${usuario.estado}`;
                    }
                    const row = document.createElement('tr');

                    row.innerHTML = `
                    <td><div>${usuario.id_usuario}</div></td>
                    <td><div>${usuario.usuario}</div></td>
                    <td><div contenteditable="true" maxlength="30">${usuario.nombre}</div></td>
                    <td><div contenteditable="true" maxlength="30">${usuario.apellido}</div></td>
                    <td><div contenteditable="true" maxlength="50">${usuario.email}</div></td>
                    <td><div contenteditable="true" maxlength="15">${usuario.telefono}</div></td>
                    <td><div>
                    <select id="funcion-${usuario.id_usuario}">${usuario.funcion}
                        <option value="Administración">Administración</value>
                        <option value="Cobranza">Cobranza</value>
                        <option value="Gerencia">Gerencia</value>
                    </select>
                    </div></td>
                    <td><div>${celdaEstado}</div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="modificarUsuario(this)">Modificar</button>
                        <button class="btn btn-secondary btn-sm" onclick="eliminarUsuario(this)">Eliminar</button>
                    </td>
                    `; 
                    
                    tbody.appendChild(row);        
                    seleccionarOpcion(document.getElementById(`funcion-${usuario.id_usuario}`), usuario.funcion);     

                    $("div[contenteditable='true'][maxlength]").on('keyup paste', function (event) {
                        var cntMaxLength = parseInt($(this).attr('maxlength'));
                        if ($(this).text().length >= cntMaxLength && event.keyCode != 8 && 
                                                     event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && 
                                                     event.keyCode != 40) {
                          event.preventDefault();
                          $(this).html(function(i, currentHtml) {
                             return currentHtml.substring(0, cntMaxLength-1);
                          });
                        }
                        });
                    }
                });
              })
              .catch(error => console.error(error));
    }

    function modificarUsuario(boton) 
    {
        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
        const fila  = document.querySelectorAll('#users-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;

        const nombre = fila.querySelectorAll('td')[1].textContent;
        const apellido = fila.querySelectorAll('td')[2].textContent;
        const email = fila.querySelectorAll('td')[3].textContent; 
        const telefono = fila.querySelectorAll('td')[4].textContent;
        const funcion = fila.querySelector('select').value;

        fetch(`http://20.226.114.247:8080/api/Usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nombre: nombre,
              apellido: apellido,
              email: email,
              telefono: telefono,
              funcion: funcion
            })
        })
        .then(response => {
            if (!response.ok) throw Error(response.status);
            cargarUsuarios();  
            cargarFeedbackOK(); 
        })
        .catch(error => {
            cargarFeedbackError(); 
          });
    }

    function habilitarUsuario(boton) {

        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
        const fila  = document.querySelectorAll('#users-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;
        const email = fila.querySelectorAll('td')[3].textContent;

        fetch(`http://20.226.114.247:8080/api/Auth/Autorize/${id}`, {
         method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
    })
    .then(response => {
        if (!response.ok) throw Error(response.status);
        cargarUsuarios();   
        cargarFeedbackOK();
    })
    .catch(error => {
        cargarFeedbackError(); 
      });

    }

    function eliminarUsuario(boton) 
    {
        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);

        const fila  = document.querySelectorAll('#users-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;

        fetch(`http://20.226.114.247:8080/api/Usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
          })
        .then(response => {
            if (!response.ok) throw Error(response.status);
            cargarUsuarios(); 
            cargarFeedbackOK();  
          })
        .catch(error => {
            cargarFeedbackError(); 
          });
    }