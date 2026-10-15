using System.Security.Cryptography.X509Certificates;

namespace NewsPortal.API.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.User;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Article> Articles { get; set; } = new List<Article>();
        public ICollection<FavoriteArticle> FavoriteArticles { get; set; } = new List<FavoriteArticle>();
    }
}
