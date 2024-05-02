using System.Security.Claims;
using Core.Entities.Identity;
using Core.Services;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class HttpContextExtensions
{
    public static string GetBasketId(this HttpContext context)
    {
        if ((context?.User?.Identity?.IsAuthenticated ?? false) &&
        !string.IsNullOrEmpty(context?.User?.Identity?.Name))
        {
            context.Response.Cookies.Delete("basketId");
            return context.User.Identity.Name;
        }
        var basketId = context?.Request.Cookies["basketId"];
        if (basketId == null)
        {
            basketId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            context?.Response.Cookies.Append("basketId", basketId, cookieOptions);
        }
        return basketId;
    }

    public static async Task<string?> GetUserIdAsync(this HttpContext context, ITokenGenerationService _tokenService)
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
                return userId;
            }

            userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        }
        return userId;
    }

    public static async Task<string?> GetUserNameAsync(this HttpContext context, ITokenGenerationService _tokenService)
    {
        string? userName = null;

        if (context.User?.Identity?.IsAuthenticated == true)
        {
            // use this when the user is authenticated using the cookie (Swagger UI)
            userName = context.User?.Identity?.Name;
        }
        else if (context.Request.Headers.ContainsKey("Authorization"))
        {
            string authorizationHeader = context.Request.Headers["Authorization"];
            string bearerToken = authorizationHeader.Substring("Bearer ".Length);
            var claimsPrincipal = _tokenService.ValidateToken(bearerToken);

            if (claimsPrincipal == null)
            {
                return userName;
            }

            userName = claimsPrincipal.FindFirstValue("name");
        }
        return userName;
    }
}
