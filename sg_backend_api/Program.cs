using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Core;
using Serilog.Debugging;
using Serilog.Formatting.Json;
using Serilog.Settings.Configuration;
using System;
using System.IO;

namespace SG_Backend_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
  
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", true)
                .Build();

            Log.Logger = new LoggerConfiguration()
                //.ReadFrom.Configuration(configuration)
                .WriteTo.Console(new JsonFormatter())
                .WriteTo.File(new JsonFormatter(), "log.txt")
                .CreateLogger();

            try
            {
                Log.Information("Iniciando el Servidor API Backend");
                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Fatal($"Servidor API Backend terminado inesperadamente. Error {ex.Message}");
            }
            finally
            {
                Log.Information("Finalizando servidor API Backend...");
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                //.UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
           
    }
}
