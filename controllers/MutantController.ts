import {DNAChecker} from '../dnachecker/DnaChecker';

export async function checkDNA(req, res, next){
    let _dnaChecker = new DNAChecker(req.body.dna);
    
    if(await _dnaChecker.EsMutante())
        res.status(200).send("Ok");
    else
        res.status(403).send("Forbidden");
}