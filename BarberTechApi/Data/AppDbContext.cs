using Microsoft.EntityFrameworkCore;
using BarberTechApi.Models;

namespace BarberTechApi.Data
{
    public class AppDbContext : DbContext
    {
        // Construtor que recebe as opções de conexão
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        // Tabelas do Banco
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Agendamento> Agendamentos { get; set; }
        public DbSet<Barbeiro> Barbeiros { get; set; }
        public DbSet<Servico> Servicos { get; set; }
    }
}