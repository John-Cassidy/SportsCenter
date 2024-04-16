using System.Security.Claims;
using API.DTOs;
using AutoMapper;
using Core.Entities.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace API.Endpoints;

public static class AccountModule
{
    public static IEndpointRouteBuilder AddAccountEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("account/register", async (UserManager<ApplicationUser> userManager, IMapper mapper, RegisterDto model) =>
        {
            // if (!ModelState.IsValid)
            // {
            //     return BadRequest(ModelState);
            // }

            var user = mapper.Map<ApplicationUser>(model);

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Results.Ok(new { Message = "Registration successful" });
            }

            return Results.BadRequest(new { Message = "Registration failed", Errors = result.Errors });

        });

        endpoints.MapPost("account/login",
            async (UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, LoginDto model) =>
            {
                // if (!ModelState.IsValid)
                // {
                //     return BadRequest(ModelState);
                // }

                var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var user = await userManager.FindByEmailAsync(model.Email);

                    // Generate a JWT token with user claims
                    var tokenClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.DisplayName),
                    new Claim(ClaimTypes.Email, user.Email),
                    // Add more claims as needed
                };

                    // // Generate the JWT token
                    // var token = _tokenService.GenerateToken(tokenClaims);

                    return Results.Ok(new UserDto
                    {
                        Email = user.Email,
                        Token = "TEST",
                        DisplayName = user.DisplayName
                    });
                }
                return Results.Unauthorized();
            })
            .WithName("Login")
            .Produces<UserDto>(StatusCodes.Status200OK)
            .Produces<string>(StatusCodes.Status401Unauthorized);

        endpoints.MapPost("account/logout",
            async (SignInManager<ApplicationUser> signInManager) =>
            {
                await signInManager.SignOutAsync();
            })
            .WithName("Logout")
            .Produces<NoContent>(StatusCodes.Status204NoContent);

        endpoints.MapGet("account/user-address", [Authorize] async (UserManager<ApplicationUser> userManager, ClaimsPrincipal User, ApplicationIdentityDbContext dbContext, IMapper mapper) =>
        {
            var userId = userManager.GetUserId(User);
            if (userId == null) return Results.Unauthorized();
            var user = dbContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return Results.NotFound();
            var address = mapper.Map<AddressDto>(user.Address);
            return Results.Ok(address);
        });

        endpoints.MapGet("account/check-email-exists",
            async (UserManager<ApplicationUser> userManager, string email) =>
            {
                if (string.IsNullOrEmpty(email))
                {
                    return Results.BadRequest("Email is required");
                }

                var user = await userManager.FindByEmailAsync(email);

                if (user != null)
                {
                    return Results.Ok(new { EmailExists = true });
                }

                return Results.Ok(new { EmailExists = false });
            })
            .WithName("CheckEmailExists")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

        endpoints.MapPost("account/update-user-address",
            [Authorize] async (UserManager<ApplicationUser> userManager, ClaimsPrincipal User, AddressDto model, ApplicationIdentityDbContext dbContext, IMapper mapper) =>
            {
                // if (!ModelState.IsValid)
                // {
                //     return BadRequest(ModelState);
                // }

                var userId = userManager.GetUserId(User);
                var user = dbContext.Users.Find(userId);

                if (user == null)
                {
                    return Results.NotFound(new { Message = "User not found" });
                }

                var address = mapper.Map<Address>(model);
                user.Address = address;

                await dbContext.SaveChangesAsync();

                return Results.Ok(new { Message = "User address updated successfully" });

            })
            .WithName("UpdateUserAddress")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);

        return endpoints;
    }
}
