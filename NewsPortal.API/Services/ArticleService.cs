using Microsoft.EntityFrameworkCore;
using NewsPortal.API.Data;
using NewsPortal.API.DTOs;
using NewsPortal.API.Entities;

namespace NewsPortal.API.Services;

public class ArticleService
{
    private readonly AppDbContext _db;

    public ArticleService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResultDto<ArticleDto>> GetPagedAsync(int page, int pageSize, int? categoryId)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var query = _db.Articles.AsNoTracking().AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(a => a.CategoryId == categoryId.Value);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Content = a.Content,
                ImageUrl = a.ImageUrl,
                CreatedAt = a.CreatedAt,
                CategoryId = a.CategoryId,
                CategoryNameKa = a.Category.NameKa,
                CategoryNameEn = a.Category.NameEn,
                AuthorId = a.AuthorId,
                AuthorName = a.Author.FirstName + " " + a.Author.LastName
            })
            .ToListAsync();

        return new PagedResultDto<ArticleDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<ArticleDto?> GetByIdAsync(int id)
    {
        return await _db.Articles
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Content = a.Content,
                ImageUrl = a.ImageUrl,
                CreatedAt = a.CreatedAt,
                CategoryId = a.CategoryId,
                CategoryNameKa = a.Category.NameKa,
                CategoryNameEn = a.Category.NameEn,
                AuthorId = a.AuthorId,
                AuthorName = a.Author.FirstName + " " + a.Author.LastName
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ArticleDto?> CreateAsync(ArticleCreateDto request, int authorId)
    {
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
            return null;

        var article = new Article
        {
            Title = request.Title.Trim(),
            Content = request.Content,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            AuthorId = authorId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Articles.Add(article);
        await _db.SaveChangesAsync();

        return await GetByIdAsync(article.Id);
    }

    public async Task<ArticleDto?> UpdateAsync(int id, ArticleUpdateDto request, int userId, bool isSuperAdmin)
    {
        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == id);
        if (article is null)
            return null;

        if (!isSuperAdmin && article.AuthorId != userId)
            throw new UnauthorizedAccessException("You can only edit your own articles.");

        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
            return null;

        article.Title = request.Title.Trim();
        article.Content = request.Content;
        article.ImageUrl = request.ImageUrl;
        article.CategoryId = request.CategoryId;

        await _db.SaveChangesAsync();
        return await GetByIdAsync(article.Id);
    }

    public async Task<bool> DeleteAsync(int id, int userId, bool isSuperAdmin)
    {
        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == id);
        if (article is null)
            return false;

        if (!isSuperAdmin && article.AuthorId != userId)
            throw new UnauthorizedAccessException("You can only delete your own articles.");

        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();
        return true;
    }
}
