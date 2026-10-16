using Microsoft.EntityFrameworkCore;
using NewsPortal.API.Data;
using NewsPortal.API.DTOs;
using NewsPortal.API.Entities;

namespace NewsPortal.API.Services;

public class CategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        return await _db.Categories
            .OrderBy(c => c.Id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                NameKa = c.NameKa,
                NameEn = c.NameEn
            })
            .ToListAsync();
    }

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto request)
    {
        var category = new Category
        {
            NameKa = request.NameKa.Trim(),
            NameEn = request.NameEn.Trim()
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            NameKa = category.NameKa,
            NameEn = category.NameEn
        };
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryUpdateDto request)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null)
            return null;

        category.NameKa = request.NameKa.Trim();
        category.NameEn = request.NameEn.Trim();
        await _db.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            NameKa = category.NameKa,
            NameEn = category.NameEn
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category is null)
            return false;

        var hasArticles = await _db.Articles.AnyAsync(a => a.CategoryId == id);
        if (hasArticles)
            throw new InvalidOperationException("Cannot delete category that has articles.");

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return true;
    }
}