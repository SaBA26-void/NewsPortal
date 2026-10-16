using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewsPortal.API.DTOs;
using NewsPortal.API.Services;

namespace NewsPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ArticleService _articleService;

    public ArticlesController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsSuperAdmin() =>
        User.IsInRole("SuperAdmin");

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? categoryId = null)
    {
        var result = await _articleService.GetPagedAsync(page, pageSize, categoryId);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var article = await _articleService.GetByIdAsync(id);
        if (article is null)
            return NotFound();

        return Ok(article);
    }

    [HttpPost]
    [Authorize(Roles = "Journalist,SuperAdmin")]
    public async Task<IActionResult> Create([FromBody] ArticleCreateDto request)
    {
        var created = await _articleService.CreateAsync(request, GetUserId());
        if (created is null)
            return BadRequest(new { message = "Category not found." });

        return Ok(created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Journalist,SuperAdmin")]
    public async Task<IActionResult> Update(int id, [FromBody] ArticleUpdateDto request)
    {
        try
        {
            var updated = await _articleService.UpdateAsync(id, request, GetUserId(), IsSuperAdmin());
            if (updated is null)
                return NotFound(new { message = "Article or category not found." });

            return Ok(updated);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Journalist,SuperAdmin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _articleService.DeleteAsync(id, GetUserId(), IsSuperAdmin());
            if (!deleted)
                return NotFound();

            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}