using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using final_backend_project.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization; // Добавленная директива
using System.Threading.Tasks;

namespace final_backend_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class usersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public usersController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        // Регистрация пользователя
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                Role = model.Role // Сохраняем роль
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Добавляем пользователя в выбранную роль
                await _userManager.AddToRoleAsync(user, model.Role);

                return Ok(new { Message = "User registered successfully" });
            }

            return BadRequest(new { Errors = result.Errors });
        }

        // Вход пользователя
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { Message = "Invalid username or password" });
            }

            // Проверяем, заблокирован ли пользователь
            if (user.LockoutEnd != null && user.LockoutEnd > DateTime.UtcNow)
            {
                return Unauthorized(new { Message = "Your account is locked out." });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User is not authenticated" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            // Получаем роли пользователя
            var roles = await _userManager.GetRolesAsync(user);

            // Если пользователь администратор, возвращаем список всех пользователей
            if (roles.Contains("Admin"))
            {
                var allUsers = await _userManager.Users.Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.LockoutEnd
                }).ToListAsync();

                return Ok(new
                {
                    Username = user.UserName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault(),
                    IsAdmin = true,
                    Users = allUsers
                });
            }

            // Если пользователь не администратор, возвращаем только его данные
            return Ok(new
            {
                Username = user.UserName,
                Email = user.Email,
                Role = roles.FirstOrDefault(),
                IsAdmin = false
            });
        }
        // Получение всех пользователей (доступно только администратору)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")] // Теперь работает
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users.Select(u => new
            {
                u.Id,
                u.UserName,
                u.Email,
                u.LockoutEnd
            }));
        }

        // Блокировка пользователя (доступно только администратору)
        [HttpPost("{userId}/block")]
        [Authorize(Roles = "Admin")] // Теперь работает
        public async Task<IActionResult> BlockUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100); // Блокируем на 100 лет
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "User blocked successfully" });
        }

        // Разблокировка пользователя (доступно только администратору)
        [HttpPost("{userId}/unblock")]
        [Authorize(Roles = "Admin")] // Теперь работает
        public async Task<IActionResult> UnblockUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            user.LockoutEnd = null; // Снимаем блокировку
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "User unblocked successfully" });
        }

        // Генерация JWT-токена
        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var roles = _userManager.GetRolesAsync(user).Result;
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // public class RegisterModel
    // {
    //     public string Username { get; set; }
    //     public string Email { get; set; }
    //     public string Password { get; set; }
    // }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}