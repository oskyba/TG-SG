using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SG_Backend_api.Engines;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using SG_Backend_api.Common;
using Serilog;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System;

namespace SG_Backend_api.Controllers
{

    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IDBEngine db;

        public ClientesController(IDBEngine DBEngine)
        {
            db = DBEngine;
        }

        /// <summary>
        /// Regresa todos las Clientes existentes
        /// 
        /// </summary>
        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult> Get()
        {

            Log.Information("Listando todos los clientes de la BD.");

            return Ok(await db.JsonArray("SELECT * FROM telpop.Clientes"));
        }

        /// <summary>
        /// Regresa el Cliente identificado por el (id).
        /// </summary>
        // GET api/Clientes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
           return Ok(await db.Json("SELECT * FROM telpop.Clientes WHERE ID=@id"));
        }

        //public class DatosBody
        //{
        //    [Required]
        //    public string Text { get; set; }
        //}

        /// <summary>
        /// Crear un nuevo Cliente.
        /// </summary>
        // POST api/Clientes
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ClienteBody body)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.Value<int>("INSERT INTO telpop.clientes (nombre, telefono, direccion, email) VALUES (@nombre, telefono, direccion, @email); SELECT SCOPE_IDENTITY()", new { body.nombre}));
        }

        /// <summary>
        /// Modifica datos segun el (id) del Cliente.
        /// </summary>
        // PUT api/Clientes/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DatosBody body)
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

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.clientes WHERE ID=@id;UPDATE telpop.clientes SET" + setext + " WHERE ID=@id ", parameters);

            if (found > 0)
                return Ok($"El cliente: {id} modificado exitosamente");
            else
                return Unauthorized();
        }


        /// <summary>
        /// Borra el cliente identificada por su (id) .
        /// </summary>
        // DELETE api/Clientes/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.clientes WHERE ID=@id;DELETE telpop.clientes WHERE ID=@id", new { id });

            if (found > 0)
                return Ok("El Cliente: {id} eliminado exitosamente");
            else
                return Unauthorized();
        }
    }
}
