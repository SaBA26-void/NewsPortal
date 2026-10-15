namespace NewsPortal.API.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string NameKa { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;

        public ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}
