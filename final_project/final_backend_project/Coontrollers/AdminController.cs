using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using final_backend_project.Models;
using System.Threading.Tasks;

namespace final_backend_project.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Получить список всех пользователей
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email,
                    Roles = _userManager.GetRolesAsync(u).Result,
                    u.LockoutEnd
                })
                .ToListAsync();

            return Ok(users);
        }

        // Создать нового пользователя
        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            if (!await _roleManager.RoleExistsAsync(request.Role))
            {
                return BadRequest(new { Message = $"Role '{request.Role}' does not exist." });
            }

            var user = new ApplicationUser
            {
                UserName = request.UserName,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to create user.", Errors = result.Errors });
            }

            await _userManager.AddToRoleAsync(user, request.Role);

            return Ok(new { Message = "User created successfully.", UserId = user.Id });
        }

        // Удалить пользователя
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to delete user.", Errors = result.Errors });
            }

            return Ok(new { Message = "User deleted successfully." });
        }
        

        // Заблокировать пользователя
        [HttpPost("block-user/{id}")]
        public async Task<IActionResult> BlockUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100); // Блокируем на 100 лет
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "User blocked successfully." });
        }

        // Разблокировать пользователя
        [HttpPost("unblock-user/{id}")]
        public async Task<IActionResult> UnblockUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            user.LockoutEnd = null; // Снимаем блокировку
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "User unblocked successfully." });
        }
    }

    public class CreateUserRequest
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Роль: "Author" или "Reviewer"
    }
}