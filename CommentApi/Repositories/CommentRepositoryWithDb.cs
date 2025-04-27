using CommentApi.Models;
using CommentApi.Data;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CommentApi.Repositories;

public class CommentRepositoryWithDb : ICommentRepository
{
    private readonly CommentDbContext _context;
    private readonly HttpClient _httpClient;

    public CommentRepositoryWithDb(CommentDbContext context, HttpClient httpClient)
    {
        _context = context;
        _httpClient = httpClient;
    }

public async Task SeedDatabaseFromJsonPlaceholder()
{
    // Очистка таблицы
    _context.Comments.RemoveRange(_context.Comments);
    await _context.SaveChangesAsync(); // Добавьте await

    var comments = await _httpClient.GetFromJsonAsync<List<CommentDto>>("https://jsonplaceholder.typicode.com/comments");

    if (comments == null || comments.Count == 0)
    {
        Console.WriteLine("No data received from JSONPlaceholder.");
        return;
    }

    foreach (var dto in comments)
    {
        var comment = new Comment
        {
            Name = dto.Name,
            Email = dto.Email,
            Body = dto.Body
            // Id не указывается, так как он автоинкрементируется
        };

        Add(comment);
    }
}

// DTO для данных из JSONPlaceholder
public class CommentDto
{
    public int PostId { get; set; }
    public int Id { get; set; } // Это поле игнорируется
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
}
    public IEnumerable<Comment> GetAll()
    {
        return _context.Comments.OrderBy(c => c.Id).ToList();
    }

    public Comment? GetById(int id)
    {
        return _context.Comments.Find(id);
    }

    public Comment Add(Comment comment)
    {
        _context.Comments.Add(comment);
        _context.SaveChanges();
        return comment;
    }

    public Comment? Update(int id, Comment updatedComment)
    {
        var comment = _context.Comments.Find(id);
        if (comment == null) return null;

        comment.Name = updatedComment.Name;
        comment.Email = updatedComment.Email;
        comment.Body = updatedComment.Body;

        _context.SaveChanges();
        return comment;
    }

    public bool Delete(int id)
    {
        var comment = _context.Comments.Find(id);
        if (comment == null) return false;

        _context.Comments.Remove(comment);
        _context.SaveChanges();
        return true;
    }
}