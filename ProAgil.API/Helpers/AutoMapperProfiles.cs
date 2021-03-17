using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Domain;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
                .ForMember(dest => dest.Palestrante, opt => {
                    opt.MapFrom(origin => origin.PalestranteEventos.Select(x => x.Palestrante).ToList());
                })
                .ReverseMap(); 
                //O método ReverseMap() permite que o mapeamento ocorra nos dois sentidos 
                // de Evento para EventoDto e de EventoDto para Evento

            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt => {
                    opt.MapFrom(origin => origin.PalestranteEventos.Select(x => x.Palestrante).ToList());
                })
                .ReverseMap();

            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
        }
    }
}