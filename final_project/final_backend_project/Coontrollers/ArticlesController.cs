using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using final_backend_project.Data;
using final_backend_project.Models;
using final_backend_project.Models.Dto;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

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
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _context.AspNetArticles
                .Include(a => a.Author)
                .Include(a => a.Reviewer)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    AuthorName = a.Author.UserName ?? "Неизвестный автор",
                    ReviewerName = a.Reviewer.UserName ?? "Не назначен"
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
                return Forbid();
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

            var activeArticles = await _context.AspNetArticles
                .Where(a => a.ReviewerId == userId && (a.Status == "Under Review"))
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    Author = a.Author.UserName
                })
                .ToListAsync();

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
                .Where(a => a.Status == "Not Reviewed" && a.ReviewerId == null)
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
        [HttpPost("{id}/review")]
        [Authorize(Roles = "Reviewer")]
        public async Task<IActionResult> SubmitReview(int id, [FromBody] ReviewModel reviewData)
        {
            var article = await _context.AspNetArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound(new { Message = "Статья не найдена." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "Пользователь не авторизован." });
            }

            var review = new Review
            {
                ArticleId = id,
                ReviewerId = userId,
                Recommendation = reviewData.Recommendation,
                TechnicalMerit = reviewData.TechnicalMerit,
                Originality = reviewData.Originality,
                PresentationQuality = reviewData.PresentationQuality,
                AdditionalComments = reviewData.AdditionalComments,
                ConfidentialCommentsToEditor = reviewData.ConfidentialCommentsToEditor,
                CreatedAt = DateTime.UtcNow
            };

            _context.AspNetReviews.Add(review);

            if (reviewData.Status == "Under Revision")
            {
                article.Status = "Under Revision";
                article.ReviewerId = null;
            }
            else
            {
                article.Status = reviewData.Status;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Рецензия успешно отправлена.", ReviewId = review.Id });
        }
        [HttpGet("reviews/{articleId}")]
        [Authorize(Roles = "Author")]
        public async Task<IActionResult> GetReviewsForArticle(int articleId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "Пользователь не авторизован." });
            }

            var article = await _context.AspNetArticles.FindAsync(articleId);
            if (article == null)
            {
                return NotFound(new { Message = "Статья не найдена." });
            }

            if (article.AuthorId != userId)
            {
                return Ok(new { Message = "Some message" });
            }
            var review = await _context.AspNetReviews
                .Where(r => r.ArticleId == articleId)
                .Include(r => r.Reviewer)
                .Select(r => new
                {
                    r.Id,
                    r.Recommendation,
                    r.TechnicalMerit,
                    r.Originality,
                    r.PresentationQuality,
                    r.AdditionalComments,
                    r.ConfidentialCommentsToEditor,
                    r.CreatedAt,
                    ReviewerName = r.Reviewer.UserName ?? "Не назначен"
                })
                .FirstOrDefaultAsync();

            if (review == null)
            {
                return Ok(null);
            }

            return Ok(review);
        }
        [HttpPut("{id}/update-status")]
        [Authorize(Roles = "Author,Reviewer")]
        
        public async Task<IActionResult> UpdateArticleStatus(int id, [FromBody] UpdateArticleStatusRequest request)
        {
            var article = await _context.AspNetArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound(new { Message = "Статья не найдена." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "Пользователь не авторизован." });
            }

            var userRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (userRole == "Author" && article.AuthorId != userId)
            {
                return Forbid("Вы не являетесь автором этой статьи.");
            }

            if (userRole == "Reviewer" && article.ReviewerId != userId)
            {
                return Forbid("Вы не назначены рецензентом для этой статьи.");
            }

            if (userRole == "Author" && !new[] { "Not Reviewed" }.Contains(request.Status))
            {
                return BadRequest("Авторы могут только отправлять статью на повторное рассмотрение.");
            }

            if (userRole == "Reviewer" && !new[] { "Under Revision", "Accepted", "Rejected" }.Contains(request.Status))
            {
                return BadRequest("Недопустимый статус для рецензента.");
            }

            article.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Статус статьи успешно обновлен.", ArticleId = article.Id });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
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
                CreatedAt = DateTime.UtcNow,
                AuthorId = userId,
            };
            if (model.File != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, model.File.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.File.CopyToAsync(stream);
                }

                article.FilePath = filePath;
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
                .Where(a => a.AuthorId == userId)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.CreatedAt,
                    ReviewerName = a.Reviewer.UserName ?? "Не назначен"
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
    public class ReviewModel
    {
        [Required]
        public string Recommendation { get; set; }

        [Required]
        public string TechnicalMerit { get; set; }

        [Required]
        public string Originality { get; set; }

        [Required]
        public string PresentationQuality { get; set; }

        [Required]
        public string AdditionalComments { get; set; }

        [Required]
        public string ConfidentialCommentsToEditor { get; set; }
        public string Status { get; set; }

    }
}