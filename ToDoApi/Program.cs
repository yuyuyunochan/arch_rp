using Microsoft.AspNetCore.Mvc;
using ToDoApi.Repositories;
using ToDoApi.Services;
using ToDoApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<TodoService>();

var app = builder.Build();

app.MapGet("/api/todo", (TodoService service) =>
{
    return Results.Ok(service.GetAll());
});

app.MapGet("/api/todo/{id}", (int id, TodoService service) =>
{
    var todo = service.GetById(id);
    return todo is not null ? Results.Ok(todo) : Results.NotFound();
});

app.MapPost("/api/todo", (TodoService service, [FromBody] TodoItem todo) =>
{
    var addedTodo = service.Add(todo);
    return Results.Created($"/api/todo/{addedTodo.Id}", addedTodo);
});

app.MapPut("/api/todo/{id}", (int id, TodoService service, [FromBody] TodoItem updatedTodo) =>
{
    var updated = service.Update(id, updatedTodo);
    return updated is not null ? Results.Ok(updated) : Results.NotFound();
});

app.MapDelete("/api/todo/{id}", (int id, TodoService service) =>
{
    var deleted = service.Delete(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();