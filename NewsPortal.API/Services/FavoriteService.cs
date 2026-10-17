using Microsoft.EntityFrameworkCore;
using NewsPortal.API.Data;
using NewsPortal.API.DTOs;
using NewsPortal.API.Entities;

namespace NewsPortal.API.Services;

public class FavoriteService
{
    private readonly AppDbContext _db;

    public FavoriteService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ArticleDto>> GetMyFavoritesAsync(int userId)
    {
        return await _db.FavoriteArticles
            .AsNoTracking()
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new ArticleDto
            {
                Id = f.Article.Id,
                Title = f.Article.Title,
                Content = f.Article.Content,
                ImageUrl = f.Article.ImageUrl,
                CreatedAt = f.Article.CreatedAt,
                CategoryId = f.Article.CategoryId,
                CategoryNameKa = f.Article.Category.NameKa,
                CategoryNameEn = f.Article.Category.NameEn,
                AuthorId = f.Article.AuthorId,
                AuthorName = f.Article.Author.FirstName + " " + f.Article.Author.LastName
            })
            .ToListAsync();
    }

    public async Task<bool> IsFavoriteAsync(int userId, int articleId)
    {
        return await _db.FavoriteArticles
            .AnyAsync(f => f.UserId == userId && f.ArticleId == articleId);
    }

    public async Task<bool> AddAsync(int userId, int articleId)
    {
        var articleExists = await _db.Articles.AnyAsync(a => a.Id == articleId);
        if (!articleExists)
            return false;

        var already = await IsFavoriteAsync(userId, articleId);
        if (already)
            return true; // idempotent

        _db.FavoriteArticles.Add(new FavoriteArticle
        {
            UserId = userId,
            ArticleId = articleId,
            CreatedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveAsync(int userId, int articleId)
    {
        var fav = await _db.FavoriteArticles
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ArticleId == articleId);

        if (fav is null)
            return false;

        _db.FavoriteArticles.Remove(fav);
        await _db.SaveChangesAsync();
        return true;
    }
}