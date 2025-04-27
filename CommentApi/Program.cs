using CommentApi.Models;
using CommentApi.Data;
using CommentApi.Repositories;
using CommentApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddScoped<ICommentRepository, CommentRepositoryWithDb>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddDbContext<CommentDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Применение миграций при запуске
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CommentDbContext>();
    dbContext.Database.Migrate(); // Применение миграций
}

// Маршруты...

// Заполнение базы данных данными из JSONPlaceholder
app.MapGet("/seed-database", async ([FromServices] ICommentRepository repository) =>
{
    await repository.SeedDatabaseFromJsonPlaceholder();
    return Results.Ok("Database seeded successfully!");
});

// Получение всех комментариев
app.MapGet("/comments", ([FromServices] ICommentRepository repository) =>
{
    var comments = repository.GetAll();
    return Results.Ok(comments);
});

// Получение комментария по ID
app.MapGet("/comments/{id}", (int id, [FromServices] CommentService service) =>
{
    var comment = service.GetById(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

// Добавление нового комментария
app.MapPost("/comments", ([FromServices] ICommentRepository repository, [FromBody] Comment comment) =>
{
    var addedComment = repository.Add(comment);
    return Results.Created($"/comments/{addedComment.Id}", addedComment);
});

// Обновление комментария
app.MapPatch("/comments/{id}", (int id, [FromServices] ICommentRepository repository, [FromBody] Comment updatedComment) =>
{
    var comment = repository.Update(id, updatedComment);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

// Удаление комментария
app.MapDelete("/comments/{id}", (int id, [FromServices] ICommentRepository repository) =>
{
    var deleted = repository.Delete(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();