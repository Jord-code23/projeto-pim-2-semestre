using System.ComponentModel.DataAnnotations;

namespace BarberTechApi.Models
{
    public class Agendamento
    {
        [Key]
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public int BarbeiroId { get; set; }
        public int ServicoId { get; set; }
        public DateTime DataHora { get; set; }
        public string Status { get; set; } = "pendente";
    }
}