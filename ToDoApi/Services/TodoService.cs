using System.Collections.Generic;
using ToDoApi.Models;
using ToDoApi.Repositories;
namespace ToDoApi.Services;



public class TodoService
{
    private readonly ITodoRepository _repository;

    public TodoService(ITodoRepository repository)
    {
        _repository = repository;
    }

    public IEnumerable<TodoItem> GetAll()
    {
        return _repository.GetAll();
    }

    public TodoItem? GetById(int id)
    {
        return _repository.GetById(id);
    }

    public TodoItem Add(TodoItem todo)
    {
        return _repository.Add(todo);
    }

    public TodoItem? Update(int id, TodoItem updatedTodo)
    {
        return _repository.Update(id, updatedTodo);
    }

    public bool Delete(int id)
    {
        return _repository.Delete(id);
    }
}