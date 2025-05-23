using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace final_backend_project.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetArticles_AspNetUsers_ReviewerId",
                table: "AspNetArticles");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalComments",
                table: "AspNetReviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ConfidentialCommentsToEditor",
                table: "AspNetReviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Originality",
                table: "AspNetReviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "OverallRating",
                table: "AspNetReviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PresentationQuality",
                table: "AspNetReviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Recommendation",
                table: "AspNetReviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnicalMerit",
                table: "AspNetReviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReviewerId",
                table: "AspNetArticles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "FilePath",
                table: "AspNetArticles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetArticles_AspNetUsers_ReviewerId",
                table: "AspNetArticles",
                column: "ReviewerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetArticles_AspNetUsers_ReviewerId",
                table: "AspNetArticles");

            migrationBuilder.DropColumn(
                name: "AdditionalComments",
                table: "AspNetReviews");

            migrationBuilder.DropColumn(
                name: "ConfidentialCommentsToEditor",
                table: "AspNetReviews");

            migrationBuilder.DropColumn(
                name: "Originality",
                table: "AspNetReviews");

            migrationBuilder.DropColumn(
                name: "OverallRating",
                table: "AspNetReviews");

            migrationBuilder.DropColumn(
                name: "PresentationQuality",
                table: "AspNetReviews");

            migrationBuilder.DropColumn(
                name: "Recommendation",
                table: "AspNetReviews");

            migrationBuilder.DropColumn(
                name: "TechnicalMerit",
                table: "AspNetReviews");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "ReviewerId",
                table: "AspNetArticles",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FilePath",
                table: "AspNetArticles",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetArticles_AspNetUsers_ReviewerId",
                table: "AspNetArticles",
                column: "ReviewerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
