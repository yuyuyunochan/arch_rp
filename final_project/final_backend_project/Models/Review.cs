using System;

namespace final_backend_project.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string? Content { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ReviewerId { get; set; }
        public ApplicationUser? Reviewer { get; set; }
        public int ArticleId { get; set; }
        public Article? Article { get; set; }
    }
}