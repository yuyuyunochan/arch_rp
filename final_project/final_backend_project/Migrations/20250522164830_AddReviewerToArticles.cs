using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace final_backend_project.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewerToArticles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
            name: "ReviewerId",
            table: "AspNetArticles",
            type: "text",
            nullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
