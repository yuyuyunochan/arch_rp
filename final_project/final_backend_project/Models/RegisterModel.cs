using System;

namespace final_backend_project.Models
{
            public class RegisterModel
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } // Новая строка для роли
        }
}