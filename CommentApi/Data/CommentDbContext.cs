using CommentApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CommentApi.Data;

public class CommentDbContext : DbContext
{
    public DbSet<Comment> Comments { get; set; }

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
        entity.Property(c => c.Id).ValueGeneratedOnAdd(); // Автоинкремент
        entity.Property(c => c.Name).IsRequired().HasMaxLength(255);
        entity.Property(c => c.Email).IsRequired().HasMaxLength(255);
        entity.Property(c => c.Body).IsRequired();
    });
}
}