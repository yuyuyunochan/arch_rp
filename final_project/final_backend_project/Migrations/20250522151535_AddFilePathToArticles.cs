using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace final_backend_project.Migrations
{
    /// <inheritdoc />
    public partial class AddFilePathToArticles : Migration
    {
        /// <inheritdoc />
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<string>(
        name: "FilePath",
        table: "AspNetArticles", // Убедитесь, что имя таблицы правильное
        type: "text",
        nullable: true); // Разрешаем NULL, если файл необязателен
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropColumn(
        name: "FilePath",
        table: "AspNetArticles"); // Убедитесь, что имя таблицы правильное
}    }
}
