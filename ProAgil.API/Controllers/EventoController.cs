using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using AutoMapper;
using ProAgil.API.Dtos;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController: ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            this._repo = repo;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {            
            try
            {
                var eventos = await _repo.GetAllEventoAsync(true);

                var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
            }        
        }

        [HttpGet("{eventoId}")]
        public async Task<ActionResult> Get(int eventoId)
        {   
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventoId, true);
                
                var results = _mapper.Map<EventoDto>(evento);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
            } 
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<ActionResult> Get(string tema)
        {   
            try
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(tema, true);

                var results = _mapper.Map<EventoDto>(eventos);

                return Ok(results);


            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
            } 
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {            
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _repo.Add(evento);

                if(await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Servidor falhou! {ex.Message}");
            }

            return BadRequest();      
        }

        [HttpPut("{eventoId}")]
        public async Task<IActionResult> Put(int eventoId, EventoDto model)
        {            
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventoId, false);
                if (evento == null) return NotFound();

                _mapper.Map(model, evento);

                _repo.Update(evento);

                if(await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
            }

            return BadRequest();      
        }

        [HttpDelete("{eventoId}")]
        public async Task<IActionResult> Delete(int eventoId)
        {            
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventoId, false);
                if (evento == null) return NotFound();

                _repo.Delete(evento);

                if(await _repo.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
            }

            return BadRequest();      
        }
    }
}