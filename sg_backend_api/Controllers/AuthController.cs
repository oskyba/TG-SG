using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SG_Backend_api.Engines;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using SG_Backend_api.Common;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Serilog;

namespace SG_Backend_api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly IDBEngine db;
        private readonly ICryptoEngine crypto;

        public AuthController(IConfiguration Configuration, IDBEngine DBEngine, ICryptoEngine CryptoEngine)
        {
            config = Configuration;
            db = DBEngine;
            crypto = CryptoEngine;
        }

        /// <summary>
        /// Iniciar sesión con usuario y contraseña. No requiere autorización previa.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] LoginBody body)
        {
            string username = body.Usuario.ToLower();
            Log.Information($"Preparando el ingreso del usuario {username}");
            string hash = await db.Value<string>("SELECT hash FROM sistema.users WHERE LOWER(aliasUsr)=@username", new { username });
            Log.Information("Verificando la respuesta del servicio..."); ;
            if (!string.IsNullOrEmpty(hash) && crypto.HashCheck(hash, body.Contraseña))
            {
                JObject session = await LoadSession(username);
                session["token"] = GenerateJwtToken(session);
                Log.Information($"El usuario {username} se valido correctamente.");
                return Ok(session);
            }

            return Unauthorized("error.credentials");
        }

        /// <summary>
        /// Regístrese con usuario, correo electrónico, nombre y contraseña. No requiere autorización previa.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> Register([FromBody] RegisterBody body)
        {
            string username = body.Usuario.ToLower();
            string email = body.Email.ToLower();

            if (await db.Value<int>("SELECT COUNT(*) FROM sistema.Users, telpop.usuarios WHERE LOWER(aliasUsr)=@username OR LOWER(email)=@email", new { username, email }) > 0)
                return Unauthorized("error.unavailable");
            var parameters = new { body.Nombre, body.Apellido, email, body.Telefono };
            await db.Execute("INSERT INTO telpop.Usuarios (nombre, apellido, email, telefono) VALUES (@nombre, @apellido, @email, @telefono)", parameters );
            int id = await db.Value<int>("SELECT id FROM telpop.Usuarios WHERE LOWER(email)=@email", new { email });
            await db.Execute("INSERT INTO sistema.Users (aliasUsr, hash, id_usuario) VALUES (@username, @hash, @id )", new { username, hash = crypto.Hash(body.Contraseña), id });

            return Ok();
        }

        /// <summary>
        /// Devuelve los datos de sesión para este usuario..
        /// </summary>
        [Authorize]
        [HttpGet]
        public async Task<ActionResult> Session()
        {
            return Ok(await LoadSession());
        }

        private async Task<JObject> LoadSession(string username = "")
        {
            if (username == "")
                username = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return await db.Json("SELECT id_usuario, aliasUsr, email FROM sistema.Users, telpop.usuarios WHERE LOWER(aliasUsr)=@username  AND id_usuario=id", new { username = username.ToLower() });
        }

        private string GenerateJwtToken(JObject session)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, session["aliasUsr"].ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, session["id_usuario"].ToString())
            };

            dynamic JwtConfig = new
            {
                Issuer = config.GetSection("JWT:Issuer").Value,
                Key = config.GetSection("JWT:Key").Value,
                ExpireMinutes = config.GetSection("JWT:ExpireMinutes").Value
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtConfig.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(Convert.ToDouble(JwtConfig.ExpireMinutes));

            var token = new JwtSecurityToken(
                JwtConfig.Issuer,
                JwtConfig.Issuer,
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
