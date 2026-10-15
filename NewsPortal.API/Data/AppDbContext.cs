using Microsoft.EntityFrameworkCore;
using NewsPortal.API.Entities;

namespace NewsPortal.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Article> Articles => Set<Article>();
        public DbSet<FavoriteArticle> FavoriteArticles => Set<FavoriteArticle>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Email must be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // FavoriteArticle: composite primary key
            modelBuilder.Entity<FavoriteArticle>().HasKey(f => new { f.UserId, f.ArticleId });

            modelBuilder.Entity<FavoriteArticle>().
                HasOne(f => f.User).
                WithMany(u => u.FavoriteArticles).
                HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FavoriteArticle>()
                .HasOne(f => f.Article)
                .WithMany(a => a.FavoritedBy)
                .HasForeignKey(f => f.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Article => Author
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Author)
                .WithMany(u => u.Articles)
                .HasForeignKey(a => a.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Article => Category
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Category)
                .WithMany(c => c.Articles)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
