using System.Net.Http.Json;
using CommentApi.Models;

namespace CommentApi.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly Dictionary<int, Comment> _comments = new();
    private int _nextId = 1;

    public Task SeedDatabaseFromJsonPlaceholder()
    {
        // Реализация может быть пустой, если этот метод не нужен для этого класса
        throw new System.NotImplementedException("This method is not implemented for this repository.");
    }

    public IEnumerable<Comment> GetAll() => _comments.Values;

    public Comment? GetById(int id) => _comments.ContainsKey(id) ? _comments[id] : null;

    public Comment Add(Comment comment)
    {
        comment.Id = _nextId++;
        _comments[comment.Id] = comment;
        return comment;
    }

    public Comment? Update(int id, Comment comment)
    {
        if (!_comments.ContainsKey(id)) return null;

        comment.Id = id;
        _comments[id] = comment;
        return comment;
    }

    public bool Delete(int id)
    {
        return _comments.Remove(id);
    }
}