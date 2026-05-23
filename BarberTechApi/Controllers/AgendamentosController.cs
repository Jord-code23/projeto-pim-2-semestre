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
        [HttpPost]
[Authorize] // Exige token
public async Task<IActionResult> CriarAgendamento(Agendamento request)
{
    // 1. Pegar o ID do cliente que está logado (vem do Token JWT)
    var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    
    if (userIdClaim == null)
    {
        return Unauthorized("Usuário não identificado no token.");
    }

    // 2. Atribuir o ID do cliente ao agendamento
    request.ClienteId = int.Parse(userIdClaim.Value);
    request.Status = "pendente";

    // 3. Salvar no banco
    try 
    {
        _context.Agendamentos.Add(request);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Agendamento confirmado!", id = request.Id });
    }
    catch (Exception ex)
    {
        // Isso ajuda a ver o erro real no terminal se algo der errado
        Console.WriteLine($"Erro ao salvar: {ex.Message}");
        return StatusCode(500, "Erro interno ao salvar o agendamento.");
    }
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