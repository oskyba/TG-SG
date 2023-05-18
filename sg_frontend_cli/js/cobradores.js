let clienteDireccion;

const funcionUsr = sessionStorage.getItem('funcion');

if (funcionUsr !== "Cobranza" || funcionUsr !== "Administrador") {
    window.location.href = 'sinPermisos.html';
} else {
    cargarCobradores();
}

function limpiarTabla() 
{
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
}

function doSearch()
        {
            const tableReg = document.getElementById('cobradores-table');
            const searchText = document.getElementById('search-cobradores').value.toLowerCase();

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

    function cargarCobradores() 
    { 
        limpiarTabla();
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('cobradores-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async factura => {
                if (factura.estado === "Coordinado") {
                    await setDatosClientes(factura.idCliente);
                    let celdaCobradorAsignado;
                    if (factura.cobradorAsignado === "null" || factura.cobradorAsignado === null || factura.cobradorAsignado === "") {
                        celdaCobradorAsignado = '<button class="btn btn-secondary btn-sm" onclick="asignarCobrador(this)">Asignar</button>';
                    } else {
                        celdaCobradorAsignado = `${factura.cobradorAsignado}`;
                    }
                    const row = document.createElement('tr');

                    row.innerHTML = `
                    <td><div>${factura.id}</div></td>
                    <td><div>${factura.idCliente}</div></td>
                    <td><div>${clienteDireccion}</div></td>
                    <td><div>${factura.fechaCobro}</div></td>
                    <td><div>${factura.numeroFactura}</div></td>
                    <td><div>${factura.importe}</div></td>
                    <td><div>${factura.estado}</div></td>
                    <td><div id="cobradorAsignado">${celdaCobradorAsignado}</div></td>
                    <td><div contenteditable="true" maxlength="50">${factura.comentarios}</div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="recoordinarContacto(this)">Recoordinar</button>
                        <button class="btn btn-secondary btn-sm" onclick="cobrarFactura(this)">Cobrar</button>
                        
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
                    }
                });
              })
              .catch(error => console.error(error));
    }

    function cobrarFactura(boton) {

        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);

        const fila  = document.querySelectorAll('#cobradores-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
         method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: "Cobrado"
        })
    })
    .then(response => {
        cargarCobradores();   
        if (!response.ok) throw Error(response.status);
    })
    .catch(error => {
        cargarFeedbackError(); 
      });

    }

    function recoordinarContacto(boton) {

        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
        const fila  = document.querySelectorAll('#cobradores-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;
        const comentario = fila.querySelectorAll('td')[8].textContent;
        const fechaCobro = "";
        const estado = "A coordinar";
        const cobradorAsignado = "";

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
         method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: estado,
          fechaCobro: fechaCobro,
          cobradorAsignado: cobradorAsignado,
          comentario: comentario
        })
    })
    .then(response => {
        cargarCobradores();   
        if (!response.ok) throw Error(response.status);
        cargarFeedbackOK();
    })
    .catch(error => {
        cargarFeedbackError(); 
      });

    }

    function asignarCobrador(boton) {

        var preFila = boton.closest('tr');
        var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
        const fila  = document.querySelectorAll('#cobradores-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;
        const cobradorAsignado = sessionStorage.getItem('username');

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
         method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cobradorAsignado: cobradorAsignado
        })
    })
    .then(response => {
        if (!response.ok) throw Error(response.status);
        cargarCobradores();   
        cargarFeedbackOK();
    })
    .catch(error => {
        cargarFeedbackError(); 
      });

    }

    async function getDatosClientes(id) {
        try {
            const response = await fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/clientes/${id}`);
            const data = await response.json();
            return data;
    
        } catch (error) {
            console.error(error);
        }
    }
    async function setDatosClientes(id) {
        const clienteDireccionGet = await getDatosClientes(id);
        clienteDireccion = clienteDireccionGet.direccion;
    }