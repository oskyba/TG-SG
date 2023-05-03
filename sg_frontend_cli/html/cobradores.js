let clienteDireccion;

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
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('cobradores-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async factura => {
                if (factura.estado === "Coordinado") {
                    await setDatosClientes(factura.idCliente);
                    const dateCobro = dayjs(factura.fechaCobro).format('DD/MM/YYYY');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td><div>${factura.id}</div></td>
                    <td><div>${factura.idCliente}</div></td>
                    <td><div>${clienteDireccion}</div></td>
                    <td><div>${dateCobro}</div></td>
                    <td><div>${factura.numeroFactura}</div></td>
                    <td><div>${factura.importe}</div></td>
                    <td><div>${factura.estado}</div></td>
                    <td><div contenteditable="true" maxlength="50">${factura.comentario}</div></td>
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

        var preFila = boton.parentNode.parentNode;
        var posicion = Array.prototype.indexOf.call(preFila.parentNode.children, preFila);

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

        var preFila = boton.parentNode.parentNode;
        var posicion = Array.prototype.indexOf.call(preFila.parentNode.children, preFila);

        const fila  = document.querySelectorAll('#cobradores-table tbody tr')[posicion];
        const id = fila.querySelectorAll('td')[0].textContent;
        const comentario = fila.querySelectorAll('td')[7].textContent;

        fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
         method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: "A coordinar",
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

    async function getDatosClientes(id) {
        try {
            const response = await fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/clientes/${id}`);
            const data = await response.json();
            console.log(data);
            return data;
    
        } catch (error) {
            console.error(error);
        }
    }
    async function setDatosClientes(id) {
        const clienteDireccionGet = await getDatosClientes(id);
        clienteDireccion = clienteDireccionGet.direccion;
    }