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
        table: "AspNetArticles",
        type: "text",
        nullable: true);
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropColumn(
        name: "FilePath",
        table: "AspNetArticles");
}    }
}
