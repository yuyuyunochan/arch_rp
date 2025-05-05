using CommentApi.Models;
using CommentApi.Data;
using Microsoft.EntityFrameworkCore;
using System;

namespace CommentApi.Logging;

public class DatabaseLogger : ILogger
{
    private readonly string _categoryName;
    private readonly Func<LogLevel, bool> _filter;
    private readonly IDbContextFactory<CommentDbContext> _dbContextFactory;

    public DatabaseLogger(string categoryName, Func<LogLevel, bool> filter, IDbContextFactory<CommentDbContext> dbContextFactory)
    {
        _categoryName = categoryName;
        _filter = filter;
        _dbContextFactory = dbContextFactory;
    }
    public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;


    public bool IsEnabled(LogLevel logLevel) => _filter(logLevel);

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        if (!IsEnabled(logLevel))
        {
            return;
        }

        if (formatter == null)
        {
            throw new ArgumentNullException(nameof(formatter));
        }

        var message = formatter(state, exception);

        if (string.IsNullOrEmpty(message))
        {
            return;
        }
        using (var dbContext = _dbContextFactory.CreateDbContext())
        {
            try
            {
                var logEntry = new Log
                {
                    Timestamp = DateTime.UtcNow,
                    LogLevel = logLevel.ToString(),
                    Message = message,
                    Exception = exception?.ToString()
                };

                dbContext.LogEntries.Add(logEntry);
                dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error writing log to database: {ex.Message}");
            }
        }
    }

    private class EmptyDisposable : IDisposable
    {
        public void Dispose() { }
    }
}