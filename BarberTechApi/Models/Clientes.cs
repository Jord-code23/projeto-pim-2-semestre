using System.ComponentModel.DataAnnotations;

namespace BarberTechApi.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Senha { get; set; } = string.Empty;
        
        public string? Telefone { get; set; }
    }
}