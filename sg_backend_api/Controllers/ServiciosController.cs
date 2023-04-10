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
    public class ServiciosController : ControllerBase
    {
        private readonly IDBEngine db;

        public ServiciosController(IDBEngine DBEngine)
        {
            db = DBEngine;
        }

        /// <summary>
        /// Regresa todos las Servicios existentes
        /// 
        /// </summary>
        // GET: api/Servicios
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            return Ok(await db.JsonArray("SELECT * FROM Servicios"));
        }

        /// <summary>
        /// Regresa el servicio identificado por el (id).
        /// </summary>
        // GET api/Servicios/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
           return Ok(await db.Json("SELECT * FROM Servicios WHERE ID=@id"));
        }

        //public class DatosBody
        //{
        //    [Required]
        //    public string Text { get; set; }
        //}

        /// <summary>
        /// Crear un nuevo servicio.
        /// </summary>
        // POST api/Servicios
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DatosBody body)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await db.Value<int>("INSERT INTO Productos (descripcion, fecha, id) VALUES (@text, GETDATE(), @user); SELECT SCOPE_IDENTITY()", new { body.Text}));
        }

        /// <summary>
        /// Modifica datos segun el (id) del servicio.
        /// </summary>
        // PUT api/Servicios/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DatosBody body)
        {
            string cdSrv = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM Productos WHERE ID=@id AND CodServicio=@cdSrv;UPDATE Productos SET text=@text WHERE ID=@id AND CodServicio=@cdSrv", new { body.Text, id, cdSrv });

            if (found > 0)
                return Ok($"El servicio: {id} modificado exitosamente");
            else
                return Unauthorized();
        }

        /// <summary>
        /// Borra el servicio identificada por su (id) .
        /// </summary>
        // DELETE api/Servicios/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            //string user = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int found = await db.Value<int>("SELECT COUNT(*) FROM Servicios WHERE ID=@id;DELETE Servicios WHERE ID=@id", new { id });

            if (found > 0)
                return Ok("El servicio: {id} eliminado exitosamente");
            else
                return Unauthorized();
        }
    }
}
