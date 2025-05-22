using System;

namespace final_backend_project.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; } // Можно использовать для метаданных
        public string Status { get; set; } = "Not Reviewed";
        public DateTime CreatedAt { get; set; }
        public string AuthorId { get; set; }
        public ApplicationUser? Author { get; set; }
        public string? ReviewerId { get; set; }
        public ApplicationUser? Reviewer { get; set; }
        // Новое поле для пути к файлу
        public string? FilePath { get; set; }
    }
}