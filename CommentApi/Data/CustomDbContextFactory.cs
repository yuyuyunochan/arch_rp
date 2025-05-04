// Data/CustomDbContextFactory.cs
using Microsoft.EntityFrameworkCore;

namespace CommentApi.Data;

public class CustomDbContextFactory : IDbContextFactory<CommentDbContext>
{
    private readonly IServiceProvider _serviceProvider;

    public CustomDbContextFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public CommentDbContext CreateDbContext()
    {
        var scope = _serviceProvider.CreateScope();
        var options = scope.ServiceProvider.GetRequiredService<DbContextOptions<CommentDbContext>>();
        return new CommentDbContext(options);
    }
}