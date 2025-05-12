using Microsoft.AspNetCore.Identity;

namespace final_backend_project.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Role { get; set; }
    }
}