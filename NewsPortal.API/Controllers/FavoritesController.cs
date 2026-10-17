using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewsPortal.API.Services;

namespace NewsPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // მხოლოდ რეგისტრირებული
public class FavoritesController : ControllerBase
{
    private readonly FavoriteService _favoriteService;

    public FavoritesController(FavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var items = await _favoriteService.GetMyFavoritesAsync(GetUserId());
        return Ok(items);
    }

    [HttpGet("check/{articleId:int}")]
    public async Task<IActionResult> Check(int articleId)
    {
        var isFavorite = await _favoriteService.IsFavoriteAsync(GetUserId(), articleId);
        return Ok(new { isFavorite });
    }

    [HttpPost("{articleId:int}")]
    public async Task<IActionResult> Add(int articleId)
    {
        var ok = await _favoriteService.AddAsync(GetUserId(), articleId);
        if (!ok)
            return NotFound(new { message = "Article not found." });

        return Ok(new { message = "Added to favorites." });
    }

    [HttpDelete("{articleId:int}")]
    public async Task<IActionResult> Remove(int articleId)
    {
        var removed = await _favoriteService.RemoveAsync(GetUserId(), articleId);
        if (!removed)
            return NotFound(new { message = "Favorite not found." });

        return NoContent();
    }
}