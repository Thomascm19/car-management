using System.Text.Json;
using API_Net.Models;
using API_Net.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace API_Net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class PersonController : ControllerBase
    {
        
        private readonly IPersonRepository _repository;
        private readonly ILogger<PersonController> _logger;
        
        public PersonController(IPersonRepository repository, ILogger<PersonController> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        
        // GET: api/Person
        [HttpGet]
        public async Task<ActionResult<List<Person>>> GetPersons()
        {
            var persons = (await _repository.GetPersonsAsync()).ToList();
            _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Retrieved {persons.Count} persons");
            return persons;
        }

        // GetByID: api/Person/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await _repository.GetPersonAsync(id);
            if (person == null)
            {
                _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Person with id {id} not found");
                return NotFound();
            }
            _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Retrieved person with id {id}");
            return person;
        }
        
        // GetPersonID: api/Person/getById/5
        [HttpGet("getById/{personId}")]
        public async Task<ActionResult<Person>> GetPersonId(string personId)
        {
            var person = await _repository.GetPersonIdAsync(personId);
            if (person == null)
            {
                _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Person with id {personId} not found");
                return NotFound();
            }
            _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Retrieved person with id {personId}");
            return person;
        }

        // POST: api/Person
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(Person person)
        {
            var item = await _repository.GetPersonIdAsync(person.ID_Persona);
            if (item == null)
            {
                await _repository.CreatePersonAsync(person);
                _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Created person with id {person.Cedula}");
                return await GetPerson(Int32.Parse(person.Cedula));   
            }
            return await GetPerson(Int32.Parse(item.Cedula));
        }

        // PUT: api/Person/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Person>> UpdatePerson(int id, Person person)
        {
            var item = await _repository.GetPersonIdAsync(person.ID_Persona);
            if (item == null)
            {
                _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Person with id {person.ID_Persona} not found");
                return NotFound();
            }
            await _repository.UpdatePersonAsync(person, person.ID_Persona);
            _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Updated person with id {id}");
            return await GetPerson(id);
        }

        // DELETE: api/Person/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Person>>> DeletePerson(int id)
        {
            var person = await _repository.GetPersonAsync(id);
            if (person == null)
            {
                _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Person with id {id} not found");
                return NotFound();
            }
            await _repository.DeletePersonAsync(person);
            _logger.LogInformation($"{DateTime.UtcNow.ToString("hh:mm:ss")}: Deleted person with id {id}");
            var persons = (await _repository.GetPersonsAsync()).ToList();
            return persons;
        }
    }
}
