namespace API.DTOs;

public class BasketCheckoutDto
{
    public string BasketId { get; set; }
    public string UserName { get; set; }
    public AddressDto ShippingAddress { get; set; }
    public DeliveryOptionDto? DeliveryOption { get; set; }
    public BasketTotalDto BasketTotal { get; set; }
}
