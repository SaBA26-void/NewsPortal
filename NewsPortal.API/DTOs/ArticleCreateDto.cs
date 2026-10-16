using System.ComponentModel.DataAnnotations;

namespace NewsPortal.API.DTOs;

public class ArticleCreateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    [Required]
    public int CategoryId { get; set; }
}

public class ArticleUpdateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    [Required]
    public int CategoryId { get; set; }
}

public class ArticleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    public int CategoryId { get; set; }
    public string CategoryNameKa { get; set; } = string.Empty;
    public string CategoryNameEn { get; set; } = string.Empty;

    public int AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
}

// პაგინაციის response
public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => PageSize == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);
}