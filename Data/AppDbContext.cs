using Microsoft.EntityFrameworkCore;

namespace BarberTechApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Tabela de Usuários
        public DbSet<Usuario> Usuarios { get; set; }
    }
}