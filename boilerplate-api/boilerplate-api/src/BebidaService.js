import BebidaRepository from '../repositories/BebidaRepository.js'

export function definiCategoriaLista(nota,jaProvada){
    if(!jaProvada){
        return "Aguardo"
    }
    switch(true){
        case nota >= 7:
            return 'Prsatilheira';
            case nota >= 0 && nota <7:
                return 'Lixo'
                default:
                    return "Aguardo"
    }
}
