using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BarberTechApi.Data;
using BarberTechApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BarberTechApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Exige login (Token JWT)
    public class AgendamentosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgendamentosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CriarAgendamento(Agendamento request)
        {
            // Validações extras podem ser adicionadas aqui
            request.Status = "pendente";
            
            _context.Agendamentos.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Agendamento confirmado!", id = request.Id });
        }

        [HttpGet("meus-agendamentos")]
        public async Task<IActionResult> GetMeusAgendamentos()
        {
            // Pega o ID do usuário do Token JWT
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            var agendamentos = await _context.Agendamentos
                .Where(a => a.ClienteId.ToString() == userId)
                .ToListAsync();

            return Ok(agendamentos);
        }
    }
}