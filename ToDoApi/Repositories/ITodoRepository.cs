using System.Collections.Generic;

namespace ToDoApi.Repositories;
using ToDoApi.Models;


public interface ITodoRepository
{
    IEnumerable<TodoItem> GetAll();
    TodoItem? GetById(int id);
    TodoItem Add(TodoItem todo);
    TodoItem? Update(int id, TodoItem updatedTodo);
    bool Delete(int id);
}