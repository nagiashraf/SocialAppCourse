using API.Data;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers(options => options.Filters.Add<LogUserActivityFilter>());
builder.Services.AddCors();
builder.Services.AddApplicationServices(config);
builder.Services.AddIdentityServices(config);
builder.Services.AddSignalR();

var app = builder.Build();

using (var scopedService = app.Services.CreateScope())
{
    var services = scopedService.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();

        await context.Database.MigrateAsync();
        
        await Seed.SeedRolesAsync(roleManager);
        await Seed.SeedUsersAsync(userManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        if(app.Environment.IsDevelopment()) 
        {
            logger.LogError(ex, "An error ocurred during migration");
        }
        else
        {
            logger.LogError("Internal Server Error");
        } 
    }
}

var versionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        foreach (var description in versionProvider.ApiVersionDescriptions)  
        {
            c.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());  
        }
    });
}

app.UseExceptionMiddleware();

app.UseHttpsRedirection();

app.UseCors(policy => policy.WithOrigins("https://localhost:4200")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

await app.RunAsync();