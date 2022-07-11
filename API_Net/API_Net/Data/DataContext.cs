using API_Net.Models;
using Microsoft.EntityFrameworkCore;
namespace API_Net.Data;

public class DataContext : DbContext
{
    
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }
    
    public DbSet<Person> Person { get; set; }
}