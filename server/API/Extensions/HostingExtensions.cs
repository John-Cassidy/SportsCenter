using API.Endpoints;
using Core.Repositories;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class HostingExtensions
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddDbContext<SportsCenterContext>(opt =>
        {
            opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
        });

        builder.Services.AddScoped<IProductRepository, ProductRepository>();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app, ConfigurationManager configuration)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        if (app.Environment.IsProduction())
        {
            app.UseHttpsRedirection();
        }

        app.AddWeatherForecastEndpoints();
        app.AddProductsEndpoints();

        return app;
    }
}
