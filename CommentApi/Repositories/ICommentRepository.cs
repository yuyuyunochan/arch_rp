using CommentApi.Models;

namespace CommentApi.Repositories;

public interface ICommentRepository
{
    Task SeedDatabaseFromJsonPlaceholder();
    IEnumerable<Comment> GetAll();
    Comment? GetById(int id);
    Comment Add(Comment comment);
    Comment? Update(int id, Comment comment);
    bool Delete(int id);
}