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

        public ArticlesController(ApplicationDbContext context)
        {
            _context = context;
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
                Status = "OnReview",
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

                var filePath = Path.Combine(uploadsFolder, model.File.FileName); // Используем FileName
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.File.CopyToAsync(stream); // Копируем содержимое файла
                }

                article.FilePath = filePath; // Сохраняем путь к файлу в базе данных
            }

            _context.AspNetArticles.Add(article);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Article created successfully", ArticleId = article.Id });
        }
    }

    public class ArticleModel
    {
        public string Title { get; set; }
        public IFormFile File { get; set; }
        public string Content { get; set; }
    }
}