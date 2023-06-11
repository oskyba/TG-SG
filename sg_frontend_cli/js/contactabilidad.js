let clienteCorreo;
let clienteTelefono;

const funcionUsr = sessionStorage.getItem('funcion');

if (funcionUsr !== "Cobranza" || funcionUsr !== "Administrador") {
    window.location.href = 'sinPermisos.html';
} else {
    cargarContactabilidad();
}

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
        fetch('http://20.226.114.247:8080/api/Facturas')
          .then(response => response.json())
          .then(data => {
            const tabla = document.getElementById('contactabilidad-table');
            const tbody = tabla.querySelector('tbody');
            data.forEach(async factura => {
                if (factura.estado === "A coordinar") {
                    await setDatosClientes(factura.idCliente);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td><div>${factura.id}</div></td>
                    <td><div>${factura.idCliente}</div></td>
                    <td><div>${factura.fechaEmision}</div></td>
                    <td><div>${factura.numeroFactura}</div></td>
                    <td><div>${factura.importe}</div></td>
                    <td><div>${clienteTelefono}</div></td>
                    <td><div>${clienteCorreo}</div></td>
                    <td><div>${factura.fechaVencimiento}</div></td>
                    <td>
                    <input name="date" class="datepicker-input" type="hidden" />
                    <div class="date" contenteditable="true" maxlength="10">${factura.fechaCobro}</div>
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
                dateFormat: 'yy/mm/dd',
                firstDay: 1,
                forceParse: false,
                isRTL: false,
                showMonthAfterYear: false,
                defaultDate: new Date(),
                setDate: new Date(),
                nextText: 'Siguiente',
                prevText: 'Anterior',
                beforeShowDay: function(date) {
                    const today = new Date();
                    if (date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear()) {
                      return [true, 'today', 'Hoy'];
                    }
                    return [true, '', ''];
                  },
                onClose: function(dateText, inst) {
                    const $date = $(this).parent().find('.date');
                    const previousDate = $date.text().trim();
                  
                    if (dateText === '') {
                      $date.text(previousDate);
                      return;
                    }
                  
                    if (dateText !== previousDate) {
                      $date.text(dateText)
                      actualizarEstadoFactura(this);
                    }
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
    
    var preFila = boton.closest('tr');
    var posicion = Array.from(preFila.parentNode.children).indexOf(preFila);
    const fila  = document.querySelectorAll('#contactabilidad-table tbody tr')[posicion];
    const id = fila.querySelectorAll('td')[0].textContent;
    
    const fechaCobro = fila.querySelectorAll('td .datepicker-input')[0].value;
    const estado = "Coordinado";
    const contactadoPor = sessionStorage.getItem('username');

    fetch(`http://20.226.114.247:8080/api/Facturas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: estado,
          fechaCobro: fechaCobro,
          contactadoPor: contactadoPor
        })
    })
    .then(response => {
        if (!response.ok) throw Error(response.status);
        cargarContactabilidad();   
        cargarFeedbackOK(); 
    })
    .catch(error => {
        cargarFeedbackError(); 
      });
}

async function getDatosClientes(id) {
    try {
        const response = await fetch(`http://20.226.114.247:8080/api/Clientes/${id}`);
        const data = await response.json();
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