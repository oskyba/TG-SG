function limpiarTabla() 
{
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
}

function cargarFacturas() 
{ 
        limpiarTabla();
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('facturas-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async facturas => {
              const row = document.createElement('tr');
              row.innerHTML = `
                    <td><div>${facturas.id}</div></td>
                    <td><div>${facturas.idCliente}</div></td>
                    <td>
                        <input name="date" class="datepicker-input" type="hidden" />
                        <div class="date" contenteditable="true" maxlength="10">${facturas.fechaEmision}</div>
                    </td>
                    <td><div contenteditable="true" maxlength="15">${facturas.numeroFactura}</div></td>
                    <td><div contenteditable="true" maxlength="30">${facturas.importe}</div></td>
                    </div></td>
                    <td>
                        <input name="date" class="datepicker-input" type="hidden" />
                        <div id="date" class="date" contenteditable="true" maxlength="10">${facturas.fechaVencimiento}</div>
                    </td>
                    <td>
                        <input name="date" class="datepicker-input" type="hidden" />
                        <div id="date" class="date" contenteditable="true" maxlength="10">${facturas.fechaCobro}</div>
                    </td>
                    <td><div>
                    <select id="estado-${facturas.id}">${facturas.estado}
                        <option value="A coordinar">A coordinar</value>
                        <option value="Coordinado">Coordinado</value>
                        <option value="Cobrado">Cobrado</value>
                    </select>
                    </div></td>
                    <td><div>${facturas.contactadoPor}</div></td>
                    <td><div>${facturas.cobradorAsignado}</div></td>
                    <td><div>${facturas.comentarios}</div></td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="modificarFactura(this)">Guardar</button>
                        <button class="btn btn-secondary btn-sm" onclick="eliminarFactura(this)">Eliminar</button>
                    </td>  
              `; 
              tbody.appendChild(row); 
              seleccionarOpcion(document.getElementById(`estado-${facturas.id}`), facturas.estado);

              $('.datepicker-input').datepicker({
                closeText: 'Cerrar',
                currentText: 'Hoy',
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié;', 'Juv', 'Vie', 'Sáb'],
                dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
                weekHeader: 'Sm',
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                forceParse: false,
                isRTL: false,
                showMonthAfterYear: false,
                onClose: function(dateText, inst) {
                    $(this).parent().find('.date').focus().html(dateText).blur();
                }
                });
    
                $('.date').click(function() {
                    $(this).parent().find('.datepicker-input').datepicker("show");
                }); 

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

function agregarFactura() 
{
    const idCliente        = document.getElementById('idCliente').textContent;
    const fechaEmision     = document.getElementById('fechaEmision').value;
    const numeroFactura    = document.getElementById('numeroFactura').textContent;
    const importe          = document.getElementById('importe').textContent;
    const estado           = "A coordinar";
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const fechaCobro       = "";
    const contactadoPor = "";
    const cobradorAsignado = "";
    const comentarios      = "";

    fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                idCliente: idCliente,
                fechaEmision: fechaEmision,
                numeroFactura: numeroFactura,
                importe: importe,
                estado: estado,
                fechaVencimiento: fechaVencimiento,
                fechaCobro: fechaCobro,
                contactadoPor: contactadoPor,
                cobradorAsignado: cobradorAsignado,
                comentarios: comentarios
            })
    })
    .then(response => {
        closeModal();
        cargarFacturas();
        if (!response.ok) throw Error(response.status);
        cargarFeedbackOK(); 
    })
    .catch(error => {
        cargarFeedbackError(); 
      });
}

function modificarFactura(boton) 
{
    var preFila = boton.closest('tr');
    var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
    const fila  = document.querySelectorAll('#facturas-table tbody tr')[posicion];
    const id = fila.querySelectorAll('td')[0].textContent;
    
    const idCliente = fila.querySelectorAll('td')[1].textContent;
    const fechaEmision = fila.querySelectorAll('td .date')[0].textContent;
    const numeroFactura = fila.querySelectorAll('td')[3].textContent;
    const importe = fila.querySelectorAll('td')[4].textContent; 
    const estado = fila.querySelector('select').value;
    const fechaVencimiento = fila.querySelectorAll('td .date')[1].textContent; 
    const fechaCobro = fila.querySelectorAll('td .date')[2].textContent; 

    fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCliente: idCliente,
          fechaEmision: fechaEmision,
          numeroFactura: numeroFactura,
          importe: importe,
          estado: estado,
          fechaVencimiento: fechaVencimiento,
          fechaCobro: fechaCobro
        })
    })
    .then(response => {
        cargarFacturas();  
        if (!response.ok) throw Error(response.status);
        cargarFeedbackOK(); 
    })
    .catch(error => {
        cargarFeedbackError(); 
      });
}

function eliminarFactura(boton) 
{
    var preFila = boton.closest('tr');
    var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
    
    const fila  = document.querySelectorAll('#facturas-table tbody tr')[posicion];
    const id = fila.querySelectorAll('td')[0].textContent;

    fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
      })
    .then(response => {
        cargarFacturas(); 
        if (!response.ok) throw Error(response.status);
        cargarFeedbackOK();  
      })
    .catch(error => {
        cargarFeedbackError(); 
      });
}

function doSearch()
{
            const tableReg = document.getElementById('facturas-table');
            const searchText = document.getElementById('search-facturas').value.toLowerCase();

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
    var modal = document.getElementById("modalFactura");
    modal.style.display = "block";
}

function closeModal() 
{
    var modal = document.getElementById("modalFactura");
    modal.style.display = "none";
}

function cargarFeedbackOK() 
{
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
    
function cargarFeedbackError() 
{
    var x = document.getElementById("snackbarError");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
    
function cargarFeedbackSystem() 
{
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