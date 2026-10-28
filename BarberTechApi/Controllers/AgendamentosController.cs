using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BarberTechApi.Data;
using BarberTechApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BarberTechApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Exige login (Token JWT) para toda a classe
    public class AgendamentosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgendamentosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CriarAgendamento([FromBody] Agendamento request)
        {
            // 1. Pegar o ID do cliente logado via Token JWT
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Usuário não identificado no token.");
            }
            request.ClienteId = int.Parse(userIdClaim.Value);
            request.Status = "pendente";

            // 2. Buscar o serviço para saber a duração exata (minutos)
            var servico = await _context.Servicos.FindAsync(request.ServicoId);
            if (servico == null)
            {
                return BadRequest("Serviço selecionado não encontrado.");
            }

            // Calcular o horário de término do novo agendamento
            var inicioNovo = request.DataHora;
            var fimNovo = inicioNovo.AddMinutes(servico.Duracao);

            // 3. REGRA DE NEGÓCIO: Verificar conflito de horário para o mesmo Barbeiro
            var agendamentosExistentes = await _context.Agendamentos
                .Where(a => a.BarbeiroId == request.BarbeiroId && a.Status != "cancelado")
                .ToListAsync();

            foreach (var ag in agendamentosExistentes)
            {
                var servicoExistente = await _context.Servicos.FindAsync(ag.ServicoId);
                int duracaoExistente = servicoExistente?.Duracao ?? 30; // padrão 30 min
                
                var inicioExistente = ag.DataHora;
                var fimExistente = inicioExistente.AddMinutes(duracaoExistente);

                // Lógica de sobreposição de horários (Overlapping)
                if (inicioNovo < fimExistente && fimNovo > inicioExistente)
                {
                    return BadRequest(new { message = "Este horário conflita com outro agendamento existente para este barbeiro." });
                }
            }

            // 4. Salvar no banco se passar na validação
            try 
            {
                _context.Agendamentos.Add(request);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Agendamento confirmado com sucesso!", id = request.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar: {ex.Message}");
                return StatusCode(500, "Erro interno ao salvar o agendamento.");
            }
        }

        [HttpGet("meus-agendamentos")]
        public async Task<IActionResult> GetMeusAgendamentos()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            var agendamentos = await _context.Agendamentos
                .Where(a => a.ClienteId.ToString() == userId)
                .ToListAsync();

            return Ok(agendamentos);
        }

        [HttpPut("cancelar/{id}")]
        public async Task<IActionResult> CancelarAgendamento(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

            // Buscar o agendamento
            var agendamento = await _context.Agendamentos.FindAsync(id);
            if (agendamento == null)
            {
                return NotFound("Agendamento não encontrado.");
            }

            // Validar se o agendamento pertence ao usuário logado
            if (agendamento.ClienteId != userId)
            {
                return Forbid("Você não tem permissão para cancelar este agendamento.");
            }

            // REGRA DE NEGÓCIO: Antecedência mínima de 2 horas para cancelamento
            var tempoLimite = DateTime.Now.AddHours(2);
            if (agendamento.DataHora <= tempoLimite)
            {
                return BadRequest(new { message = "Cancelamentos devem ser feitos com no mínimo 2 horas de antecedência." });
            }

            agendamento.Status = "cancelado";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Agendamento cancelado com sucesso." });
        }
    }
}