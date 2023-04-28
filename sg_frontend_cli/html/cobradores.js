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
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/contactabilidad')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('cobradores-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(cobrador => {
              const row = document.createElement('tr');

                 /* row.innerHTML = `
                    <td><div>${cobrador.idFactura}</div></td>
                    <td><div>${cobrador.idCliente}</div></td>
                    <td><div>${cobrador.direccion}</div></td>
                    <td><div>${cobrador.fechaCobro}</div></td>
                    <td><div>${cobrador.numeroFactura}</div></td>
                    <td><div>${cobrador.importe}</div></td>
                    <td><div>${cobrador.estado}</div></td>
                    <td><div contenteditable="true" maxlength="50">${cobrador.comentario}</div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="modidificarComentario(this)">Guardar</button>
                        <button class="btn btn-secondary btn-sm" onclick="cobrarFactura(this)">Cobrar</button>
                    </td>
                  `; */
                   row.innerHTML = `
                    <td><div>1</div></td>
                    <td><div>1</div></td>
                    <td><div>Calle Falsa 123</div></td>
                    <td><div>28/04/2023</div></td>
                    <td><div>3</div></td>
                    <td><div>1000</div></td>
                    <td><div>Contactado</div></td>
                    <td><div contenteditable="true" maxlength="50">No se</div></td>
                    <td>
                    <button class="btn btn-secondary btn-sm" onclick="modidificarComentario(this)">Guardar</button>
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

    function modidificarComentario(boton) {

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