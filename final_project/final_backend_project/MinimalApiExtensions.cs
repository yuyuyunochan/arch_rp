using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using final_backend_project.Data;
using final_backend_project.Models;
using Newtonsoft.Json;

public static class MinimalApiExtensions
{
    public static void MapMinimalApi(this WebApplication app)
    {
        // Регистрация пользователя
        app.MapPost("/api/users/register", async context =>
        {
            var userManager = context.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
            var configuration = context.RequestServices.GetRequiredService<IConfiguration>();

            using var reader = new StreamReader(context.Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var registerModel = JsonConvert.DeserializeObject<RegisterModel>(requestBody);

            if (registerModel == null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { message = "Invalid request body" });
                return;
            }

            var user = new ApplicationUser
            {
                UserName = registerModel.Username,
                Email = registerModel.Email,
                Role = registerModel.Role
            };

            var result = await userManager.CreateAsync(user, registerModel.Password);
            if (!result.Succeeded)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { errors = result.Errors });
                return;
            }

            await userManager.AddToRoleAsync(user, registerModel.Role);

            context.Response.StatusCode = 200;
            await context.Response.WriteAsJsonAsync(new { message = "User registered successfully" });
        });

        // Вход пользователя
        app.MapPost("/api/users/login", async context =>
        {
            var userManager = context.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
            var configuration = context.RequestServices.GetRequiredService<IConfiguration>();

            using var reader = new StreamReader(context.Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var loginModel = JsonConvert.DeserializeObject<LoginModel>(requestBody);

            if (loginModel == null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { message = "Invalid request body" });
                return;
            }

            var user = await userManager.FindByNameAsync(loginModel.Username);
            if (user == null || !await userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new { message = "Login failed" });
                return;
            }

            var roles = await userManager.GetRolesAsync(user);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            context.Response.StatusCode = 200;
            await context.Response.WriteAsJsonAsync(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        });
    }
}

public class RegisterModel
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!;
}

public class LoginModel
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}