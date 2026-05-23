using System.ComponentModel.DataAnnotations;

namespace BarberTechApi.Models
{
    public class Barbeiro
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Especialidade { get; set; }
        public string? FotoUrl { get; set; }
        public int Experiencia { get; set; }
        public decimal Avaliacao { get; set; }
    }
}