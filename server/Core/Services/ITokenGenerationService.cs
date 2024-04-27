using System.Security.Claims;

namespace Core.Services;

public interface ITokenGenerationService
{
    string GenerateToken(IEnumerable<Claim> claims, int expirationMinutes = 60);

    ClaimsPrincipal ValidateToken(string token);
}
