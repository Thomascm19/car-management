using API_Net.Models;

namespace API_Net.Repositories;

public interface IPersonRepository
{
    Task<Person> GetPersonAsync(int id);
    Task<Person> GetPersonIdAsync(string id);
    Task<IEnumerable<Person>> GetPersonsAsync();
    Task CreatePersonAsync(Person item);
    Task UpdatePersonAsync(Person item, string id);
    Task DeletePersonAsync(Person person);
}