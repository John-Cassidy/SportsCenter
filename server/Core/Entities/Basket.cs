namespace Core.Entities;

public class Basket
{
    public Basket()
    {
    }

    public Basket(string id)
    {
        Id = id;
        UserName = null;
    }

    public string Id { get; set; }
    public string UserName { get; set; }
    public List<BasketItem> Items { get; set; } = new List<BasketItem>();
}
