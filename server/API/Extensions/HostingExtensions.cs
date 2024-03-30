﻿using API.Endpoints;
using API.Handlers;
using API.Profiles;
using AutoMapper;
using Core.Repositories;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class HostingExtensions
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddLogging();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddDbContext<SportsCenterContext>(opt =>
        {
            opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
        });

        builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        builder.Services.AddIMapper();

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddExceptionHandler<GeneralExceptionHandler>();
    }



    public static async Task<WebApplication> ConfigurePipeline(this WebApplication app, ConfigurationManager configuration)
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

        app.UseExceptionHandler(_ => { });

        app.AddWeatherForecastEndpoints();
        app.AddProductsEndpoints();

        using var scope = app.Services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        var context = scope.ServiceProvider.GetRequiredService<SportsCenterContext>();
        try
        {
            await context.Database.MigrateAsync();
            await context.Database.EnsureCreatedAsync();
            logger.LogInformation("Database migration completed successfully.");
            // Create an instance of SportsContextSeed
            var seedLogger = scope.ServiceProvider.GetRequiredService<ILogger<SportsCenterContextSeed>>();
            var sportsContextSeed = new SportsCenterContextSeed(seedLogger);
            await sportsContextSeed.SeedDataAsync(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database.");
        }

        return app;
    }

    private static void AddIMapper(this IServiceCollection services)
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.ShouldMapProperty = p => (p.GetMethod?.IsPublic ?? false) || (p.GetMethod?.IsAssembly ?? false);
            cfg.AddProfile<MappingProfile>();
        });
        // only during development, validate your mappings; remove it before release
#if DEBUG
        config.AssertConfigurationIsValid();
#endif
        // use DI (http://docs.automapper.org/en/latest/Dependency-injection.html) or create the mapper yourself
        var mapper = config.CreateMapper();
        services.AddSingleton(mapper);
    }
}