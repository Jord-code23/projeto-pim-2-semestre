using System.ComponentModel.DataAnnotations;

namespace BarberTechApi.Models
{
    public class Servico
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public decimal Preco { get; set; }
        public int Duracao { get; set; }
    }
}