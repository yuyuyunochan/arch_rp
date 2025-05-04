// Data/CommentDbContext.cs
using CommentApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CommentApi.Data;

public class CommentDbContext : DbContext
{
    public DbSet<Comment> Comments { get; set; } = default!;
    public DbSet<Log> LogEntries { get; set; } = default!;

    public CommentDbContext(DbContextOptions<CommentDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).ValueGeneratedOnAdd();
        });

        // Настройка для логов
        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Id).ValueGeneratedOnAdd();
        });
    }
}