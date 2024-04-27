using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using API.DTOs;
using AutoMapper;
using Core.Entities.Identity;
using Core.Services;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

            var user = new ApplicationUser
            {
                DisplayName = model.DisplayName,
                Email = model.Email,
                UserName = model.Email
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Results.Ok(new { Message = "Registration successful" });
            }

            return Results.BadRequest(new { Message = "Registration failed", Errors = result.Errors });

        })
        .WithName("Register")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        endpoints.MapPost("account/login",
            async (
                UserManager<ApplicationUser> userManager,
                SignInManager<ApplicationUser> signInManager,
                ITokenGenerationService _tokenService,
                LoginDto model) =>
            {
                // if (!ModelState.IsValid)
                // {
                //     return BadRequest(ModelState);
                // }

                var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var user = await userManager.FindByEmailAsync(model.Email);

                    var tokenClaims = new List<Claim>
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email),
                        new Claim(JwtRegisteredClaimNames.Name, user.UserName)
                    };

                    // // Generate the JWT token
                    var token = _tokenService.GenerateToken(tokenClaims);

                    return Results.Ok(new UserDto
                    {
                        Email = user.Email,
                        Token = token,
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

        endpoints.MapGet("account/load-user", async (UserManager<ApplicationUser> userManager, ITokenGenerationService _tokenService, HttpContext context) =>
        {
            string? userId = null;

            if (context.User?.Identity?.IsAuthenticated == true)
            {
                // use this when the user is authenticated using the cookie (Swagger UI)
                userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
            else if (context.Request.Headers.ContainsKey("Authorization"))
            {
                string authorizationHeader = context.Request.Headers["Authorization"];
                string bearerToken = authorizationHeader.Substring("Bearer ".Length);
                var claimsPrincipal = _tokenService.ValidateToken(bearerToken);

                if (claimsPrincipal == null)
                {
                    return Results.Unauthorized();
                }

                userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            }

            if (userId == null)
            {
                return Results.Unauthorized();
            }

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Results.NotFound(new { Message = "User not found" });
            }

            var tokenClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName)
            };

            // Generate the JWT token
            var token = _tokenService.GenerateToken(tokenClaims);

            var userDto = new UserDto
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = token // Set the Token property with the generated token
            };

            return Results.Ok(userDto);
        })
        .WithName("LoadUser")
        .Produces<UserDto>(StatusCodes.Status200OK)
        .Produces<string>(StatusCodes.Status401Unauthorized)
        .Produces<string>(StatusCodes.Status404NotFound);

        endpoints.MapGet("account/user-address", async (UserManager<ApplicationUser> userManager, ITokenGenerationService _tokenService, HttpContext context, ApplicationIdentityDbContext dbContext, IMapper mapper) =>
        {
            string? userId = null;

            if (context.User?.Identity?.IsAuthenticated == true)
            {
                // use this when the user is authenticated using the cookie (Swagger UI)
                userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
            else if (context.Request.Headers.ContainsKey("Authorization"))
            {
                string authorizationHeader = context.Request.Headers["Authorization"];
                string bearerToken = authorizationHeader.Substring("Bearer ".Length);
                var claimsPrincipal = _tokenService.ValidateToken(bearerToken);

                if (claimsPrincipal == null)
                {
                    return Results.Unauthorized();
                }

                userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            }

            if (userId == null)
            {
                return Results.Unauthorized();
            }

            var user = dbContext.Users.Include(u => u.Address).FirstOrDefault(u => u.Id == userId);
            if (user == null) return Results.NotFound();
            var address = user.Address != null ? new AddressDto
            {
                FirstName = user.Address.FirstName,
                LastName = user.Address.LastName,
                Street = user.Address.Street,
                City = user.Address.City,
                State = user.Address.State,
                ZipCode = user.Address.ZipCode
            } : null;
            return Results.Ok(address);
        })
            .WithName("GetUserAddress")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized);

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
            async (UserManager<ApplicationUser> userManager, ITokenGenerationService _tokenService, HttpContext context, AddressDto model, ApplicationIdentityDbContext dbContext, IMapper mapper) =>
            {
                // if (!ModelState.IsValid)
                // {
                //     return BadRequest(ModelState);
                // }

                string? userId = null;

                if (context.User?.Identity?.IsAuthenticated == true)
                {
                    // use this when the user is authenticated using the cookie (Swagger UI)
                    userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                }
                else if (context.Request.Headers.ContainsKey("Authorization"))
                {
                    string authorizationHeader = context.Request.Headers["Authorization"];
                    string bearerToken = authorizationHeader.Substring("Bearer ".Length);
                    var claimsPrincipal = _tokenService.ValidateToken(bearerToken);

                    if (claimsPrincipal == null)
                    {
                        return Results.Unauthorized();
                    }

                    userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                }

                if (userId == null)
                {
                    return Results.Unauthorized();
                }

                var user = dbContext.Users.Include(u => u.Address).FirstOrDefault(u => u.Id == userId);

                if (user == null)
                {
                    return Results.NotFound(new { Message = "User not found" });
                }
                if (user.Address == null)
                {
                    user.Address = new Address
                    {
                        Id = Guid.NewGuid().ToString(),
                        ApplicationUserId = user.Id,
                        ApplicationUser = user,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Street = model.Street,
                        City = model.City,
                        State = model.State,
                        ZipCode = model.ZipCode
                    };
                    dbContext.Address.Add(user.Address);
                }
                else
                {
                    user.Address.FirstName = model.FirstName;
                    user.Address.LastName = model.LastName;
                    user.Address.Street = model.Street;
                    user.Address.City = model.City;
                    user.Address.State = model.State;
                    user.Address.ZipCode = model.ZipCode;
                    dbContext.Entry(user.Address).State = EntityState.Modified;
                }

                await dbContext.SaveChangesAsync();

                return Results.Ok(new { Message = "User address updated successfully" });

            })
            .WithName("UpdateUserAddress")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized);

        return endpoints;
    }
}
