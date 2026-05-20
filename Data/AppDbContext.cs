using Microsoft.EntityFrameworkCore;
using BarberTechApi.Models;

namespace BarberTechApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Agendamento> Agendamentos { get; set; }
        //DbSets para Barbeiros e Servicos se quiser gerenciá-los via API

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurações adicionais se necessário
        }
    }
}