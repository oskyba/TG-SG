function limpiarTabla() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
}

function cargarClientes() 
{ 
        limpiarTabla();
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/clientes')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('client-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async cliente => {
              const row = document.createElement('tr');
              row.innerHTML = `
                    <td><div>${cliente.id}</div></td>
                    <td><div contenteditable="true" maxlength="30">${cliente.nombre}</div></td>
                    <td><div contenteditable="true" maxlength="15">${cliente.telefono}</div></td>
                    <td><div contenteditable="true" maxlength="30">${cliente.direccion}</div></td>
                    <td><div contenteditable="true" maxlength="30">${cliente.email}</div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="modificarCliente(this)">Guardar</button>
                        <button class="btn btn-secondary btn-sm" onclick="eliminarCliente(this)">Eliminar</button>
                    </td>  
              `;
              tbody.appendChild(row);

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
                
            });
          })
          .catch(error => {
            cargarFeedbackSystem(); 
          });
}

function doSearch()
    {
        const tableReg = document.getElementById('client-table');
        const searchText = document.getElementById('search-clients').value.toLowerCase();

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
    
function showModal() 
    {
        var modal = document.getElementById("client-modal");
        modal.style.display = "block";
    }

    function modificarCliente(boton) 
    {
        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
        const fila  = document.querySelectorAll('#client-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;

        const nombre = fila.querySelectorAll('td')[1].textContent;
        const telefono = fila.querySelectorAll('td')[2].textContent;
        const direccion = fila.querySelectorAll('td')[3].textContent;
        const email = fila.querySelectorAll('td')[4].textContent; 

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nombre: nombre,
              telefono: telefono,
              direccion: direccion,
              email: email,
            })
        })
        .then(response => {
            if (!response.ok) throw Error(response.status);
            cargarClientes();  
            cargarFeedbackOK(); 
        })
        .catch(error => {
            cargarFeedbackError(); 
          });
    }

    function agregarCliente() 
    {
        const id       = document.getElementById("id-client-input").textContent;
        const nombre   = document.getElementById('name-input').textContent;
        const telefono =  document.getElementById('phone-input').textContent;
        const direccion =  document.getElementById('address-input').textContent;
        const email     = document.getElementById('email-input').textContent;

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id: id,
                    nombre: nombre,
                    telefono: telefono, 
                    direccion: direccion,
                    email: email
                })
        })
        .then(response => {
            if (!response.ok) throw Error(response.status);
            closeModal();
            cargarClientes();
            cargarFeedbackOK(); 
        })
        .catch(error => {
            cargarFeedbackError(); 
          });
    }

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

    function eliminarCliente(boton) 
    {
        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);

        const fila  = document.querySelectorAll('#client-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/clients/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
          })
        .then(response => {
            if (!response.ok) throw Error(response.status);
            cargarClientes(); 
            cargarFeedbackOK();  
          })
        .catch(error => {
            cargarFeedbackError(); 
          });
    }

function closeModal()
    {
        var modal = document.getElementById("client-modal");
        modal.style.display = "none";
    }