using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SG_Backend_api.Engines;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using SG_Backend_api.Common;
using Serilog;

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
        public async Task<ActionResult> Put(int id, [FromBody] DatosBody body)
        {
            string idC = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.Usuarios WHERE ID=@id AND CodUsuario=@cdSrv;UPDATE telpop.Usuarios SET text=@text WHERE ID=@id AND CodUsuario=@cdSrv", new { body.Text, id, idC });

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
