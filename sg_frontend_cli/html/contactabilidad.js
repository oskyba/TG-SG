let clienteCorreo;
let clienteTelefono;
let dateEmision;
let dateVencimiento;
let dateCobro;

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
        fetch('https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('contactabilidad-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async factura => {
                if (factura.estado === "A coordinar") {
                    await setDatosClientes(factura.idCliente);
                    dateEmision = dayjs(factura.fechaEmision).format('DD/MM/YYYY');
                    dateVencimiento = dayjs(factura.fechaVencimiento).format('DD/MM/YYYY');
                    dateCobro = dayjs(factura.fechaCobro).format('DD/MM/YYYY'); 
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td><div>${factura.id}</div></td>
                    <td><div>${factura.idCliente}</div></td>
                    <td><div>${dateEmision}</div></td>
                    <td><div>${factura.numeroFactura}</div></td>
                    <td><div>${factura.importe}</div></td>
                    <td><div>${clienteTelefono}</div></td>
                    <td><div>${clienteCorreo}</div></td>
                    <td><div>${dateVencimiento}</div></td>
                    <td>
                    <input name="date" class="datepicker-input" type="hidden" />
                    <div class="date" contenteditable="true" maxlength="10">${dateCobro}</div>
                    </td>
                    <td><div>${factura.comentario}</div></td>
                    <td><div id="estado" contenteditable="true" maxlength="30">${factura.estado}</div></td>
                    `; 
                    tbody.appendChild(row); 
                
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
            }
            
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
    const clienteTelefonoGet = await getDatosClientes(id);
    clienteTelefono = clienteTelefonoGet.telefono;
    clienteCorreo = clienteTelefonoGet.email;
    return clienteTelefonoGet;
}