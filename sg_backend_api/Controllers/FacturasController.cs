using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SG_Backend_api.Engines;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using SG_Backend_api.Common;

namespace SG_Backend_api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly IDBEngine db;

        public FacturasController(IDBEngine DBEngine)
        {
            db = DBEngine;
        }

        /// <summary>
        /// Regresa todos los Facturas existentes
        /// 
        /// </summary>
        // GET: api/Facturas
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.JsonArray("SELECT * FROM telpop.Facturas WHERE"));
        }

        /// <summary>
        /// Regresa el Factura identificado por el (id).
        /// </summary>
        // GET api/Facturas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.Json("SELECT * FROM telpop.facturas WHERE ID=@id", new {  id }));
        }

        /// <summary>
        /// Crear un nuevo Factura.
        /// </summary>
        // POST api/Facturas
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DatosBody body)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.Value<int>("INSERT INTO telpop.Facturas (descripcion, fecha, CodProvincia) VALUES (@text, GETDATE(), @user); SELECT SCOPE_IDENTITY()", new { body.Nombre }));
        }

        /// <summary>
        /// Modifica datos segun el (id) del Factura.
        /// </summary>
        // PUT api/Facturas/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DatosBody body)
        {
            string cdProv = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.Facturas WHERE ID=@id AND CodProvincia=@cdProv;UPDATE telpop.Facturas SET text=@text WHERE ID=@id AND CodProvincia=@cdProv", new { body.Nombre, id, cdProv });

            if (found > 0)
                return Ok($"Factura: {id} modificada exitosamente");
            else
                return Unauthorized();
        }

        /// <summary>
        /// Borra el Factura identificado por su (id).
        /// </summary>
        // DELETE api/Facturas/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM telpop.Facturas WHERE ID=@id;DELETE telpop.Facturas WHERE ID=@id", new { id });

            if (found > 0)
                return Ok($"Factura: {id} eliminada exitosamente");
            else
                return Unauthorized();
        }
    }
}
