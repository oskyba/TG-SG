using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace SG_Backend_api.Common
{
    public class RequestResult
    {
        public RequestState State { get; set; }
        public HttpStatusCode HttpStatusCode { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public object Exception { get; set; }
    }

    public class BadRequestResult
    {
        public RequestState State { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public object Exception { get; set; }
    }
    public class DatosBody
    {
        [Required]
        public string Text { get; set; }
    }
    public class RegisterBody
    {
        [Required]
        public string Usuario { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Contraseña { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
    }
    public class LoginBody
    {
        [Required]
        public string Usuario { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Contraseña { get; set; }
    }
	public class ClienteBody
    {
		public string nombre { get; set; }
		public string telefono { get; set; }
		public string direccion { get; set; }
		public string email { get; set; }
	}
    public enum RequestState
    {
        Failed = -1,
        NotAuth = 0,
        Success = 1,
        Timeout = 2
    }
}
