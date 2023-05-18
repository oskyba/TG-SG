using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SG_Backend_api.Engines;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using SG_Backend_api.Common;
using Serilog;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text.Json;
using System.Reflection;
using System;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using Dapper;
using System.Linq;

namespace SG_Backend_api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IDBEngine db;

        public UsuariosController(IDBEngine DBEngine)
        {
            db = DBEngine;
        }

        /// <summary>
        /// Regresa todos las Usuarios existentes
        /// 
        /// </summary>
        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            Log.Information("Listando todos los Usuarios de la BD.");
            return Ok(await db.JsonArray("SELECT * FROM telpop.Usuarios"));
        }

        /// <summary>
        /// Regresa el Usuario identificado por el (id).
        /// </summary>
        // GET api/Usuarios/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
           return Ok(await db.Json("SELECT * FROM telpop.Usuarios WHERE ID=@id"));
        }

        /// <summary>
        /// Modifica datos segun el (id) del Usuario.
        /// </summary>
        // PUT api/Usuarios/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UsuarioBody body)
        {
            string idC = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string setext = "";
            
            Type tipoClase = body.GetType(); // Obtener el tipo de la clase DatosBody
            PropertyInfo[] propiedades = tipoClase.GetProperties(); // Obtener todas las propiedades de la clase
            
            //Manejamos los parametros de las sentencias dinamicamente
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);

            foreach (PropertyInfo propiedad in propiedades)
            {
                string nombrePropiedad = propiedad.Name; // Obtener el nombre de la propiedad
                object valorPropiedad = propiedad.GetValue(body); // Obtener el valor de la propiedad
                
                // Armamos la bateria de SETs y parametros...
                setext = setext + (setext.IsNullOrEmpty() ? " " : ", ") + nombrePropiedad + "=@" + nombrePropiedad;
                parameters.Add("@" + nombrePropiedad, valorPropiedad.ToString());
            }

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.Usuarios WHERE ID=@id;UPDATE telpop.Usuarios SET"+ setext+" WHERE ID=@id ", parameters);

            if (found > 0)
                return Ok($"El Usuario: {id} modificado exitosamente");
            else
                return Unauthorized();
        }

        /// <summary>
        /// Borra el Usuario identificada por su (id) .
        /// </summary>
        // DELETE api/Usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.Usuarios WHERE ID=@id;DELETE telpop.Usuarios WHERE ID=@id", new { id });

            if (found > 0)
                return Ok("El Usuario: {id} eliminado exitosamente");
            else
                return Unauthorized();
        }
    }
}
