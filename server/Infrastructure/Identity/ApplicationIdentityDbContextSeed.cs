using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Identity;

public class ApplicationIdentityDbContextSeed
{
    private ILogger<ApplicationIdentityDbContextSeed> _logger;

    public ApplicationIdentityDbContextSeed(ILogger<ApplicationIdentityDbContextSeed> logger)
    {
        _logger = logger;
    }

    public async Task MigrateAndSeedAsync(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.CreateScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationIdentityDbContext>();

            await MigrateAsync(context);

            await SeedUserAsync(userManager, context);
        }
    }

    private async Task MigrateAsync(ApplicationIdentityDbContext context)
    {
        try
        {
            await context.Database.MigrateAsync();
            await context.Database.EnsureCreatedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while migrating the identity database.");
        }
    }

    private async Task SeedUserAsync(UserManager<ApplicationUser> userManager, ApplicationIdentityDbContext context)
    {
        using var transaction = context.Database.BeginTransaction();
        try
        {
            if (!userManager.Users.Any())
            {
                var user = new ApplicationUser
                {
                    UserName = "frank@rizzo.com",
                    Email = "frank@rizzo.com",
                    DisplayName = "Frank Rizzo",
                    // Add other properties as needed
                    Address = new Address
                    {
                        Id = Guid.NewGuid().ToString(),
                        FirstName = "Frank",
                        LastName = "Rizzo",
                        Street = "55 Spring Street",
                        City = "Cambridge",
                        State = "Massachusetts",
                        ZipCode = "02138"
                    }
                };

                var result = await userManager.CreateAsync(user, "Admin_1234");

                if (result.Succeeded)
                {
                    // Optionally, you can do additional seeding or customization here
                    // For example, add user roles, claims, etc.
                    transaction.Commit();
                    _logger.LogInformation("Seeded the Identity database.");
                }
                else
                {
                    throw new Exception($"User creation failed: {string.Join(", ", result.Errors)}");
                }
            }
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            _logger.LogError(ex, "An error occurred while seeding the identity database.");
            throw;
        }
    }
}