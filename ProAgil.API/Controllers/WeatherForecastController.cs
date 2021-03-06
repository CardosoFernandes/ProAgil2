﻿using System.Xml.Linq;
using System.Security.Cryptography.X509Certificates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {

        public ProAgilContext _context { get; }

        public WeatherForecastController(ProAgilContext  context)
        {
            this._context = context;
        } 

        [HttpGet]
        public async Task<IActionResult> Get()
        {            
            try
            {
                var results = await _context.Eventos.ToListAsync();
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
                
                //throw new Exception("Base de dados falhou!")
            }        
        }

        //WeatherForecast/id(1,2,3)
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {   
            #region comentários
            /* return (from x in _context.Eventos
                        where x.Id == id
                        select x).FirstOrDefault(); */

            // ou podemos fazer da seguinte forma
            // que estará comentada na parte de baixo

            //return _context.Eventos.FirstOrDefault(x => x.EventoId == id);
            #endregion
            try
            {
                /* var results = (from x in _context.Eventos
                        where x.EventoId == id
                        select x).FirstOrDefaultAsync(); */

                var results = await _context.Eventos.FirstOrDefaultAsync(x => x.Id == id);
                var resultado = _context.Eventos.Select(x => x.Id == id).FirstOrDefault();
                return Ok(results);


            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Servidor falhou!");
            } 
        } 
    }
}
