using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.ConfigureServices();

var app = builder.Build();

app.ConfigurePipeline(builder.Configuration);

app.Run();

// create public partial class Program
public partial class Program { }