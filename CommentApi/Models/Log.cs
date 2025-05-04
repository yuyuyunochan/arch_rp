namespace CommentApi.Models;

public class Log
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string LogLevel { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Exception { get; set; }
}