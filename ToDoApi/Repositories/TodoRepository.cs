using System.Collections.Generic;

namespace ToDoApi.Repositories;
using ToDoApi.Models;


public class TodoRepository : ITodoRepository
{
    private readonly Dictionary<int, TodoItem> _todos = new();
    private int _nextId = 1;

    public IEnumerable<TodoItem> GetAll()
    {
        return _todos.Values;
    }

    public TodoItem? GetById(int id)
    {
        return _todos.TryGetValue(id, out var todo) ? todo : null;
    }

    public TodoItem Add(TodoItem todo)
    {
        todo.Id = _nextId++;
        _todos[todo.Id] = todo;
        return todo;
    }

    public TodoItem? Update(int id, TodoItem updatedTodo)
    {
        if (!_todos.ContainsKey(id)) return null;

        updatedTodo.Id = id;
        _todos[id] = updatedTodo;
        return updatedTodo;
    }

    public bool Delete(int id)
    {
        return _todos.Remove(id);
    }
}