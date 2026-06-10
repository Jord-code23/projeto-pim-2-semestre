using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Precisa deste using

namespace BarberTechApi.Models
{
    public class Agendamento
    {
        [Key]
        public int Id { get; set; }

        // Essas linhas fazem a tradução do nome C# para o nome do Banco
        [Column("cliente_id")]
        public int ClienteId { get; set; }

        [Column("barbeiro_id")]
        public int BarbeiroId { get; set; }

        [Column("servico_id")]
        public int ServicoId { get; set; }

        [Column("data_hora")]
        public DateTime DataHora { get; set; }

        public string Status { get; set; } = "pendente";
    }
}