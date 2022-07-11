using System.ComponentModel.DataAnnotations;
namespace API_Net.Models;

public class Person
{
    [Key]
    public string Cedula { get; set; }    
    
    public string ID_Persona { get; set; }
    
    public string Nombre { get; set; }

    public int Edad { get; set; }

    public string Tiempo_Simulacion { get; set; }
    
    public string Fecha_Simulacion { get; set; }
}