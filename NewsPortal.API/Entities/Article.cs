using System.Security.Cryptography.X509Certificates;

namespace NewsPortal.API.Entities
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
        public ICollection<FavoriteArticle> FavoritedBy { get; set; } = new List<FavoriteArticle>();

    }
}
