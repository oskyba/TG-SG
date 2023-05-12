using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Serilog;
<<<<<<< HEAD
=======
using System;
>>>>>>> confirmacion de cambios
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace SG_Backend_api.Engines
{
    public class DBEngine : IDBEngine
    {
        private readonly string _connectionString;

        public DBEngine(IConfiguration configuration)
        {
            Log.Information("Preparando la conexion a la BD...");
            _connectionString = configuration.GetConnectionString("DBConnection");
        }

        public async Task<T> Value<T>(string query, object parameters = null)
        {
            using var conx = new SqlConnection(_connectionString);
            return await conx.QueryFirstOrDefaultAsync<T>(query, parameters);
        }

        public async Task<List<T>> Query<T>(string query, object parameters = null)
        {
            using var conx = new SqlConnection(_connectionString);
            var results = await conx.QueryAsync<T>(query, parameters);
            return results.ToList();
        }

        public async Task<JObject> Json(string query, object parameters = null)
        {
            try
            {
                return JObject.FromObject(await Value<dynamic>(query, parameters));
            }
            catch (Exception ex) { Log.Warning($"La ejecucion de la consulta a la BD a fallado, a continuacion la informacion correspondiente: {ex.Message}"); }

            return new JObject();
        }

        public async Task<JArray> JsonArray(string query, object parameters = null)
        {
            try
            {
                return JArray.FromObject(await Query<dynamic>(query, parameters));
            }
            catch (Exception ex) { Log.Warning($"La ejecucion de la consulta a la BD a fallado, a continuacion la informacion correspondiente: {ex.Message}"); }

            return new JArray();
        }

        public async Task<int> Execute(string query, object parameters = null)
        {
            using var conx = new SqlConnection(_connectionString);
            return await conx.ExecuteAsync(query, parameters);
        }
    }
}
