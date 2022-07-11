using API_Net.Data;
using API_Net.Models;
using Microsoft.EntityFrameworkCore;

namespace API_Net.Repositories;

public class DbPersonRepository : IPersonRepository
{
    
    private readonly DataContext _context;
    
    public DbPersonRepository(DataContext context)
    {
        _context = context;
    }
    public async Task<Person> GetPersonAsync(int id)
    {
        var person = await _context.Person.FindAsync(id.ToString());
        return person;
    }
    
    public async Task<Person> GetPersonIdAsync(string id)
    {
        var person = _context.Person.FirstOrDefault(t => t.ID_Persona == id);
        return person;
    }

    public async Task<IEnumerable<Person>> GetPersonsAsync()
    {
        return await _context.Person.ToListAsync();  
    }

    public async Task CreatePersonAsync(Person item)
    {
        _context.Person.Add(item);  
        await _context.SaveChangesAsync();  
    }

    public async Task UpdatePersonAsync(Person item, string id)
    {
        var dbPerson = _context.Person.FirstOrDefault(t => t.ID_Persona == item.ID_Persona);
        if (dbPerson == null)
            return;
        _context.Person.Remove(dbPerson);  
        _context.Person.Add(item);  
        await _context.SaveChangesAsync();
    }

    public async Task DeletePersonAsync(Person person)
    {
        var entity = _context.Person.FirstOrDefault(t => t.Cedula == person.Cedula);  
        _context.Person.Remove(entity);  
        await _context.SaveChangesAsync();
    }
}