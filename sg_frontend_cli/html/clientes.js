function limpiarTabla() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
}

function cargarClientes() 
{ 
        limpiarTabla();
        fetch('https://jsonplaceholder.typicode.com/users')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('client-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(cliente => {
              const row = document.createElement('tr');
              row.innerHTML = `
                    <td><div>${cliente.id}</div></td>
                    <td><div contenteditable="true" maxlength="30">${cliente.name}</div></td>
                    <td><div contenteditable="true" maxlength="15">${cliente.phone}</div></td>
                    <td><div contenteditable="true" maxlength="30">${cliente.address.street}</div></td>
                    <td><div contenteditable="true" maxlength="30">${cliente.email}</div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="modificarCliente()">Guardar</button>
                        <button class="btn btn-secondary btn-sm" onclick="eliminarCliente()">Eliminar</button>
                    </td>  
              `;
              tbody.appendChild(row);
            });
          })
          .catch(error => console.error(error));
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

    function modificarCliente() 
    {
        const fila  = document.querySelectorAll('#client-table tbody tr')[0];
        const id = fila.querySelectorAll('td')[0].textContent;

        const nombre = fila.querySelectorAll('td')[1].textContent;
        const telefono = fila.querySelectorAll('td')[2].textContent;
        const direccion = fila.querySelectorAll('td')[3].textContent;
        const email = fila.querySelectorAll('td')[4].textContent; 

        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: nombre,
              phone: telefono,
              street: direccion,
              email: email,
            })
        })
        .then(response => {
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

        fetch(`https://jsonplaceholder.typicode.com/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id: id,
                    name: nombre,
                    email: email,
                    street: direccion,
                    phone: telefono
                })
        })
        .then(response => {
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

    function eliminarCliente() 
    {
        const fila  = document.querySelectorAll('#client-table tbody tr')[0];
        const id = fila.querySelectorAll('td')[0].textContent;

        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
          })
        .then(response => {
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