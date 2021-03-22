import * as CryptoJS from 'crypto-js';
import {Mutant, IMutant} from '../models/Mutant';
import {Stats, IStats} from '../models/Stats';

export class DNAChecker{
   //campos
   public secuencia: Array<string>;
   private hashSecuencia: string;

   //constructor 
   constructor(secuencia: Array<string>) { 
    this.secuencia = secuencia 
    this.hashSecuencia = CryptoJS.SHA256(this.secuencia.join('')).toString(CryptoJS.enc.Hex);
   }

   //funciones publicas
   public async EsMutante():Promise<any>{
        if(!this.ValidarTamanoSecuencia())
            return false;

        const existeMutante = await this.ExisteMutanteRegistrado();
        console.log(existeMutante);
        if(existeMutante != null)
            return existeMutante;

        const referencia = {contadorSecuenciasIguales: 0};
        for(let i = 0; i <= this.secuencia.length - 1; i++){
           if(referencia.contadorSecuenciasIguales <= 1){
               for(let j = 0; j <= this.secuencia.length -1; j++){
                  if(referencia.contadorSecuenciasIguales <= 1){
                     this.AnalizarPosicion(i, j, this.secuencia[i].charAt(j), this.secuencia, this.secuencia[i].charAt(j), TipoAnalisis.Todo, referencia);
                  }
                  else{
                     break;
                  }
               }
           }
           else{
              break;
           }
        }

        this.GuardarRegistroAnalizado(referencia.contadorSecuenciasIguales >= 2 ? true : false);
        return referencia.contadorSecuenciasIguales >= 2 ? true : false;
   }

   // Revisar si existe el registro por hash
   private async ExisteMutanteRegistrado(): Promise<any>{
      const _mutant = await Mutant.findOne({hashDNA : this.hashSecuencia}).exec();
      if(_mutant == null)
         return null;
      return _mutant.isMutant;
   }

   // Metodo que almacena el registro dentro de la base de datos mongo
   private async GuardarRegistroAnalizado(esMutante:boolean): Promise<void>{
      const _registro = new Mutant();
      _registro.hashDNA = this.hashSecuencia;
      _registro.DNA = this.secuencia;
      _registro.isMutant = esMutante;

      await (await Mutant.create(_registro)).execPopulate();
      await this.ActualizarEstadistica(esMutante);
   }

   private async ActualizarEstadistica(esMutante:boolean): Promise<void>{
      let _stats = await Stats.findOne().exec();
      if(_stats == null){
         _stats = new Stats();
         _stats.count_human_dna = !esMutante ? 1 : 0;
         _stats.count_mutant_dna = esMutante ? 1 : 0;
         _stats.ratio = esMutante ? 1 : 0;
         await (await Stats.create(_stats)).execPopulate();
      }
      else{
         _stats.count_human_dna = !esMutante ? +_stats.count_human_dna + 1 : _stats.count_human_dna;
         _stats.count_mutant_dna = esMutante ? +_stats.count_mutant_dna + 1 : _stats.count_mutant_dna;
         _stats.ratio = _stats.count_human_dna == 0 ? 0 : +_stats.count_mutant_dna/+_stats.count_human_dna;

         await Stats.findByIdAndUpdate(_stats.id,
                                       _stats).exec();
      }
   }

   // Validacion del tamaño de la secuencia
   private ValidarTamanoSecuencia():any{
      //Se crea un arreglo con los tamaños de string de cada elemento de la secuencia
      let tamanos = this.secuencia.map(function(item){
         return item.length;
      });

      return tamanos.every(val => val === tamanos[0]);
   }

   // Metodo recursivo para analizar secuencias iguales dentro de la matriz de secuencia
   private AnalizarPosicion(i:number, j:number, valorPadre:string, secuencia:Array<string>, valorExtraido:string, tipoAnalisis:TipoAnalisis, ref: {contadorSecuenciasIguales:number}):any{
      // Analizar la matriz en las posicion alrededor de la solicitada coordenada
      // Como se esta recorriendo la matriz en orden se omiten los movimientos relacionados con izquierda y arriba, 
      // evitando analizar dos veces la misma posicion
      //izquierda
      //if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.Izquierda) && ((j-1) >= 0 && secuencia[i].charAt(j-1) == valorPadre))
      //   this.AnalizarPosicion(i,j-1, valorPadre, secuencia, valorExtraido + secuencia[i].charAt(j-1), TipoAnalisis.Izquierda);
      //derecha
      if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.Derecha) && ((j+1) <= secuencia.length-1 && secuencia[i].charAt(j+1) == valorPadre))
         this.AnalizarPosicion(i,j+1, valorPadre, secuencia, valorExtraido + secuencia[i].charAt(j+1), TipoAnalisis.Derecha, ref);
      //arriba
      //if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.Arriba) && ((i-1) >= 0 && secuencia[i-1].charAt(j) == valorPadre))
      //   this.AnalizarPosicion(i-1,j, valorPadre, secuencia, valorExtraido + secuencia[i-1].charAt(j), TipoAnalisis.Arriba);
      //abajo
      if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.Abajo) && ((i+1) <= secuencia.length - 1 && secuencia[i+1].charAt(j) == valorPadre))
         this.AnalizarPosicion(i+1,j, valorPadre, secuencia, valorExtraido + secuencia[i+1].charAt(j), TipoAnalisis.Abajo, ref);
      //izquierda arriba
      //f((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.IzquierdaArriba) && ((j-1) >= 0 && (i-1) >= 0 && secuencia[i-1].charAt(j-1) == valorPadre))
      //   this.AnalizarPosicion(i-1, j-1, valorPadre, secuencia, valorExtraido + secuencia[i-1].charAt(j-1), TipoAnalisis.IzquierdaArriba);
      //izquierda abajo
      //if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.IzquierdaAbajo) && ((j-1) >= 0 && (i+1) <= secuencia.length - 1 && secuencia[i+1].charAt(j-1) == valorPadre))
      //   this.AnalizarPosicion(i+1, j-1, valorPadre, secuencia, valorExtraido + secuencia[i+1].charAt(j-1), TipoAnalisis.IzquierdaAbajo);
      //derecha arriba
      if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.DerechaArriba) && ((j+1) <= secuencia.length - 1 && (i-1) >= 0 && secuencia[i-1].charAt(j+1) == valorPadre))
         this.AnalizarPosicion(i-1, j+1, valorPadre, secuencia, valorExtraido + secuencia[i-1].charAt(j+1), TipoAnalisis.DerechaArriba, ref);
      //derecha abajo
      if ((tipoAnalisis == TipoAnalisis.Todo || tipoAnalisis == TipoAnalisis.DerechaAbajo) && ((j+1) <= secuencia.length - 1 && (i+1) <= secuencia.length - 1 && secuencia[i+1].charAt(j+1) == valorPadre))
         this.AnalizarPosicion(i+1, j+1, valorPadre, secuencia, valorExtraido + secuencia[i+1].charAt(j+1), TipoAnalisis.DerechaAbajo, ref);
      
      
      if (valorExtraido.length == 4){
         ref.contadorSecuenciasIguales = ref.contadorSecuenciasIguales + 1;
      } 
   }
}

// Tipos de movimientos para revisar la matriz de DNA
enum TipoAnalisis{
   Todo,
   Izquierda,
   Derecha,
   Abajo,
   Arriba,
   IzquierdaArriba,
   IzquierdaAbajo,
   DerechaArriba,
   DerechaAbajo
}