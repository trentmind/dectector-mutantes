import { expect } from 'chai';
import {DNAChecker} from '../dnachecker/DnaChecker';

// Inicializar base de datos
import dbconnection from '../dbconnection/dbconnection';
dbconnection();

describe('DNA Checker tests', () => { // Contenedor de pruebas para DNA checker
    it('Test mutante', async () => {
        const secuenciaMutante = new DNAChecker(["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]); // Objeto Mutante
        expect(await secuenciaMutante.EsMutante()).to.be.true;
    });

    it('Test humano', async () => {
        const secuenciaHumana = new DNAChecker(["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTG"]); // Objeto Humano
        expect(await secuenciaHumana.EsMutante()).to.be.false;
    });

    it('Test error', async () => {
        const secuenciaError = new DNAChecker(["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTGT"]); // Objeto Error
        expect(await secuenciaError.EsMutante()).to.be.false;
    });
});