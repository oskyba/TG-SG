async function generarReporte(variableReporte, estado) {
    const facturas = await fetch("https://644bd91a4bdbc0cc3a9c3baa.mockapi.io/facturas")
      .then(response => response.json())
      .catch(error => console.error(error));
  
    const grupos = {};
  
    facturas.forEach(factura => {
      const variable = factura[variableReporte];
      if (!grupos[variable]) {
        grupos[variable] = {
          importeTotal: 0,
          cantidadFacturas: 0
        };
      }
      if (factura.estado === estado || estado === "Todos") {
        grupos[variable].importeTotal += parseFloat(factura.importe);
        grupos[variable].cantidadFacturas++;
      }
    });
  
    const tablaReporte = document.createElement("table");
    tablaReporte.classList.add("tabla-reportes");

    const preEncabezado = document.createElement("thead");
    const encabezado = document.createElement("tr");
    preEncabezado.appendChild(encabezado);
    
    let variableTexto = "";

    switch(variableReporte) {
        case 'fechaEmision':
            variableTexto = 'Fecha de emisión';
            break;
        case 'fechaVencimiento':
            variableTexto = 'Fecha de vencimiento';
            break;
        case 'fechaCobro':
            variableTexto = 'Fecha de cobro';
            break;
        case 'Estado':
            variableTexto = 'Estado';
            break;
        case 'contactadoPor':
            variableTexto = 'Contactado por';
            break;
        case 'cobradorAsignado':
            variableTexto = 'Cobrador asignado';
            break;
    }

    const encabezadoReporte = document.createElement("th");
    encabezadoReporte.textContent = variableTexto;
    encabezadoReporte.setAttribute('data-order', '0');
    encabezadoReporte.style.textAlign = "center";
    encabezado.appendChild(encabezadoReporte);
  
    const encabezadoCantidad = document.createElement("th");
    encabezadoCantidad.textContent = "Cantidad de facturas";
    encabezadoCantidad.setAttribute('data-order', '1');
    encabezadoCantidad.style.textAlign = "center";
    encabezado.appendChild(encabezadoCantidad);
  
    const encabezadoImporte = document.createElement("th");
    encabezadoImporte.textContent = "Importe total";
    encabezadoImporte.setAttribute('data-order', '2');
    encabezadoImporte.style.textAlign = "center";
    encabezado.appendChild(encabezadoImporte);
  
    tablaReporte.appendChild(preEncabezado);

    const preBody = document.createElement("tbody");

  
    for (const variable in grupos) {
        if (grupos[variable].cantidadFacturas !== 0 || estado === "Todos") {
            const filaReporte = document.createElement("tr");
  
            const celdaReporte = document.createElement("td");
            celdaReporte.textContent = variable;
            filaReporte.appendChild(celdaReporte);
        
            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = grupos[variable].cantidadFacturas;
            filaReporte.appendChild(celdaCantidad);
        
            const celdaImporte = document.createElement("td");
            celdaImporte.textContent = `$${grupos[variable].importeTotal.toFixed(2)}`;
            filaReporte.appendChild(celdaImporte);
              
            preBody.appendChild(filaReporte);
        }
    }
    
    tablaReporte.appendChild(preBody);

    const totalFacturas = Object.values(grupos).reduce((total, grupo) => total + grupo.cantidadFacturas, 0);
    const totalImporte = Object.values(grupos).reduce((total, grupo) => total + grupo.importeTotal, 0);

    const preFooter = document.createElement("tfoot");
    const filaTotal = document.createElement("tr");

    const celdaTotal = document.createElement("td");
    celdaTotal.textContent = "Total";
    celdaTotal.style.textAlign = "center";
    filaTotal.appendChild(celdaTotal);

    const celdaCantidadTotal = document.createElement("td");
    celdaCantidadTotal.textContent = totalFacturas;
    celdaCantidadTotal.style.textAlign = "center";
    filaTotal.appendChild(celdaCantidadTotal);

    const celdaImporteTotal = document.createElement("td");
    celdaImporteTotal.textContent = `$${totalImporte.toFixed(2)}`;
    celdaImporteTotal.style.textAlign = "center";
    filaTotal.appendChild(celdaImporteTotal);

    preFooter.appendChild(filaTotal);
    tablaReporte.appendChild(preFooter);

    const elementoReporte = document.getElementById("reporte");
    elementoReporte.innerHTML = "";
    elementoReporte.appendChild(tablaReporte);

    $('.tabla-reportes').DataTable({
        "searching": false,
        "lengthChange": false,
        "paging": false,
        "language": {
            "info": "",
            "infoEmpty": "",
            "infoFiltered": "",
            "emptyTable": "No existen datos disponibles para generar el reporte seleccionado"
        }
      });
  } 