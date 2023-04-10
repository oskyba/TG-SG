using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SG_Backend_api.Engines;
using System.Security.Claims;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using SG_Backend_api.Common;

namespace SG_Backend_api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IDBEngine db;

        public ProductosController(IDBEngine DBEngine)
        {
            db = DBEngine;
        }

        /// <summary>
        /// Regresa todos los productos existentes
        /// 
        /// </summary>
        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.JsonArray("SELECT * FROM Productos WHERE"));
        }

        /// <summary>
        /// Regresa el producto identificado por el (id).
        /// </summary>
        // GET api/Productos/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.Json("SELECT * FROM Notes WHERE ID=@id", new {  id }));
        }

        /// <summary>
        /// Crear un nuevo producto.
        /// </summary>
        // POST api/Productos
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DatosBody body)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.Value<int>("INSERT INTO Productos (descripcion, fecha, CodProvincia) VALUES (@text, GETDATE(), @user); SELECT SCOPE_IDENTITY()", new { body.Text }));
        }

        /// <summary>
        /// Modifica datos segun el (id) del producto.
        /// </summary>
        // PUT api/Productos/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DatosBody body)
        {
            string cdProv = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM Productos WHERE ID=@id AND CodProvincia=@cdProv;UPDATE Productos SET text=@text WHERE ID=@id AND CodProvincia=@cdProv", new { body.Text, id, cdProv });

            if (found > 0)
                return Ok($"Producto: {id} modificado exitosamente");
            else
                return Unauthorized();
        }

        /// <summary>
        /// Borra el producto identificado por su (id).
        /// </summary>
        // DELETE api/Productos/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM Productos WHERE ID=@id;DELETE Productos WHERE ID=@id", new { id });

            if (found > 0)
                return Ok($"Producto: {id} eliminado exitosamente");
            else
                return Unauthorized();
        }
    }
}
