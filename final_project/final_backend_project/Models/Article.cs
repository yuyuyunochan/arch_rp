using System;

namespace final_backend_project.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? AuthorId { get; set; }
        public ApplicationUser? Author { get; set; }
    }
}