// Logging/DatabaseLoggerProvider.cs
using CommentApi.Data;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace CommentApi.Logging;

public class DatabaseLoggerProvider : ILoggerProvider
{
    private readonly Func<string, LogLevel, bool> _filter;
    private readonly IDbContextFactory<CommentDbContext> _dbContextFactory;

    public DatabaseLoggerProvider(Func<string, LogLevel, bool> filter, IDbContextFactory<CommentDbContext> dbContextFactory)
    {
        _filter = filter;
        _dbContextFactory = dbContextFactory;
    }

    public ILogger CreateLogger(string categoryName)
    {
        return new DatabaseLogger(categoryName, logLevel => _filter(categoryName, logLevel), _dbContextFactory);
    }

    public void Dispose() { }
}