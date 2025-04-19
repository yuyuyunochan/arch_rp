using CommentApi.Models;
using CommentApi.Repositories;

namespace CommentApi.Services;

public class CommentService
{
    private readonly ICommentRepository _repository;

    public CommentService(ICommentRepository repository)
    {
        _repository = repository;
    }

    public IEnumerable<Comment> GetAll() => _repository.GetAll();

    public Comment? GetById(int id) => _repository.GetById(id);

    public Comment Add(Comment comment) => _repository.Add(comment);

    public Comment? Update(int id, Comment comment) => _repository.Update(id, comment);

    public bool Delete(int id) => _repository.Delete(id);
}