function doSearch()
        {
            const tableReg = document.getElementById('contactabilidad-table');
            const searchText = document.getElementById('search-contactabilidad').value.toLowerCase();

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

function limpiarTabla() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
}

function cargarContactabilidad() 
{ 
        limpiarTabla();
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/contactabilidad')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('contactabilidad-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(contacto => {
              const row = document.createElement('tr');
              row.innerHTML = `
                    <td><div>${contacto.idFactura}</div></td>
                    <td><div>${contacto.idCliente}</div></td>
                    <td><div>${contacto.fechaEmision}</div></td>
                    <td><div>${contacto.numeroFactura}</div></td>
                    <td><div>${contacto.importe}</div></td>
                    <td><div>${contacto.telefono}</div></td>
                    <td><div>${contacto.email}</div></td>
                    <td><div>${contacto.fechaVencimiento}</div></td>
                    <td>
                    <input name="date" class="datepicker-input" type="hidden" />
                    <div class="date" contenteditable="true" maxlength="10">${contacto.fechaCobro}</div>
                </td>
                <td><div id="estado" contenteditable="true" maxlength="30">${contacto.estado}</div></td>
              `; 
              tbody.appendChild(row); 
             /*               row.innerHTML = `
                    <td><div>1</div></td>
                    <td><div>1</div></td>
                    <td>
                        <input name="date" class="datepicker-input" type="hidden" />
                        <div class="date" contenteditable="true" maxlength="10">27/04/2023</div>
                    </td>
                    <td><div contenteditable="true" maxlength="15">0001</div></td>
                    <td><div contenteditable="true" maxlength="18">1000.10</div></td>
                    <td><div contenteditable="true" maxlength="30">Pendiente</div></td>
                    <td>
                        <input name="date" class="datepicker-input" type="hidden" />
                        <div id="date" class="date" contenteditable="true" maxlength="10"></div>
                    </td>
                    <td>    
                        <button class="btn btn-secondary btn-sm" onclick="modificarFactura()">Guardar</button>
                        <button class="btn btn-secondary btn-sm" onclick="eliminarFactura()">Eliminar</button>
                    </td>  
              `; 
              tbody.appendChild(row) ;*/

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
                    actualizarEstadoFactura(this);
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

function actualizarEstadoFactura(boton) {
    
    var preFila = boton.parentNode.parentNode;
    var posicion = Array.prototype.indexOf.call(preFila.parentNode.children, preFila);

    const fila  = document.querySelectorAll('#contactabilidad-table tbody tr')[posicion];
    const id = fila.querySelectorAll('td')[0].textContent;

    fetch(`https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: "Contactado"
        })
    })
    .then(response => {
        cargarContactabilidad();   
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