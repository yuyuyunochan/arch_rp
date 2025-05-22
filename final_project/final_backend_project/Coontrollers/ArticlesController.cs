using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using final_backend_project.Data;
using final_backend_project.Models;
using final_backend_project.Models.Dto;
using System.Security.Claims;           // Для ClaimTypes
using Microsoft.AspNetCore.Http;        // Для FindFirstValue()

namespace final_backend_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ArticlesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager; // Внедрение UserManager
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _context.AspNetArticles
                .Include(a => a.Author) // Загружаем связанных авторов
                .Include(a => a.Reviewer) // Загружаем связанных рецензентов
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    AuthorName = a.Author.UserName ?? "Неизвестный автор", // Имя автора
                    ReviewerName = a.Reviewer.UserName ?? "Не назначен" // Имя рецензента
                })
                .ToListAsync();

            return Ok(articles);
        }
        [HttpPost("{id}/assign-to-reviewer")]
        [Authorize(Roles = "Reviewer")]
        public async Task<IActionResult> AssignArticleToReviewer(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User is not authenticated" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.Role != "Reviewer")
            {
                return Forbid(); // Запрещаем доступ, если пользователь не является рецензентом
            }

            var article = await _context.AspNetArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound(new { Message = "Article not found" });
            }

            if (!string.IsNullOrEmpty(article.ReviewerId))
            {
                return BadRequest(new { Message = "Article is already assigned to another reviewer" });
            }

            article.ReviewerId = userId;
            article.Status = "Under Review";

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Article successfully assigned to you", ArticleId = article.Id });
        }
        [HttpGet("assigned")]
        [Authorize(Roles = "Reviewer")]
        public async Task<IActionResult> GetAssignedArticles()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User is not authenticated" });
            }

            // Активные статьи
            var activeArticles = await _context.AspNetArticles
                .Where(a => a.ReviewerId == userId && (a.Status == "Under Review" || a.Status == "Under Revision"))
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    Author = a.Author.UserName
                })
                .ToListAsync();

            // Архивные статьи
            var archivedArticles = await _context.AspNetArticles
                .Where(a => a.ReviewerId == userId && (a.Status == "Accepted" || a.Status == "Rejected"))
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    Author = a.Author.UserName
                })
                .ToListAsync();

            return Ok(new
            {
                ActiveArticles = activeArticles,
                ArchivedArticles = archivedArticles
            });
        }

        [HttpGet("available-for-review")]
        [Authorize(Roles = "Reviewer")]
        public async Task<IActionResult> GetAvailableArticlesForReview()
        {
            var articles = await _context.AspNetArticles
                .Where(a => a.Status == "Not Reviewed" && a.ReviewerId == null) // Только статьи без рецензента
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    Author = a.Author.UserName
                })
                .ToListAsync();

            return Ok(articles);
        }
        public class UpdateArticleStatusRequest
        {
            public string Status { get; set; }
        }

        [HttpPut("{id}/update-status")]
        [Authorize(Roles = "Reviewer")]
        public async Task<IActionResult> UpdateArticleStatus(int id, [FromBody] UpdateArticleStatusRequest request)
        {
            var article = await _context.AspNetArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound(new { Message = "Article not found" });
            }

            // Проверяем, что статья принадлежит текущему рецензенту
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (article.ReviewerId != userId)
            {
                return Forbid();
            }

            article.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Article status updated successfully", ArticleId = article.Id });
        }

        // public class UpdateArticleStatusRequest
        // {
        //     public string Status { get; set; }
        // }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Разрешаем доступ только администраторам
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.AspNetArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound(new { Message = "Статья не найдена." });
            }

            _context.AspNetArticles.Remove(article);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Статья успешно удалена.", ArticleId = id });
        }
        [HttpPost]
        [Authorize(Roles = "Author")]
        public async Task<IActionResult> CreateArticle([FromForm] ArticleModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User is not authenticated" });
            }

            var article = new Article
            {
                Title = model.Title,
                Content = model.Content,
                // Status = "",
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
            };

            // Сохраняем файл на диск (пример)
            // Сохраняем файл на диск (пример)
            if (model.File != null)
            {
                // Создаем путь для сохранения файла
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder); // Создаем директорию, если её нет
                }

                var filePath = Path.Combine(uploadsFolder, model.File.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.File.CopyToAsync(stream);
                }

                article.FilePath = filePath; // Сохраняем путь к файлу в базе данных
            }

            _context.AspNetArticles.Add(article);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Article created successfully", ArticleId = article.Id });
        }
        [HttpGet("my-articles")]
        [Authorize(Roles = "Author")]
        public async Task<IActionResult> GetMyArticles()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User is not authenticated" });
            }

            var articles = await _context.AspNetArticles
                .Include(a => a.Author) // Загружаем связанных авторов
                .Include(a => a.Reviewer) // Загружаем связанных рецензентов
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    ReviewerName = a.Reviewer.UserName ?? "Не назначен" // Имя рецензента
                })
                .ToListAsync();

            return Ok(articles);
        }
    }

    public class ArticleModel
    {
        public string Title { get; set; }
        public IFormFile File { get; set; }
        public string Content { get; set; }
    }
}