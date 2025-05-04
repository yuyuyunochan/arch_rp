// DesignTimeDbContextFactory.cs
using CommentApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace CommentApi;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<CommentDbContext>
{
    public CommentDbContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var builder = new DbContextOptionsBuilder<CommentDbContext>();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        builder.UseNpgsql(connectionString);

        return new CommentDbContext(builder.Options);
    }
}