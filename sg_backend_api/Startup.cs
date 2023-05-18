using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SG_Backend_api.Engines;
using Serilog;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Reflection;
using System.Text;

namespace SG_Backend_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Log.Information("Configurando los servicios...");
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // Este método es llamado por el tiempo de ejecución. Use este método para agregar servicios al contenedor.
        public void ConfigureServices(IServiceCollection services)
        {
            Log.Information("Inyectando metodos...");

            // CORS - Esto habilita todo, puede que no sea lo necesario, evalúar en futuro
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                          builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .Build());
            });

            // JWT
            dynamic JwtConfig = new
            {
                Issuer = Configuration.GetSection("JWT:Issuer").Value,
                Key = Configuration.GetSection("JWT:Key").Value
            };

            // Eliminar claims predeterminados 
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = JwtConfig.Issuer,
                        ValidAudience = JwtConfig.Issuer,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtConfig.Key)),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            // ENGINES
            services.AddTransient<IDBEngine, DBEngine>();
            services.AddTransient<ICryptoEngine, CryptoEngine>();

            // Reemplazamos el System.Text.Json predeterminado de .NET para utilizar Newtonsoft
            services.AddControllers().AddNewtonsoftJson();

            // SWAGGER
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SG_Backend_api", Version = "v1", 
                             Description = "Marco de trabajo BackEnd para TecnoGlobal. <br> " +
                                            "Proyecto Sistema de Gestion. <br><br>" +
                                            "Herramientas: <br>" +
                                            "C# REST API utilizando autenticación basica JWT para los usuarios,  <br> " +
                                            "Framework Dapper para SQL Server. <br>  " +
                                            "Newtonsoft JSON para la serializacion de mensajes,  <br> " +
                                            "Documentacion APIs con Swagger y Docker-ready."
                });
                   
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Header de autorización JWT utilizando el esquema Bearer.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                        Reference = new OpenApiReference
                            {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                            },
                            Name = "Bearer",
                            Scheme = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
        }

        // Este método es llamado en tiempo de ejecución. Es para configurar la canalización de solicitudes HTTP.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            Log.Information("Configurando solicitudes http...");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
 
            }
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SG_Backend_api v1"));
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            Log.Information("Servidor listo.");
        }
    }
}
