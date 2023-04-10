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
    public enum RequestState
    {
        Failed = -1,
        NotAuth = 0,
        Success = 1,
        Timeout = 2
    }
}
