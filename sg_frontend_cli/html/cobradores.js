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
            fetch('https://ejemplo.com/api/cobradores')
              .then(response => response.json())
              .then(data => {
                const tableBody = document.querySelector('#cobradores-table tbody');
      
                data.forEach(cobrador => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                    <td>${cobrador.id_factura}</td>
                    <td>${cobrador.id_cliente}</td>
                    <td>${cobrador.direccion}</td>
                    <td>${cobrador.fecha}</td>
                    <td>${cobrador.numero_factura}</td>
                    <td>${cobrador.importe}</td>
                    <td>${cobrador.estado}</td>
                    <td>${cobrador.comentarios}</td>
                    <td>Lista de Acciones</td>
                    <td><input type="checkbox" ${cobrador.cobrado ? 'checked' : ''}></td>
                  `;
                  tableBody.appendChild(row);
                });
              })
              .catch(error => console.error(error));
    }