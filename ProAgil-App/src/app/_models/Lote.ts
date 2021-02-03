export interface Lote {

    id: number;
    nome: string;
    preco: number;
    dataInicio?: Date;
    dataFim?: Date;
    duantidade: number;
    eventoId: number;
}
