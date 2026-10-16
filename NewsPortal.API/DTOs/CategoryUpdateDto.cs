using System.ComponentModel.DataAnnotations;

namespace NewsPortal.API.DTOs;

public class CategoryUpdateDto
{
    [Required, MaxLength(100)]
    public string NameKa { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string NameEn { get; set; } = string.Empty;
}