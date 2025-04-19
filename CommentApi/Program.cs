using CommentApi.Models;
using CommentApi.Repositories;
using CommentApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Добавление сервисов
builder.Services.AddHttpClient(); // Регистрация HttpClient
builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
builder.Services.AddSingleton<CommentService>();

var app = builder.Build();

// Маршруты
app.MapGet("/comments", (CommentService service) =>
{
    var comments = service.GetAll();
    return Results.Ok(comments);
});

app.MapGet("/comments/{id}", (int id, CommentService service) =>
{
    var comment = service.GetById(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", (Comment comment, CommentService service) =>
{
    var addedComment = service.Add(comment);
    return Results.Created($"/comments/{addedComment.Id}", addedComment);
});

app.MapPatch("/comments/{id}", (int id, Comment updatedComment, CommentService service) =>
{
    var comment = service.Update(id, updatedComment);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapDelete("/comments/{id}", (int id, CommentService service) =>
{
    var deleted = service.Delete(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();