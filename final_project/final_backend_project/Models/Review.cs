using System;

namespace final_backend_project.Models
{
public class Review
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }

    // Новые поля для рецензии
    public int OverallRating { get; set; }
    public string Recommendation { get; set; }
    public string TechnicalMerit { get; set; }
    public string Originality { get; set; }
    public string PresentationQuality { get; set; }
    public string AdditionalComments { get; set; }
    public string ConfidentialCommentsToEditor { get; set; }

    // Связь со статьёй
    public int ArticleId { get; set; }
    public Article Article { get; set; }

    // Связь с рецензентом
    public string ReviewerId { get; set; }
    public ApplicationUser Reviewer { get; set; }
}
}