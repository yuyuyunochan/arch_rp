using System;
using System.ComponentModel.DataAnnotations;


namespace final_backend_project.Models
{
      public class RegisterModel
{
    [Required(ErrorMessage = "Имя пользователя обязательно.")]
    [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Имя пользователя может содержать только буквы и цифры.")]
    public string  Username { get; set; }

    [Required(ErrorMessage = "Email обязателен.")]
    [EmailAddress(ErrorMessage = "Некорректный email.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Пароль обязателен.")]
    [MinLength(6, ErrorMessage = "Пароль должен содержать минимум 6 символов.")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Роль обязательна.")]
    public string Role { get; set; }
}
}