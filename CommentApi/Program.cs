// Program.cs
using CommentApi.Models;
using CommentApi.Data;
using CommentApi.Repositories;
using CommentApi.Services;
using CommentApi.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Comment API", Version = "v1" });
});

builder.Services.AddHttpClient();
builder.Services.AddScoped<ICommentRepository, CommentRepositoryWithDb>();
builder.Services.AddScoped<CommentService>();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Warning);

builder.Services.AddDbContext<CommentDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<IDbContextFactory<CommentDbContext>>(provider =>
{
    return new CustomDbContextFactory(provider);
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


builder.Services.AddSingleton<ILoggerProvider>(provider =>
{
    var dbContextFactory = provider.GetRequiredService<IDbContextFactory<CommentDbContext>>();
    return new DatabaseLoggerProvider(
        (category, level) => 
            level >= LogLevel.Information && 
            !category.StartsWith("Microsoft.EntityFrameworkCore"), // Игнорируем логи EF Core
        dbContextFactory
    );
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Comment API V1");
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseRouting();
app.UseCors("AllowAll");
// Миграции базы данных
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CommentDbContext>();
    dbContext.Database.Migrate();
}

app.MapGet("/loaddata", async ([FromServices] ICommentRepository repository) =>
{
    await repository.SeedDatabaseFromJsonPlaceholder();
    app.Logger.LogInformation("Database loaded");
    return Results.Ok("Database loaded");
});

app.MapGet("/comments", ([FromServices] ICommentRepository repository) =>
{
    var comments = repository.GetAll();
    app.Logger.LogInformation("Comments retrieved");
    return Results.Ok(comments);
});

app.MapGet("/comments/{id}", (int id, [FromServices] CommentService service) =>
{
    var comment = service.GetById(id);
    if (comment != null)
    {
        app.Logger.LogInformation($"Comment with ID {id} retrieved");
    }
    else
    {
        app.Logger.LogWarning($"Comment with ID {id} not found");
    }
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", ([FromServices] ICommentRepository repository, [FromBody] Comment comment) =>
{
    var addedComment = repository.Add(comment);
    app.Logger.LogInformation($"Comment added with ID {addedComment.Id}");
    return Results.Created($"/comments/{addedComment.Id}", addedComment);
});

app.MapPatch("/comments/{id}", (int id, [FromServices] ICommentRepository repository, [FromBody] Comment updatedComment) =>
{
    var comment = repository.Update(id, updatedComment);
    if (comment != null)
    {
        app.Logger.LogInformation($"Comment with ID {id} updated");
    }
    else
    {
        app.Logger.LogWarning($"Comment with ID {id} not found for update");
    }
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapDelete("/comments/{id}", (int id, [FromServices] ICommentRepository repository) =>
{
    var deleted = repository.Delete(id);
    if (deleted)
    {
        app.Logger.LogInformation($"Comment with ID {id} deleted");
    }
    else
    {
        app.Logger.LogWarning($"Comment with ID {id} not found for deletion");
    }
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/logs", ([FromServices] CommentDbContext dbContext) =>
{
    var logs = dbContext.LogEntries.ToList();
    return Results.Ok(logs);
});

app.Run();